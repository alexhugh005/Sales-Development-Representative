# backend/grok_client.py
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv(""),
    base_url="https://api.x.ai/v1"
)

def qualify_lead(lead_data: dict, icp: str):
    prompt = f"""
    You are an expert SDR. Qualify this lead based on ICP: {icp}
    Lead: {lead_data}
    Output JSON: {{"qualified": bool, "score": 1-10, "reason": str}}
    """
    response = client.chat.completions.create(
        model="grok-4",  # Or "grok-4-fast-reasoning" for tools
        messages=[{"role": "system", "content": "You are a helpful SDR AI."},
                  {"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content

def generate_outreach(lead_data: dict, context: str = ""):
    prompt = f"Write a personalized cold email for this lead: {lead_data}. Use recent news if relevant. {context}"
    response = client.chat.completions.create(
        model="grok-4-1-fast",
        messages=[{"role": "user", "content": prompt}],
        tools=[{"type": "web_search"}] if needed  # Grok can auto-use tools
    )
    return response.choices[0].message.content
