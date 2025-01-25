"use client";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa"; // FontAwesome icons

const SocialSignIn = () => {
  const router = useRouter();
  const session = useSession(authOption);

  const handleSocialSignIn = (provider:string) => {
    const resp = signIn(provider, { redirect: false });

  };  
  
  if (session.status === "authenticated") {
      router.push("/"); 
    }

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full max-w-sm"
        onClick={() => handleSocialSignIn("google")}
      >
        <FaGoogle size={20} />
        Sign in with Google
      </button>

      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 w-full max-w-sm"
        onClick={() => handleSocialSignIn("github")}
      >
        <FaGithub size={20} />
        Sign in with GitHub
      </button>
    </div>
  );
};

export default SocialSignIn;
