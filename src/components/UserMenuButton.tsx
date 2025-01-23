"use client";
import { Session } from "next-auth";
import Image from "next/image";
import profilePicPlaceholder from "@/app/assets/profile-placeholder.jpg";
import { signIn, signOut } from "next-auth/react";

interface UserMenuButtonProps {
  session: Session | null;
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user;

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn  btn-circle p-2 hover:bg-fuchsia-600 transition duration-300"
        htmlFor=""
      >
        {user ? (
          <Image
            src={user?.image || profilePicPlaceholder}
            alt="profile picture"
            width={40}
            height={40}
            className="w-10 rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        )}
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-30 rounded-box mt-3 w-52 bg-base-100 p-2 shadow-lg"
      >
        <li>
          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-outline w-full text-red-500 hover:bg-red-500 hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="btn btn-outline w-full text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Sign in
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
