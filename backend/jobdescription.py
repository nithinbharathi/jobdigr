from litellm import completion
from typing import Optional

def get_jd_keywords(jd: str) -> Optional[str]:
    try:
        response = completion(
            model="gemini/gemini-2.5-flash",
            messages=[
                {"role": "system", "content": "You are a job description analyzer."},
                {"role": "user", "content": f"Return only the technologies lisetd in the jd: {jd}"}
            ],
            timeout=10
        )
        
        company_info = response.choices[0].message.content
        return company_info if company_info else jd
    except Exception as e:
        print(f"Error getting company info: {str(e)}")
        return jd