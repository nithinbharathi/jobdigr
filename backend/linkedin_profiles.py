from tavily import TavilyClient
import os
from dotenv import load_dotenv
from googlesearch import search

load_dotenv()

def get_linkedin_profiles (company, num_profiles):
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    results = client.search(f"site:linkedin.com/in Software Engineer {company}", search_depth= "advanced", max_results= num_profiles)
    return results["results"]