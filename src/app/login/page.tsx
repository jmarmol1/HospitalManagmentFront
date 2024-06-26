"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(formData.userType);
      let apiToFetch =
        formData.userType == "patient"
          ? `${process.env.NEXT_PUBLIC_API_URL!}/api/users/login/patient`
          : `${process.env.NEXT_PUBLIC_API_URL!}/api/users/login/nurse`;

      const response = await fetch(apiToFetch, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);

    if (formData.userType == "patient") router.push(`/patient/${data.patient._id}`);
    if (formData.userType == "nurse") router.push("/nurse");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-center text-2xl font-bold mt-5">
        Login Hospital Managment
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 space-y-6"
      >
        <input
          className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select
          className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="">Select User Type</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
      </form>
      <Link href={'/register'} className="mt-8">
        <span className=" text-gray-600">You don&apos;t have an account?</span>
      </Link>
    </div>
  );
}
