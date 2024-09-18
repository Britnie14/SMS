import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom"; // Import Link for navigation
import { FaTrashAlt } from "react-icons/fa"; // Import trash icon

interface IncidentReport {
  id: string;
  cause: string;
  dateTime: string;
  location: string;
  images: string[];
}

const GenerateReports: React.FC = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);

  useEffect(() => {
    const fetchIncidentReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "incidentReports"));
        const reportsData: IncidentReport[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          cause: doc.data().cause || "",
          dateTime: doc.data().dateTime || "",
          location: doc.data().location || "",
          images: doc.data().images || [],
        }));
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching incident reports: ", error);
      }
    };

    fetchIncidentReports();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "incidentReports", id));
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== id)
      );
      console.log(`Document with id ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Generate Reports</h1>
      {/* Link to CreateReport page */}
      <Link to="/create-report">
        <button className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Report
        </button>
      </Link>

      {/* Display the list of reports */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 bg-white rounded-lg shadow">
              {/* Display only one image */}
              {report.images.length > 0 ? (
                <img
                  src={report.images[0]}
                  alt="Incident"
                  className="w-full h-40 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <p>No image available</p>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{report.cause}</h2>
              <p className="mb-1">
                <strong>Location:</strong> {report.location}
              </p>
              <p className="mb-4">
                <strong>Date and Time:</strong> {report.dateTime}
              </p>
              <div className="flex space-x-2">
                {/* Navigate to full details */}
                <Link to={`/incident/${report.id}`}>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View Full Details
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default GenerateReports;
