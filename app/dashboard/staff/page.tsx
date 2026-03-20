"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
export default function StaffDashboard() {
  return (
    <ProtectedRoute allowedRoles={["STAFF"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <p>Welcome, staff! You can view inventory, sales, and manage tasks.</p>
      </div>
    </ProtectedRoute>
  );
}