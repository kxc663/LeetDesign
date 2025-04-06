'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              LeetDesign
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/problems" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              Problems
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleMenu}
                  className="flex items-center focus:outline-none"
                >
                  <Avatar user={user} size="md" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 dark:text-gray-300"
              onClick={toggleMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link href="/problems" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 py-2">
                Problems
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 py-2">
                About
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="py-2 flex items-center">
                    <Avatar user={user} size="sm" className="mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link href="/profile" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 py-2 pl-11">
                    Profile
                  </Link>
                  <Link href="/settings" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 py-2 pl-11">
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 py-2 pl-11"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-block w-fit">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}