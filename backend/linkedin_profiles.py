from tavily import TavilyClient
import os

def get_linkedin_profiles (company, num_profiles):
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    results = client.search(f"\"Software Engineer at {company}\"", search_depth= "advanced", max_results= num_profiles, exact_match=True)
    return results["results"]
