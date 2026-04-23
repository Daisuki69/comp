import React from 'react';
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';

const grades = [
  { code: "COMA11", description: "Mathematics in the Modern World", section: "SELAMS1A", prelim: "1.50", midterm: "1.50", endterm: "1.75" },
  { code: "COPE21", description: "PATH-FIT 1: Movement Competency Training", section: "SELAMS1A", prelim: "1.00", midterm: "1.25", endterm: "1.00" },
  { code: "COPY11", description: "Understanding the Self", section: "SELAMS1A", prelim: "1.00", midterm: "2.25", endterm: "1.00" },
  { code: "COSH11", description: "Empowering the Self", section: "ETS1", prelim: "NA", midterm: "2.00", endterm: "1.75" },
  { code: "COSH21", description: "Religion: History and Texts", section: "RHT1", prelim: "1.00", midterm: "1.75", endterm: "1.25" },
  { code: "PRPO120", description: "Fundamentals of Political Science", section: "BAPOL1A", prelim: "1.50", midterm: "2.00", endterm: "1.25" },
];

const grades2 = [
  { code: "COPE22", description: "PATH-FIT 2: Recreation", section: "SELAMS1A", prelim: "1.00", midterm: "1.00", endterm: "" },
  { code: "COSH31", description: "Art Appreciation", section: "SELAMS1A", prelim: "1.00", midterm: "1.25", endterm: "" },
  { code: "COLA51", description: "Expository Writing for Global Communication", section: "EWGC1", prelim: "1.25", midterm: "1.50", endterm: "" },
  { code: "PRPO121", description: "Introduction to Philippine Politics and Governance", section: "BAPOL1A	", prelim: "1.50", midterm: "1.25", endterm: "" },
  { code: "PRPO122", description: "Introduction to Comparative Politics", section: "BAPOL1A	", prelim: "1.50", midterm: "1.25", endterm: "" },
  { code: "COSH41", description: "Readings in Philippine History", section: "RPH1", prelim: "1.00", midterm: "1.00", endterm: "" },
];

const calculateFinalGrade = (prelim, midterm, endterm) => {
  const rawTerms = [prelim, midterm, endterm];
  
  // We expect 3 grades, unless a term is explicitly marked as "NA" (intentionally omitted)
  const expectedCount = rawTerms.filter(term => term !== "NA").length;
  
  // Filter out blanks ("") and get the actual valid numerical grades
  const validGrades = rawTerms.filter(val => val && !isNaN(parseFloat(val))).map(parseFloat);
  
  // If we don't have all the expected grades yet, don't calculate the final grade
  if (validGrades.length === 0 || validGrades.length !== expectedCount) {
    return "";
  }
  
  const average = validGrades.reduce((sum, val) => sum + val, 0) / validGrades.length;
  // Round to nearest 0.25, while forcing halfway ties (e.g. 1.875) to round down to the smaller number (1.75)
  const finalGrade = Math.round(average * 4 - 0.000001) / 4;
  
  return finalGrade.toFixed(2);
};

export default function App() {
  const [page, setPage] = useState("login"); // Start on the login page!
  const [selectedGrades, setSelectedGrades] = useState(grades);
  const [selectedPeriod, setSelectedPeriod] = useState("SY2025-2026-1");
  const uiScale = "100%"; 
  const uiSidePadding = "3.2%"; // Change this (e.g., "5%", "150px", "20vw") to squeeze the UI from the sides

  // This function fakes a network loading delay with adjustable speeds!
  const navigate = (destination, isBackwards = false, noBlank = false) => {
    // If going backwards, load much faster! (150ms wait, 100ms white screen = 250ms total)
    // If going forward, use normal speed! (400ms wait, 200ms white screen = 600ms total)
    const loadDelay = isBackwards ? 0 : 1500; 
    const totalDelay = isBackwards ? 2000 : 3000;

    const style = document.createElement('style');
    style.id = 'loading-cursor';
    style.innerHTML = '* { cursor: wait !important; }';
    document.head.appendChild(style);
    
    // Wipe the screen blank using the dynamic loadDelay timer
    if (!noBlank) {
      setTimeout(() => {
        setPage("blank");
        window.scrollTo(0, 0);
      }, loadDelay);
    }

    // Reveal the new page using the dynamic totalDelay timer
    setTimeout(() => {
      setPage(destination);
      if (noBlank) window.scrollTo(0, 0);
      document.getElementById('loading-cursor')?.remove(); 
    }, totalDelay); 
  };

  // This automatically updates the browser tab title whenever the page changes!
  React.useEffect(() => {
    if (page === "login") {
      document.title = "CEU login";
    } else if (page === "dashboard") {
      document.title = "School";
    } else if (page === "history") {
      document.title = "Enrollment History";
    } else if (page === "details") {
      document.title = "Enrollment Details";
    }
  }, [page]);
  
// --- LOGIN PAGE COMPONENT ---
  const LoginPage = ({ setPage }) => {
    const [loginError, setLoginError] = useState(false);
    // Check URL immediately to prevent flashing the login UI when returning from Google
    const [isAuthenticating, setIsAuthenticating] = useState(() => window.location.hash.includes("access_token"));

    // The library automatically detects when you return from Google
    // and fires this "onSuccess" instantly!
    // We bypass the library entirely and force a full-page redirect to Google
    const login = () => {
      const clientId = "418147323545-a74an3aau45fm26b3buga7d85mkomd99.apps.googleusercontent.com";
      const redirectUri = window.location.origin;
      const scope = "email profile";
      
      // The 'prompt=select_account' part is the magic that forces the full-screen account chooser!
      const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
      
      window.location.href = googleLoginUrl; 
    };

    // This asks Google for the email and blocks non-CEU accounts
    const validateUser = (token) => {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      })
      .then((res) => res.json())
      .then((data) => {
        const email = data.email || "";
        const allowedDomains = ["@ceu.edu.ph", "@mnl.ceu.edu.ph", "@mkt.ceu.edu.ph", "@mls.ceu.edu.ph", "@ceis.edu.ph"];
        
        if (allowedDomains.some(domain => email.endsWith(domain))) {
          setLoginError(false);
          setPage("dashboard"); // Let them in!
        } else {
          setLoginError(true); // Reject them, show the red error box!
          setIsAuthenticating(false); // Show the login UI again
        }
      })
      .catch((err) => {
        console.log("Error verifying user:", err);
        setIsAuthenticating(false); // Show the login UI again on error
      });
    };
    
    // This "catches" the token from the URL after Google redirects you back!
    React.useEffect(() => {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // Extract the token from the URL
        const params = new URLSearchParams(hash.replace("#", "?"));
        const token = params.get("access_token");
        
        if (token) {
          // Run the email check!
          validateUser(token);
          // Clean up the messy token from the address bar so it looks nice
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }, []);
    
    // If we are currently verifying the token from Google, show a blank screen to prevent UI flashing
    if (isAuthenticating) {
      return <div style={{ minHeight: "100vh", background: "#f5f5f5" }}></div>;
    }

    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0", padding: `0 calc(${uiSidePadding} + 24px)`, height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "18px", color: "#555", letterSpacing: "0.05em" }}>CEU</span>
          <button 
            onClick={() => login()} 
            style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}
          >
            Login ➜
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
          <div style={{ width: "500px", background: "#fff", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #ddd", background: "#f9f9f9" }}>
              <span style={{ fontSize: "16px", color: "#333" }}>Login Options</span>
            </div>
            <div style={{ padding: "20px" }}>
              {/* The Error Box will now properly show up if it's not a CEU email! */}
              {loginError && (
                <div style={{ background: "#f8d7da", border: "1px solid #f5c6cb", padding: "16px", borderRadius: "4px", marginBottom: "20px", color: "#721c24", fontSize: "14px", lineHeight: "1.5" }}>
                  Only CEU GMail accounts are allowed (e.g. username@ceu.edu.ph, username@mnl.ceu.edu.ph, username@mkt.ceu.edu.ph, username@mls.ceu.edu.ph, username@ceis.edu.ph)<br /><br />
                  <a href="https://accounts.google.com/Logout" target="_blank" rel="noreferrer" style={{ color: "#0056b3", textDecoration: "none" }}>Click here</a> to logout current account from Google.
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" style={{ width: "18px" }} /> 
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
          navigate("login", true, true); // This moves the UI back to the login screen with the backwards delay, but no blank screen
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
              onClick={() => navigate("history")}
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
                  onClick={() => { setSelectedGrades(grades); setSelectedPeriod("SY2025-2026-1"); navigate("details"); }}
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
                  onClick={() => { setSelectedGrades(grades2); setSelectedPeriod("SY2025-2026-2"); navigate("details"); }}
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
                <td style={{ padding: "12px 0", color: "#333" }}>{g.prelim === "NA" ? "" : g.prelim}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.midterm === "NA" ? "" : g.midterm}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{g.endterm === "NA" ? "" : g.endterm}</td>
                <td style={{ padding: "12px 0", color: "#333" }}>{calculateFinalGrade(g.prelim, g.midterm, g.endterm)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: backButtonMarginTop }}>
          <button
            onClick={() => navigate("history", true)} // We added "true" to trigger the faster backwards speed!
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
        {page === "blank" && <div style={{ minHeight: "100vh", background: "#fff" }}></div>}
      </div>
    </GoogleOAuthProvider>
  );
}
