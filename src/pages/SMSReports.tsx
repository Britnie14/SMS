import React from "react";

// Sample data for SMS reports
const reports = [
  {
    color: "#4CAF50", // Green
    colorTitle: "Green: Non-Emergency Incidents",
    number: "09123456789",
    address: "123 Main St",
    report: "Minor accident",
  },
  {
    color: "#FFEB3B", // Yellow
    colorTitle: "Yellow: Warnings or Potential Threats",
    number: "09987654321",
    address: "456 Elm St",
    report: "Hazardous material spill",
  },
  {
    color: "#2196F3", // Blue
    colorTitle: "Blue: Medical Emergencies",
    number: "09555555555",
    address: "789 Oak St",
    report: "Heart attack",
  },
  {
    color: "#F44336", // Red
    colorTitle: "Red: Critical or Life-Threatening Incidents",
    number: "09111222333",
    address: "101 Pine St",
    report: "Building collapse",
  },
  {
    color: "#00BCD4", // Cyan Blue
    colorTitle: "Cyan Blue: Police Assistance Button",
    number: "09444555666",
    address: "202 Maple St",
    report: "Police assistance needed",
  },
  // Additional reports...
];

const SMSReports: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">SMS Reports</h1>
      <p className="text-lg mb-6">
        Here you can manage and view SMS reports for your application.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="p-3 border-b border-gray-200 text-left">
                Color Code
              </th>
              <th className="p-3 border-b border-gray-200 text-left">Title</th>
              <th className="p-3 border-b border-gray-200 text-left">Number</th>
              <th className="p-3 border-b border-gray-200 text-left">
                Address
              </th>
              <th className="p-3 border-b border-gray-200 text-left">Report</th>
              <th className="p-3 border-b border-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="p-3 border-b border-gray-200">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: report.color }}
                  ></div>
                </td>
                <td className="p-3 border-b border-gray-200 font-bold">
                  {report.colorTitle}
                </td>
                <td className="p-3 border-b border-gray-200">
                  {report.number}
                </td>
                <td className="p-3 border-b border-gray-200">
                  {report.address}
                </td>
                <td className="p-3 border-b border-gray-200 truncate max-w-xs">
                  {report.report}
                </td>
                <td className="p-3 border-b border-gray-200">
                  <button
                    onClick={() => {
                      // Add response logic here
                      alert("Respond button clicked");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SMSReports;
