// src/pages/UpdatePassword.tsx
import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import the auth object

const UpdatePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setSuccess("Password updated successfully");
        setError(null);
      } else {
        setError("User not logged in");
      }
    } catch (error) {
      setError("Failed to update password");
      setSuccess(null);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 mt-16 min-h-screen">
      {/* Add mt-16 to create space for Topbar */}
      <h1 className="text-3xl font-bold mb-4">Update Password</h1>
      <form
        onSubmit={handleUpdatePassword}
        className="space-y-4 max-w-lg mx-auto"
      >
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Update Password
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default UpdatePassword;
