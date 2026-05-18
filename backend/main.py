"""
JobDigr Backend Entry Point
Run the FastAPI backend server
"""

if __name__ == "__main__":
    import uvicorn
    from backend.api import app
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
