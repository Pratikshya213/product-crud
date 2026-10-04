"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50"
    >
      Logout
    </button>
  );
}