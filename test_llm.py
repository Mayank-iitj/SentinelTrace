import asyncio
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")

async def test_llm():
    try:
        print("Testing LLM connection with gpt-5-nano...")
        client = AsyncOpenAI(api_key=api_key)
        
        response = await client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {"role": "system", "content": "You are an expert AI SOC Analyst."},
                {"role": "user", "content": "Test analysis for Privilege Escalation: list_users -> assume_role -> read_secrets. Respond with a short confirmation."}
            ]
        )
        print("SUCCESS! LLM Response:")
        print(response.choices[0].message.content)
    except Exception as e:
        print(f"FAILED! Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_llm())
