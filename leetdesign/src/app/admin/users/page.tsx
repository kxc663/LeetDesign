'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import ConfirmationModal from '@/components/ConfirmationModal';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
}

export default function UserManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [modalContent, setModalContent] = useState<{ name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, we would check if the user has admin role
  const isAdmin = isAuthenticated && user?.email?.endsWith('@leetdesign.com');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleDeleteClick = (user: User) => {
    setModalContent({ name: user.name });
    setUserToDelete(user);
  };

  const handleModalClose = () => {
    setUserToDelete(null);
    // Clear modal content after a short delay to allow animation to complete
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userToDelete.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // Refresh the users list
      await fetchUsers();
      setDeleteError(null);
      setUserToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred while deleting user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Access control
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Users</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Add New User
            </button>
          </div>
        </div>

        {(error || deleteError) && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded-md">
            {error || deleteError}
          </div>
        )}

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Users
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or role..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Users: <span className="font-semibold">{users.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'active' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.joinedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                          Edit
                        </button>
                        {user.role !== 'Admin' && (
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? "No users match your search criteria. Try adjusting your search."
                : "No users are available yet."}
            </p>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Your First User
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={handleModalClose}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={modalContent ? `Are you sure you want to delete ${modalContent.name}?` : ''}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        confirmButtonVariant="danger"
      />
    </div>
  );
} 