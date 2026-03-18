"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p>Welcome, customer! You can view your orders and account info.</p>
      </div>
    </ProtectedRoute>
  );
}