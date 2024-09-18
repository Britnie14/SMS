import React, { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

interface IncidentReport {
  cause: string;
  dateTime: string;
  location: string;
  images: string[];
  identityOfCasualties: string;
  numberOfCasualties: number;
  numberOfDisplacedPersons: number;
  resourcesDeployed: string;
  respondingAgencies: string;
}

const CreateReport: React.FC = () => {
  const [formData, setFormData] = useState<Partial<IncidentReport>>({
    cause: "",
    dateTime: "",
    location: "",
    images: [],
    identityOfCasualties: "",
    numberOfCasualties: 0,
    numberOfDisplacedPersons: 0,
    resourcesDeployed: "",
    respondingAgencies: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const navigate = useNavigate();

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

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    const uploadedImageUrls: string[] = [];

    for (const file of selectedFiles) {
      const storageRef = ref(
        storage,
        `incidentReports/${Date.now()}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedImageUrls.push(url);
    }

    return uploadedImageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const uploadedImageUrls = await uploadImages();
      const newReport: IncidentReport = {
        ...formData,
        images: uploadedImageUrls,
      } as IncidentReport;

      await addDoc(collection(db, "incidentReports"), newReport);
      alert("Report added successfully!");
      navigate("/generate-reports"); // Navigate back to the report list page
    } catch (error) {
      console.error("Error adding report: ", error);
      alert("Failed to add report.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Add New Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cause</label>
          <input
            type="text"
            name="cause"
            value={formData.cause || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
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
            required
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
            required
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
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Report
        </button>
      </form>
    </div>
  );
};

export default CreateReport;
