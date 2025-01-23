// UserAuth.tsx (Client Component)

"use client"; // Mark the component as a client-side component

import React from "react";
import { useAuth } from "./AuthContext"; // Import useAuth hook
import Link from "next/link";

const UserAuth = () => {
  const { user, logout } = useAuth(); // Use the client-side hook

  if (!user) {
    return (
      <Link
        className="py-2 px-4 bg-fuchsia-500 text-white rounded-md"
        href={"/login"}
      >
        Login
      </Link>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.name || "User"}!</p>

      <button
        onClick={() => logout()} // Trigger the logout function
        className="py-2 px-4 bg-fuchsia-500 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default UserAuth;
