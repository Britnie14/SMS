import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const EditIncidentReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<IncidentReport>>({
    cause: "",
    dateTime: "",
    identityOfCasualties: "",
    images: [],
    location: "",
    numberOfCasualties: 0,
    numberOfDisplacedPersons: 0,
    resourcesDeployed: "",
    respondingAgencies: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchIncidentReport = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "incidentReports", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as IncidentReport;
          setFormData(data); // Initialize form data with fetched report data
          setImagePreviews(data.images || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching incident report: ", error);
      }
    };

    fetchIncidentReport();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemovePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return;

    const uploadedImageUrls: string[] = [];

    for (const file of selectedFiles) {
      const storageRef = ref(storage, `incidentReports/${id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedImageUrls.push(url);
    }

    return uploadedImageUrls;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      const uploadedImageUrls = await uploadImages();
      const updatedFormData = {
        ...formData,
        images: [...(formData.images || []), ...(uploadedImageUrls || [])],
      };

      const docRef = doc(db, "incidentReports", id);
      await updateDoc(docRef, updatedFormData as Partial<IncidentReport>);
      alert("Incident report updated successfully!");

      // Navigate to the full incident report view
      navigate(`/incident/${id}`); // Ensure this matches your route
    } catch (error) {
      console.error("Error updating incident report: ", error);
      alert("Failed to update incident report.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Edit Incident Report</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cause</label>
          <input
            type="text"
            name="cause"
            value={formData.cause || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Date and Time
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Identity of Casualties
          </label>
          <textarea
            name="identityOfCasualties"
            value={formData.identityOfCasualties || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Casualties
          </label>
          <input
            type="number"
            name="numberOfCasualties"
            value={formData.numberOfCasualties || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Displaced Persons
          </label>
          <input
            type="number"
            name="numberOfDisplacedPersons"
            value={formData.numberOfDisplacedPersons || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Resources Deployed
          </label>
          <input
            type="text"
            name="resourcesDeployed"
            value={formData.resourcesDeployed || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Responding Agencies
          </label>
          <input
            type="text"
            name="respondingAgencies"
            value={formData.respondingAgencies || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative w-32 h-32">
              <img
                src={preview}
                alt={`preview-${index}`}
                className="w-full h-full object-cover border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemovePreview(index)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Report
        </button>
      </form>
    </div>
  );
};

export default EditIncidentReport;
