import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    company_name?: string;
    job_description?: string;
    resume?: string;
    general?: string;
  }>({});

  const analyze = async () => {
    setLoading(true);
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
      sessionStorage.setItem("results", JSON.stringify(json));
      navigate("/results", { state: json });

    } catch (err) {
      setErrors({ general: "Could not connect to server. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="title">Jobdigr</h1>
      <input
        className="field"
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
        className="field"
        placeholder="Job Requirements"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {errors.job_description && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {errors.job_description}
        </div>
      )}

      <input
        className="field"
        type="file"
        onChange={(e) => setResume(e.target.files?.[0] || null)}
      />

      {errors.resume && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {errors.resume}
        </div>
      )}

      <button className="button" onClick={analyze} disabled={loading}>
        Analyze
      </button>

      {errors.general && (
        <div style={{ color: "red", marginTop: 10 }}>
          {errors.general}
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: 20 }}>
          Processing... please wait
        </div>
      )}
    </div>
  );
}