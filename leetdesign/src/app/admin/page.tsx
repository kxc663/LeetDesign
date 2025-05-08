'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Welcome to Admin Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Use the sidebar to navigate to different admin functions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">Problems</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage system design problems in the problem bank.</p>
          <Link
            href="/admin/problems/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Problem
          </Link>
        </div>

        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">Users</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">View and manage user accounts and permissions.</p>
          <Link
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
} 