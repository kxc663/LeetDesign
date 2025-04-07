'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/AuthContext';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // In a real app, we would check if the user has admin role
  const isAdmin = isAuthenticated && user?.email?.endsWith('@leetdesign.com');

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access this page.</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <Link 
                  href="/admin" 
                  className={`block px-4 py-2 rounded-md ${
                    activeTab === 'dashboard' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/problems/create" 
                  className={`block px-4 py-2 rounded-md ${
                    activeTab === 'create-problem' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Create Problem
                </Link>
                <Link 
                  href="/admin/problems" 
                  className={`block px-4 py-2 rounded-md ${
                    activeTab === 'manage-problems' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Manage Problems
                </Link>
                <Link 
                  href="/admin/users" 
                  className={`block px-4 py-2 rounded-md ${
                    activeTab === 'users' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  User Management
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
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
          </div>
        </div>
      </div>
    </div>
  );
} 