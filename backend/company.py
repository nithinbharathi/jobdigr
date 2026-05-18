from litellm import completion
from typing import Optional

def get_company_info(company: str) -> Optional[str]:
    try:
        response = completion(
            model="gemini/gemini-2.5-flash",
            messages=[
                {"role": "system", "content": "You are a job research assistant."},
                {"role": "user", "content": f"What does {company} do? Provide a brief, one-line description of their main business and products/services."}
            ],
            timeout=10
        )
        
        company_info = response.choices[0].message.content
        return company_info if company_info else ""
    except Exception as e:
        print(f" LLM Inference Failed with error: {str(e)}")
        return "LLM inference failed. Please check the logs"
