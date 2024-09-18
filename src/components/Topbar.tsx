import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Import Firestore
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaUserEdit, FaLock, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai"; // Import downward arrow icon

const Topbar: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility
  const user = auth.currentUser; // Current user from auth

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("No user data found");
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login or home page
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  if (loading) {
    return (
      <div className="fixed top-0 left-64 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
        <div className="text-lg font-semibold">Dashboard</div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-64 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <div className="text-lg font-semibold">Dashboard</div>
      {userData && (
        <div className="relative flex items-center space-x-4">
          <span>{userData.first_name + " " + userData.last_name}</span>
          <div className="relative">
            <img
              src={userData.profile_image_url}
              alt="Profile"
              className="w-12 h-12 object-cover rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            <AiOutlineDown
              size={16}
              className="absolute bottom-0 right-0 mb-1 mr-1 text-gray-400 cursor-pointer"
              onClick={toggleDropdown}
            />
          </div>

          {dropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-64 bg-white text-black border border-gray-300 rounded-lg shadow-lg"
              style={{ top: "calc(100% + 8px)" }} // Position dropdown below the profile image
            >
              <div className="flex items-center p-4 border-b border-gray-300">
                {userData.profile_image_url && (
                  <img
                    src={userData.profile_image_url}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-semibold">
                    {userData.first_name + " " + userData.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              </div>
              <ul>
                <li>
                  <Link
                    to="/update-user-info"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FaUserEdit size={20} className="mr-4" />
                    <span>Update User Info</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/update-password"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <FaLock size={20} className="mr-4" />
                    <span>Update Password</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                  >
                    <FaSignOutAlt size={20} className="mr-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Topbar;
