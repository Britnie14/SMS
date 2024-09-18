import React, { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface UserData {
  address: string;
  birthday: string;
  email: string;
  first_name: string;
  gender: string;
  last_name: string;
  phone_number: string;
  profile_image_url: string;
}

const UpdateUserInfo: React.FC = () => {
  const [formValues, setFormValues] = useState<UserData>({
    address: "",
    birthday: "",
    email: "",
    first_name: "",
    gender: "",
    last_name: "",
    phone_number: "",
    profile_image_url: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setFormValues(data);
          } else {
            console.error("No user data found");
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateUserInfo = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
        if (selectedFile) {
            setUploading(true);
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on(
                "state_changed",
                // Remove unused snapshot parameter
                () => {},
                // Remove uploadError parameter since it's not used
                () => {
                    setError("Failed to upload image");
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateDoc(doc(db, "users", user.uid), {
                        ...formValues,
                        profile_image_url: downloadURL,
                    });
                    setSuccess("User information updated successfully");
                    setError(null);
                    setUploading(false);
                    window.location.reload(); // Refresh the page
                    navigate("/home"); // Navigate to home page
                }
            );
        } else {
            try {
                const userDoc = doc(db, "users", user.uid);
                await updateDoc(userDoc, { ...formValues });
                setSuccess("User information updated successfully");
                setError(null);
                window.location.reload(); // Refresh the page
                navigate("/home"); // Navigate to home page
            } catch (error) {
                setError("Failed to update user information");
                setSuccess(null);
            }
        }
    } else {
        setError("User not logged in");
    }
};


  return (
    <div className="flex-1 p-6 bg-gray-100 mt-16 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Update User Info</h1>
      <form
        onSubmit={handleUpdateUserInfo}
        className="space-y-4 max-w-lg mx-auto"
      >
        <input
          id="first_name"
          type="text"
          value={formValues.first_name}
          onChange={handleChange} // Attach handleChange
          placeholder="First Name"
          className="border p-2 w-full"
        />
        <input
          id="last_name"
          type="text"
          value={formValues.last_name}
          onChange={handleChange} // Attach handleChange
          placeholder="Last Name"
          className="border p-2 w-full"
        />
        <input
          id="email"
          type="email"
          value={formValues.email}
          onChange={handleChange} // Attach handleChange
          placeholder="Email"
          className="border p-2 w-full"
        />
        <input
          id="phone_number"
          type="tel"
          value={formValues.phone_number}
          onChange={handleChange} // Attach handleChange
          placeholder="Phone Number"
          className="border p-2 w-full"
        />
        <input
          id="address"
          type="text"
          value={formValues.address}
          onChange={handleChange} // Attach handleChange
          placeholder="Address"
          className="border p-2 w-full"
        />
        <input
          id="birthday"
          type="date"
          value={formValues.birthday}
          onChange={handleChange} // Attach handleChange
          className="border p-2 w-full"
        />
        <select
          id="gender"
          value={formValues.gender}
          onChange={handleChange} // Attach handleChange
          className="border p-2 w-full"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="file"
          onChange={handleFileChange} // Attach handleFileChange
          className="border p-2 w-full"
        />
        {imagePreview && <img src={imagePreview} alt="Image Preview" className="w-32 h-32" />}
        
        {/* Update Button */}
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md ${
            uploading ? "bg-gray-400" : "bg-blue-500"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Update Info"}
        </button>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default UpdateUserInfo;
