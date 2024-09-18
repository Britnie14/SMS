import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ColorCodes from "./pages/ColorCodes";
import SMSReports from "./pages/SMSReports";
import GenerateReports from "./pages/GenerateReports";
import UpdatePassword from "./pages/UpdatePassword";
import UpdateUserInfo from "./pages/UpdateUserInfo";
import FullIncidentReport from "./pages/FullIncidentReport";
import EditIncidentReport from "./pages/EditIncidentReport";
import CreateReport from "./pages/CreateReport";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {isAuthenticated && (
          <div className="relative">
            <Sidebar />
            <Topbar />
          </div>
        )}
        <div
          className={`flex flex-1 ${isAuthenticated ? "ml-64" : "ml-0"} transition-all duration-300`}
        >
          <main className="flex-1 p-6 bg-gray-100">
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/color-codes" element={<ColorCodes />} />
                  <Route path="/sms-reports" element={<SMSReports />} />
                  <Route path="/generate-reports" element={<GenerateReports />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/update-user-info" element={<UpdateUserInfo />} />
                  <Route path="/incident/:id" element={<FullIncidentReport />} />
                  <Route path="/edit-incident/:id" element={<EditIncidentReport />} />
                  <Route path="/create-report" element={<CreateReport />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
