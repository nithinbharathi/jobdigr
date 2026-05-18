from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from backend.company import get_company_info
from backend.linkedin_profiles import get_linkedin_profiles
from backend.keywords import get_missing_keywords

app = FastAPI(title="JobDigr API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response Models
class LinkedInProfile(BaseModel):
    url: str
    title: str
    content: str | None = None
    score: float | None = None


class AnalysisResult(BaseModel):
    company_name: str
    company_info: str
    linkedin_profiles: List[LinkedInProfile]
    missing_keywords: List[str]


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "JobDigr API is running"}


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_application(company_name: str = Form(...), job_description: str = Form(...), resume: UploadFile = File(...)):
    try:
        if not company_name or not company_name.strip():
            raise HTTPException(status_code=400, detail="Company name is required")
        
        if not job_description or not job_description.strip():
            raise HTTPException(status_code=400, detail="Job description is required")
        
        if not resume:
            raise HTTPException(status_code=400, detail="Resume file is required")

        resume_content = await resume.read()
        if not resume_content:
            raise HTTPException(status_code=400, detail="Resume file is empty")
        
        
        missing_keywords = get_missing_keywords(job_description, resume_content)

        company_info = get_company_info(company_name)
        
        linkedin_profiles = get_linkedin_profiles(company_name, num_profiles=3)
        
        return AnalysisResult(company_name=company_name, company_info=company_info, linkedin_profiles=linkedin_profiles, missing_keywords = missing_keywords)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500,detail=f"An internal error occurred during analysis: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
