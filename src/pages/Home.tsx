import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Home Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome to your dashboard. Here you can find an overview of recent
        activity and quick access to key features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Overview Widgets */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Incident Statistics</h2>
          <p>Total Incidents: 120</p>
          <p>Incidents Today: 15</p>
          <p>Incidents This Week: 50</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
          <ul>
            <li>Report #123 - Minor accident at 123 Main St.</li>
            <li>Report #124 - Hazardous material spill at 456 Elm St.</li>
            <li>Report #125 - Heart attack at 789 Oak St.</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p>No new notifications.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {/* Quick Actions */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            /* Navigate to Add Report Page */
          }}
        >
          Add New Report
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            /* Navigate to View Reports Page */
          }}
        >
          View Reports
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            /* Navigate to Settings Page */
          }}
        >
          Manage Settings
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul>
          <li>Activity #1 - Report #123 updated.</li>
          <li>Activity #2 - New report created.</li>
          <li>Activity #3 - System maintenance scheduled.</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
