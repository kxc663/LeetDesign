'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isConfirmPasswordValid = password === confirmPassword && isPasswordValid;

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (countdown > 0) {
      setErrorMessage(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setErrorMessage('');
      setCountdown(60); // Start 60-second countdown
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!verificationCode) {
      setErrorMessage('Please enter the verification code');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all requirements');
      return;
    }

    if (!isConfirmPasswordValid) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);

      // First verify the code
      const verifyResponse = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Invalid verification code');
      }

      // If verification successful, proceed with signup
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Something went wrong');
      }

      router.push(redirect ? `/login?registered=true&redirect=${redirect}` : '/login?registered=true');
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  /*
  const handleSocialLogin = (provider: string) => {
    console.log(`Signup with ${provider}`);
    alert(`${provider} authentication will be implemented with NextAuth.js`);
  };
  */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">LeetDesign</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link href={redirect ? `/login?redirect=${redirect}` : '/login'} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
              <div className="mt-1">
                <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Verification Code */}
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
              <div className="mt-1 flex space-x-2">
                <input id="verificationCode" name="verificationCode" type="text" required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter code from email"
                />
                <button type="button" onClick={handleSendVerification} disabled={isLoading || countdown > 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
                >
                  {countdown > 0 ? `${countdown}s` : 'Send Code'}
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative">
                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  className={`block w-full rounded-md border ${
                    isPasswordValid ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 pr-10`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isPasswordValid ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2 text-sm">
                  <div className="space-y-1">
                    <div className={`flex items-center ${passwordRules.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordRules.minLength ? (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordRules.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordRules.hasUpperCase ? (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      At least one uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordRules.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordRules.hasLowerCase ? (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      At least one lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordRules.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordRules.hasNumber ? (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      At least one number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
              <div className="mt-1 relative">
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full rounded-md border ${
                    isConfirmPasswordValid ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                  } px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 pr-10`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isConfirmPasswordValid ? (
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Privacy Policy</a>
              </label>
            </div>

            {/* Submit button */}
            <div>
              <button type="submit" disabled={isLoading || !isPasswordValid || !isConfirmPasswordValid}
                className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          {/*
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button
                onClick={() => handleSocialLogin('Google')}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Google
              </button>
            </div>
            <div>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                GitHub
              </button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

function SignupFormLoading() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFormLoading />}>
      <SignupForm />
    </Suspense>
  );
}
