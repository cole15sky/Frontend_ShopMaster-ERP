"use client";

import { useState } from "react";
import { RefreshCcw, Users, UserCheck, UserX, RotateCcw, Trash2 } from "lucide-react";
import { useUsers } from "@/features/users/hooks";
import type { User } from "@/types/user";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400",
  STAFF: "bg-blue-500/20 text-blue-400",
  CUSTOMER: "bg-green-500/20 text-green-400",
};

function UserRow({
  user,
  onDelete,
  onRestore,
  isDeleted,
}: {
  user: User;
  onDelete?: (id: number) => void;
  onRestore?: (id: number) => void;
  isDeleted?: boolean;
}) {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/30">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
            {(user.full_name || user.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{user.full_name || "—"}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 text-xs rounded-lg ${ROLE_COLORS[user.role] || "bg-slate-700 text-slate-300"}`}>
          {user.role}
        </span>
      </td>
      <td className="p-4 text-slate-400 text-sm">{user.phone || "—"}</td>
      <td className="p-4 text-slate-400 text-sm">{user.position || "—"}</td>
      <td className="p-4">
        <span className={`px-2 py-1 text-xs rounded-lg ${user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {user.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="p-4 text-right">
        {isDeleted ? (
          <button
            onClick={() => onRestore?.(user.id)}
            className="text-slate-400 hover:text-green-400 p-1"
            title="Restore user"
          >
            <RotateCcw size={15} />
          </button>
        ) : (
          <button
            onClick={() => onDelete?.(user.id)}
            className="text-slate-400 hover:text-red-400 p-1"
            title="Soft delete user"
          >
            <Trash2 size={15} />
          </button>
        )}
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const { users, deletedUsers, loading, removeUser, restoreUser, refresh } = useUsers();
  const [tab, setTab] = useState<"active" | "deleted">("active");

  const displayed = tab === "active" ? users : deletedUsers;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Active", value: users.filter((u) => u.is_active).length, icon: UserCheck },
    { label: "Soft Deleted", value: deletedUsers.length, icon: UserX },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} className="text-indigo-400" />
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "active" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
        >
          Active Users
        </button>
        <button
          onClick={() => setTab("deleted")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "deleted" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
        >
          Soft Deleted
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading users...</div>
        ) : displayed.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            {tab === "deleted" ? "No deleted users." : "No users found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isDeleted={tab === "deleted"}
                    onDelete={removeUser}
                    onRestore={restoreUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
