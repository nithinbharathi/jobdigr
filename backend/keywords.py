from backend.jobdescription import get_jd_keywords
import pypdfium2 as pdfium

def get_missing_keywords(jd, resume):
    r_keywords = parse_resume(resume)
    jd_keywords = parse_jd(jd)
    result = list(set(jd_keywords) - set(r_keywords))
    
    return result

def parse_jd(jd):
    return get_jd_keywords(jd).replace(',','').lower().split()
    
def parse_resume(resume):
    text = "\n".join(
    p.get_textpage().get_text_range() 
    for p in pdfium.PdfDocument(resume))
    return text.replace(',','').lower().split()

