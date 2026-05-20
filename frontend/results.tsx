import { useLocation } from "react-router-dom";
import "./results.css";

export default function Results() {
const { state } = useLocation();
const data = state ?? JSON.parse(sessionStorage.getItem("results") || "{}");
console.log("state:", state);
console.log("sessionStorage:", sessionStorage.getItem("results"));
  return (
    <div className="container">
      <h1 className="company">{data.company_name}</h1>
      <p className="info">{data.company_info}</p>

      <div className="section">
        <div className="sectionTitle">LinkedIn Profiles</div>
        {data.linkedin_profiles?.map((p: any) => (
          <div key={p.url} className="profile">
            <div className="profileName">{p.title}</div>
            <a href={p.url} target="_blank" rel="noreferrer" className="profileUrl">
              {p.url}
            </a>
          </div>
        ))}
      </div>

      {data.missing_keywords?.length > 0 && (
        <div className="section">
          <div className="sectionTitle">Missing Keywords</div>
          <div className="keywords">
            {data.missing_keywords.map((k: string) => (
              <span key={k} className="keyword">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}