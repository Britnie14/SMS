import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebaseConfig"; // Import the initialized Firebase Auth, Firestore, and Storage
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Box, Button, Container, Input, Typography } from "@mui/material";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("r-gerona bulan sorsogon");
  const [birthday, setBirthday] = useState("2002-09-24");
  const [gender, setGender] = useState("Female");
  const [phoneNumber, setPhoneNumber] = useState("n/a");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profileImageUrl = "";
      if (profileImage) {
        // Upload profile image to Firebase Storage
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, profileImage);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error(error);
              reject();
            },
            async () => {
              profileImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setProfileImageUrl(profileImageUrl); // Set the image URL state
              resolve();
            }
          );
        });
      }

      // Store user information in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        address,
        birthday,
        gender,
        phone_number: phoneNumber,
        profile_image_url: profileImageUrl,
      });

      navigate("/home"); // Redirect to home page after signup
    } catch (error: any) {
      setError("Failed to sign up. Please check your details.");
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="min-h-screen flex items-center justify-center"
    >
      <Box
        className="bg-white p-8 rounded-lg shadow-lg w-full"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          className="text-3xl font-bold text-center mb-6"
        >
          Sign Up
        </Typography>
        <form onSubmit={handleSignup} className="space-y-6 w-full">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-semibold"
            >
              First Name
            </label>
            <Input
              type="text"
              id="firstName"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-semibold"
            >
              Last Name
            </label>
            <Input
              type="text"
              id="lastName"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="profileImage"
              className="block text-gray-700 font-semibold"
            >
              Profile Image
            </label>
            <Input
              type="file"
              id="profileImage"
              className="w-full mt-2"
              onChange={handleImageChange}
            />
            {profileImageUrl && (
              <div className="mt-4">
                <img
                  src={profileImageUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 font-semibold"
            >
              Address
            </label>
            <Input
              type="text"
              id="address"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="birthday"
              className="block text-gray-700 font-semibold"
            >
              Birthday
            </label>
            <Input
              type="date"
              id="birthday"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold"
            >
              Gender
            </label>
            <select
              id="gender"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-gray-700 font-semibold"
            >
              Phone Number
            </label>
            <Input
              type="text"
              id="phoneNumber"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <Typography className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
