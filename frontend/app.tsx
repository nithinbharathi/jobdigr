import React, { useState } from "react";

export default function App() {
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    company_name?: string;
    job_description?: string;
    resume?: string;
  }>({});

  const analyze = async () => {
    setLoading(true);
    setData(null);
    setErrors({});
    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("job_description", jobDescription);
    if (resume) formData.append("resume", resume);

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        const detail = json.detail;

        const newErrors: any = {};

        if (Array.isArray(detail)) {
          detail.forEach((err: any) => {
            const field = err.loc?.[err.loc.length - 1];

            if (field === "company_name") {
              newErrors.company_name = "Company name is required";
            }

            if (field === "job_description") {
              newErrors.job_description = "Job description is required";
            }

            if (field === "resume") {
              newErrors.resume = "Resume file is required";
            }
          });
        } else {
          // fallback for string errors
          newErrors.general = detail;
        }

        setErrors(newErrors);
        return;
      }
      setData(json);
    } catch (err) {
      setData({ error: "Request failed" });
    } finally {
      setLoading(false);
    }


  };

  return (
    <div style={{ padding: 20 }}>
      <input
        style={{ display: "block", marginBottom: 10 }}
        placeholder="Company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      {errors.company_name && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {errors.company_name}
        </div>
      )}

      <input
        style={{ display: "block", marginBottom: 10 }}
        placeholder="Job description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {errors.job_description && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {errors.job_description}
        </div>
      )}

      <input
        style={{ display: "block", marginBottom: 10 }}
        type="file"
        onChange={(e) => setResume(e.target.files?.[0] || null)}
      />

      {errors.resume && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {errors.resume}
        </div>
      )}

      <button style={{ marginBottom: 20 }} onClick={analyze} disabled={loading}>
        Analyze
      </button>

      {loading && (
        <div style={{ marginBottom: 20 }}>
          Processing... please wait
        </div>
      )}

      {data && (
        <div>
          <h3 style={{ marginBottom: 6 }}>{data.company_name}</h3>

          <p style={{ marginBottom: 16 }}>{data.company_info}</p>

          <h4 style={{ marginBottom: 10 }}>LinkedIn Profiles</h4>

          {data.linkedin_profiles?.map((p: any) => (
            <div key={p.url} style={{ marginBottom: 14 }}>
              <div>{p.title}</div>

              <div>
                LinkedIn Profile:{" "}
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.url}
                </a>
              </div>
            </div>
          ))}
          {data.missing_keywords?.length > 0 && (
            <>
              <h4 style={{ marginTop: 20, marginBottom: 10 }}>
                Missing keywords in your resume:
              </h4>

              <div>
                {data.missing_keywords.join(", ")}
              </div>
            </>
          )}

        </div>

      )}
    </div>
  );
}