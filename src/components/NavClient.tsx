"use client"
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const NavClient = () => {
  const { data: session, status } = useSession();

  // If the session is not loaded yet
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* If user is not logged in */}
      {!session ? (
        <Link className="btn btn-accent" href="/login">
          Login
        </Link>
      ) : (
        // If user is logged in, show Logout button
        <button className="btn btn-secondary" onClick={() => signOut()}>
          Logout
        </button>
      )}
    </div>
  );
};

export default NavClient;