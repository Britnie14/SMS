import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";

interface IncidentReport {
  cause: string;
  dateTime: string;
  identityOfCasualties: string;
  images: string[];
  location: string;
  numberOfCasualties: number;
  numberOfDisplacedPersons: number;
  resourcesDeployed: string;
  respondingAgencies: string;
}

const FullIncidentReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Hook to handle navigation
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchIncidentReport = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "incidentReports", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as IncidentReport;
          setReport(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching incident report: ", error);
      }
    };

    fetchIncidentReport();
  }, [id]);

  if (!report) {
    return <p>Loading...</p>;
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : report!.images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < report!.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleBackButton = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleEditButton = () => {
    console.log(`Navigating to /edit-incident/${id}`); // Debug log
    navigate(`/edit-incident/${id}`); // Navigate to the edit page with the current report ID
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Incident Report Details</h1>
      <button
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={handleBackButton}
      >
        Back
      </button>
      <button
        className="mb-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleEditButton}
      >
        Edit
      </button>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2">{report.cause}</h2>
        <p>
          <strong>Date and Time:</strong>{" "}
          {moment(report.dateTime).format("MMMM-DD-YYYY hh:mm A")}
        </p>
        <p>
          <strong>Location:</strong> {report.location}
        </p>
        <p>
          <strong>Identity of Casualties:</strong> {report.identityOfCasualties}
        </p>
        <p>
          <strong>Number of Casualties:</strong> {report.numberOfCasualties}
        </p>
        <p>
          <strong>Number of Displaced Persons:</strong>{" "}
          {report.numberOfDisplacedPersons}
        </p>
        <p>
          <strong>Resources Deployed:</strong> {report.resourcesDeployed}
        </p>
        <p>
          <strong>Responding Agencies:</strong> {report.respondingAgencies}
        </p>

        {/* Display images */}
        <div className="mt-4">
          <strong>Images:</strong>
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {report.images.length > 0 ? (
              report.images.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Incident Image ${i + 1}`}
                  className="w-48 h-32 object-cover rounded cursor-pointer"
                  onClick={() => handleImageClick(i)}
                />
              ))
            ) : (
              <p>No image to show</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for full view image */}
      {isModalOpen && report && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded shadow-lg max-w-4xl w-full">
            <button
              className="absolute top-2 right-2 text-gray-700 text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handlePreviousImage}
            >
              Previous
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleNextImage}
            >
              Next
            </button>
            <img
              src={report.images[currentImageIndex]}
              alt={`Incident Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FullIncidentReport;
