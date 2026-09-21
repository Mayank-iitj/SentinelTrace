import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Multi-task simulated "BERT" head that operates on structural features
class MultiTaskClassifier(nn.Module):
    def __init__(self, input_dim=3, hidden_dim=64):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU()
        )
        # 6 classes for Technique: 0=Clean, 1=T1, 2=T2, 3=T3, 4=T4, 5=T5
        self.technique_head = nn.Linear(hidden_dim, 6)
        # 3 classes for Severity: 0=Low, 1=Medium, 2=High
        self.severity_head = nn.Linear(hidden_dim, 3)

    def forward(self, x):
        shared_rep = self.shared(x)
        tech_logits = self.technique_head(shared_rep)
        sev_logits = self.severity_head(shared_rep)
        return tech_logits, sev_logits

def generate_synthetic_data(num_samples=2000):
    data = []
    tech_labels = []
    sev_labels = []
    
    for _ in range(num_samples):
        is_attack = random.random() < 0.25
        if is_attack:
            technique = random.choice(["T1", "T2", "T3", "T4", "T5"])
            if technique == "T1":
                latency, entropy, context = random.randint(200, 600), random.uniform(3.5, 4.5), random.randint(200, 800)
                tech_labels.append(1)
                sev_labels.append(2) # High
            elif technique == "T2":
                latency, entropy, context = random.randint(300, 1000), random.uniform(4.5, 6.0), random.randint(800, 2000)
                tech_labels.append(2)
                sev_labels.append(2) # High
            elif technique == "T3":
                latency, entropy, context = random.randint(2000, 8000), random.uniform(2.0, 3.5), random.randint(10, 50)
                tech_labels.append(3)
                sev_labels.append(1) # Medium
            elif technique == "T4":
                latency, entropy, context = random.randint(100, 400), random.uniform(3.0, 4.0), random.randint(50000, 100000)
                tech_labels.append(4)
                sev_labels.append(2) # High
            else: # T5
                latency, entropy, context = random.randint(100, 400), random.uniform(7.5, 9.0), random.randint(100, 500)
                tech_labels.append(5)
                sev_labels.append(1) # Medium
        else:
            latency, entropy, context = random.randint(50, 400), random.uniform(3.0, 4.5), random.randint(10, 150)
            tech_labels.append(0)
            sev_labels.append(0) # Low
            
        data.append([latency, entropy, context])
        
    return torch.tensor(data, dtype=torch.float32), torch.tensor(tech_labels, dtype=torch.long), torch.tensor(sev_labels, dtype=torch.long)

def train_and_export():
    logger.info("Generating synthetic trace dataset...")
    X, y_tech, y_sev = generate_synthetic_data(5000)
    
    # Normalize features for NN
    X_mean = X.mean(dim=0, keepdim=True)
    X_std = X.std(dim=0, keepdim=True)
    X_scaled = (X - X_mean) / (X_std + 1e-8)
    
    # Save scaling params for inference
    np.save("scaler_params.npy", {'mean': X_mean.numpy(), 'std': X_std.numpy()})
    
    model = MultiTaskClassifier()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.CrossEntropyLoss()
    
    logger.info("Training Multi-Task PyTorch model...")
    for epoch in range(100):
        optimizer.zero_grad()
        tech_logits, sev_logits = model(X_scaled)
        
        loss_tech = criterion(tech_logits, y_tech)
        loss_sev = criterion(sev_logits, y_sev)
        loss = loss_tech + loss_sev
        
        loss.backward()
        optimizer.step()
        
    logger.info("Exporting multi-task model to ONNX...")
    model.eval()
    dummy_input = torch.randn(1, 3)
    torch.onnx.export(
        model, 
        dummy_input, 
        "model.onnx", 
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input_features'],
        output_names=['technique_logits', 'severity_logits'],
        dynamic_axes={'input_features': {0: 'batch_size'},
                      'technique_logits': {0: 'batch_size'},
                      'severity_logits': {0: 'batch_size'}}
    )
    logger.info("Model saved to model.onnx")

if __name__ == "__main__":
    train_and_export()
