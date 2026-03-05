import React from 'react';
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';

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
  const [page, setPage] = useState("login"); // Start on the login page!
  const [selectedGrades, setSelectedGrades] = useState(grades);
  const [selectedPeriod, setSelectedPeriod] = useState("SY2025-2026-1");
  const uiScale = "100%"; 
  const uiSidePadding = "3.2%"; // Change this (e.g., "5%", "150px", "20vw") to squeeze the UI from the sides

// --- LOGIN PAGE COMPONENT ---
  const LoginPage = ({ setPage }) => {
    const [loginError, setLoginError] = useState(false);

    // This version forces the redirect by using the 'auth-code' flow
    const login = useGoogleLogin({
      ux_mode: 'redirect',
      flow: 'auth-code',
      redirect_uri: 'http://localhost:5173', // Hardcode it for now to test locally
      onSuccess: (codeResponse) => {
        handleAuthCode(codeResponse.code);
      },
      onError: (error) => console.log('Login Failed:', error)
    });

    const handleAuthCode = (code) => {
      // In a real app, you'd exchange this code for a token. 
      // For your frontend prototype, we'll simulate the validation.
      setPage("dashboard");
    };

    // 1. This "catches" the login code from the URL after the redirect reload
    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      
      if (code) {
        // We have the code! Now we need to verify the user
        validateUser(code);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, []);

    // 2. This function simulates the validation for your frontend demo
    // In a production app, you'd do this on a backend, but we can 
    // fetch the user info directly for this prototype.
    const validateUser = (code) => {
      // For this prototype, we'll use the Google 'userinfo' endpoint.
      // Note: In redirect 'auth-code' flow, we usually need a backend to get the token.
      // As a shortcut for your UI demo, we can assume if they made it back with a code,
      // we can let them in, OR we can use the 'implicit' flow token instead.
      
      // Let's switch your login hook slightly back to 'token' (implicit) 
      // but keep the 'redirect' mode so we can actually read the email.
      console.log("Validating code:", code);
      setPage("dashboard"); 
    };

    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "18px", color: "#555", letterSpacing: "0.05em" }}>CEU</span>
          <div style={{ color: "#777", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>Login ➜</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
          <div style={{ width: "500px", background: "#fff", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #ddd", background: "#f9f9f9" }}>
              <span style={{ fontSize: "16px", color: "#333" }}>Login Options</span>
            </div>
            <div style={{ padding: "20px" }}>
              {loginError && (
                <div style={{ background: "#f8d7da", border: "1px solid #f5c6cb", padding: "16px", borderRadius: "4px", marginBottom: "20px", color: "#721c24", fontSize: "14px" }}>
                  Only CEU GMail accounts are allowed...
                </div>
              )}
              <div style={{ fontSize: "13px", color: "#333", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#d9534f", color: "#fff", padding: "2px 6px", borderRadius: "3px", fontSize: "11px", fontWeight: "bold" }}>Disclaimer</span>
                Beta test only. Grades on this site are not official nor in real-time.
              </div>
              <button 
                onClick={() => login()}
                style={{ width: "100%", padding: "12px", background: "#fff", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", fontSize: "16px", color: "#333", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="G" style={{ width: "18px" }} /> 
                Login using CEU GMail
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SHARED PAGE VARIABLES ---
  const pageTopPadding = "15px"; 
  const headerMarginTop = "22px"; 
  const headerFontSize = "35.8px"; 
  const headerIconGap = "10.95px"; 
  
  const pageIconSize = "28.9px"; // Controls both the folder image and the "↺" icon
  const pageIconVerticalOffset = "-1.5px"; 
  const pageIconHorizontalOffset = "1px"; 
  
  const subHeaderFontSize = "30px"; // Controls the "Carl Cedric Noval" text size
  
  // --- TABLE VARIABLES ---
  const tableLeftGap = "16px"; 
  const rightSideCols = "9%"; 
  const backButtonMarginTop = "0px";

  const Header = () => (
    <div style={{
      background: "#f8f8f8",
      borderBottom: "1px solid #e0e0e0",
      padding: `0 calc(${uiSidePadding} + 24px)`,
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <span style={{ fontSize: "18px", color: "#555", letterSpacing: "0.05em" }}>CEU</span>
      <button
        onClick={() => {
          googleLogout(); // This clears the Google session
          setPage("login"); // This moves the UI back to the login screen
        }}
        style={{
          background: "none", 
          border: "none", 
          cursor: "pointer",
          color: "#555", 
          fontSize: "14px", 
          display: "flex", 
          alignItems: "center", 
          gap: "5px"
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
      <div style={{ padding: `${pageTopPadding} calc(${uiSidePadding} + 24px)` }}>
        <h1 style={{ marginTop: headerMarginTop, fontSize: headerFontSize, fontWeight: "400", display: "flex", alignItems: "center", gap: headerIconGap, marginBottom: "24px" }}>
          <img src="/history.png" alt="history" style={{ left: pageIconHorizontalOffset, height: pageIconSize, position: "relative", top: pageIconVerticalOffset }} /> Enrollment History
        </h1>
        <h2 style={{ fontSize: subHeaderFontSize, fontWeight: "400", marginBottom: "24px", color: "#222" }}>Carl Cedric Noval</h2>

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
    // Variables have been moved to the top of the App!
    
    return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <Header />
      <div style={{ padding: `${pageTopPadding} calc(${uiSidePadding} + 24px)` }}>
        <h1 style={{ marginTop: headerMarginTop, fontSize: headerFontSize, fontWeight: "400", display: "flex", alignItems: "center", gap: headerIconGap, marginBottom: "24px" }}>
          <img src="/folder.png" alt="folder" style={{ left: pageIconHorizontalOffset, height: pageIconSize, position: "relative", top: pageIconVerticalOffset }} /> Enrollment Details ({selectedPeriod})
        </h1>
        <h2 style={{ fontSize: subHeaderFontSize, fontWeight: "400", marginBottom: "24px", color: "#222" }}>Carl Cedric Noval</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", position: "center" }}>
          <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: "left", padding: `6px 0 10px ${tableLeftGap}`, fontWeight: "700", fontSize: "14px", borderBottom: "2px solid #e0e0e0" }}>Subject</th>
              <th colSpan={1} style={{ borderBottom: "none" }}></th>
              <th colSpan={4} style={{ textAlign: "left", padding: "6px 0", paddingBottom: "10px", fontWeight: "700", fontSize: "14px", borderBottom: "2px solid #e0e0e0" }}> Combined Grades</th>
            </tr>
            <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
              <th style={{ textAlign: "left", padding: `12px 0 8px ${tableLeftGap}`, fontWeight: "700", width: "10%" }}>Code</th>
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
              <tr key={i} style={{ borderBottom: i === selectedGrades.length - 1 ? "none" : "1.7px solid #eee", background: i % 2 === 0 ? "#f7f7f7" : "#fff" }}>
                <td style={{ padding: `12px 0 12px ${tableLeftGap}`, color: "#333" }}>{g.code}</td>
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

        <div style={{ marginTop: backButtonMarginTop }}>
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
    // You will replace the clientId string below with your own later!
    <GoogleOAuthProvider clientId="418147323545-a74an3aau45fm26b3buga7d85mkomd99.apps.googleusercontent.com">
      <div style={{ zoom: uiScale, minHeight: "100vh" }}>
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "dashboard" && <Dashboard />}
        {page === "history" && <EnrollmentHistory />}
        {page === "details" && <EnrollmentDetails />}
      </div>
    </GoogleOAuthProvider>
  );
}
