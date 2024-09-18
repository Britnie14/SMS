import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPalette, FaChartBar } from "react-icons/fa"; // Removed FaRegFileAlt
import { AiOutlineMail } from "react-icons/ai";

const Sidebar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <AiOutlineMail size={24} className="mr-2" />
          <span className="text-xl font-semibold">SMS Report</span>
        </div>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/home"
              className="flex items-center p-4 hover:bg-gray-700"
            >
              <FaHome size={20} className="mr-4" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/color-codes"
              className="flex items-center p-4 hover:bg-gray-700"
            >
              <FaPalette size={20} className="mr-4" />
              <span>Color Codes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/sms-reports"
              className="flex items-center p-4 hover:bg-gray-700"
            >
              <AiOutlineMail size={20} className="mr-4" />
              <span>SMS Reports</span>
            </Link>
          </li>
          <li>
            <Link
              to="/generate-reports"
              className="flex items-center p-4 hover:bg-gray-700"
            >
              <FaChartBar size={20} className="mr-4" />
              <span>Generate Reports</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
