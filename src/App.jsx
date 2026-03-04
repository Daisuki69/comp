import React from 'react';
import { useState } from "react";

const grades = [
  { code: "COMA11", description: "Mathematics in the Modern World", section: "SELAMS1A", prelim: "1.50", midterm: "1.50", endterm: "1.75", finals: "1.50" },
  { code: "COPE21", description: "PATH-FIT 1: Movement Competency Training", section: "SELAMS1A", prelim: "1.00", midterm: "1.25", endterm: "1.00", finals: "1.00" },
  { code: "COPY11", description: "Understanding the Self", section: "SELAMS1A", prelim: "1.00", midterm: "2.25", endterm: "1.00", finals: "1.50" },
  { code: "COSH11", description: "Empowering the Self", section: "ETS1", prelim: "", midterm: "2.00", endterm: "1.75", finals: "1.75" },
  { code: "COSH21", description: "Religion: History and Texts", section: "RHT1", prelim: "1.00", midterm: "1.75", endterm: "1.25", finals: "1.25" },
  { code: "PRPO120", description: "Fundamentals of Political Science", section: "BAPOL1A", prelim: "1.50", midterm: "2.00", endterm: "1.25", finals: "1.50" },
];
const grades2 = [
  { code: "COPE22", description: "PATH-FIT 2: Recreation", section: "SELAMS1A", prelim: "1.00", midterm: "", endterm: "", finals: "" },
  { code: "COSH31", description: "Art Appreciation", section: "SELAMS1A", prelim: "1.00", midterm: "", endterm: "", finals: "" },
  { code: "COLA51", description: "Expository Writing for Global Communication", section: "EWGC1", prelim: "1.25", midterm: "", endterm: "", finals: "" },
  { code: "PRPO121", description: "Introduction to Philippine Politics and Governance", section: "BAPOL1A	", prelim: "1.50", midterm: "", endterm: "", finals: "" },
  { code: "PRPO122", description: "Introduction to Comparative Politics", section: "BAPOL1A	", prelim: "1.50", midterm: "", endterm: "", finals: "" },
  { code: "COSH41", description: "Readings in Philippine History", section: "RPH1", prelim: "1.00", midterm: "", endterm: "", finals: "" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedGrades, setSelectedGrades] = useState(grades);
  const [selectedPeriod, setSelectedPeriod] = useState("SY2025-2026-1");

  const Header = () => (
    <div style={{
      background: "#f8f8f8",
      borderBottom: "1px solid #e0e0e0",
      padding: "0 24px",
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <span style={{ fontSize: "15px", color: "#555", letterSpacing: "0.05em" }}>CEU</span>
      <button
        onClick={() => setPage("dashboard")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#555", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px"
        }}
      >
        Logout ➜
      </button>
    </div>
  );

  const Dashboard = () => (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "6px",
          width: "640px",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <div style={{ background: "#f5f5f5", padding: "14px 20px", borderBottom: "1px solid #ddd" }}>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>Student</span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <button
              onClick={() => setPage("history")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#3a6fc4", fontSize: "14px", padding: 0
              }}
            >
              List Enrollments
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EnrollmentHistory = () => {
  const folderIconOffset = "-1px";
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <Header />
      <div style={{ padding: "40px 48px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "400", display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <span style={{ fontSize: "26px" }}>↺</span> Enrollment History
        </h1>
        <h2 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "20px", color: "#222" }}>Carl Cedric Noval</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "700", width: "280px" }}>Period</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "700" }}>Course</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "700" }}>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "#f9f9f9" }}>
              <td style={{ padding: "12px 0" }}>
                <button
                  onClick={() => { setSelectedGrades(grades); setSelectedPeriod("SY2025-2026-1"); setPage("details"); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3a6fc4", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <img src="/folt.png" style={{ width: "13px", height: "11.5px", verticalAlign: "middle", position: "relative", top: folderIconOffset }} /> SY2025-2026-1
                </button>
              </td>
              <td style={{ padding: "12px 0", color: "#333" }}>Bachelor of Arts in Political Science - A</td>
              <td style={{ padding: "12px 0", color: "#333" }}>BAPS-A1</td>
            </tr>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
              <td style={{ padding: "12px 0" }}>
                <button
                  onClick={() => { setSelectedGrades(grades2); setSelectedPeriod("SY2025-2026-2"); setPage("details"); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3a6fc4", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <img src="/folt.png" style={{ width: "13px", height: "11.5px", verticalAlign: "middle", position: "relative", top: folderIconOffset }} /> SY2025-2026-2
                </button>
              </td>
              <td style={{ padding: "12px 0", color: "#333" }}>Bachelor of Arts in Political Science - A</td>
              <td style={{ padding: "12px 0", color: "#333" }}>BAPS-A1</td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

  const EnrollmentDetails = () => {
    const folderIconOffset2 = "-3px";
    const rightSideCols = "9%"; // Change this percentage to compress or expand the right side
    const headerFontSize = "35px"; // Change this to adjust the title font size
    
    return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <Header />
      <div style={{ padding: "15px 48px" }}>
        <h1 style={{ fontSize: headerFontSize, fontWeight: "400", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <img src="/folder.png" alt="folder" style={{ height: headerFontSize, position: "relative", top: folderIconOffset2 }} /> Enrollment Details ({selectedPeriod})
        </h1>
        <h2 style={{ fontSize: "30px", fontWeight: "400", marginBottom: "24px", color: "#222" }}>Carl Cedric Noval</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", position: "center" }}>
          <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: "left", padding: "6px 0", paddingBottom: "10px", fontWeight: "700", fontSize: "14px", borderBottom: "2px solid #e0e0e0" }}>Subject</th>
              <th colSpan={1} style={{ borderBottom: "none" }}></th>
              <th colSpan={4} style={{ textAlign: "left", padding: "6px 0", paddingBottom: "10px", fontWeight: "700", fontSize: "14px", borderBottom: "2px solid #e0e0e0" }}>Combined Grades</th>
            </tr>
            <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: "10%" }}>Code</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700" }}>Description</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: `calc(${rightSideCols} + 3%)` }}>Section</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: rightSideCols }}>Prelim</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: rightSideCols }}>Midterm</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: rightSideCols }}>Endterm</th>
              <th style={{ textAlign: "left", padding: "12px 0 8px 0", fontWeight: "700", width: rightSideCols }}>Finals</th>
            </tr>
          </thead>
          <tbody>
            {selectedGrades.map((g, i) => (
              <tr key={i} style={{ borderBottom: "1.7px solid #eee", background: i % 2 === 0 ? "#f7f7f7" : "#fff" }}>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.code}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.description}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.section}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.prelim}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.midterm}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.endterm}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.finals}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "24px" }}>
          <button
            onClick={() => setPage("history")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#3a6fc4", fontSize: "14px"
            }}
          >
            « back
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", minHeight: "100vh" }}>
      {page === "dashboard" && <Dashboard />}
      {page === "history" && <EnrollmentHistory />}
      {page === "details" && <EnrollmentDetails />}
    </div>
  );
}
