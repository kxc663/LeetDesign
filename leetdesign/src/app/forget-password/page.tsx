'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function ForgetPasswordForm() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    const [countdown, setCountdown] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const router = useRouter();

    const passwordRules = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
    };
    const isPasswordValid = Object.values(passwordRules).every(Boolean);
    const isConfirmPasswordValid = password === confirmPassword && isPasswordValid;

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (countdown > 0) {
            setIsResendDisabled(true);
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown]);

    // Send Verification Code Request
    const handleSendVerificationCode = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!email) {
            setErrorMessage('Please enter your email address.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send verification code.');
            }

            setSuccessMessage('Verification code sent to your email.');
            setIsEmailSubmitted(true);
            setCountdown(60);
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred while sending the code.');
            setIsEmailSubmitted(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Verify Code Request
    const handleVerifyCode = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!verificationCode) {
            setErrorMessage('Please enter the verification code.');
            return;
        }
        setIsLoading(true);

        try {

            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid or expired verification code.');
            }

            setSuccessMessage('Code verified successfully. Please set your new password.');
            setIsCodeVerified(true);
            setErrorMessage('');
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred during verification.');
            setIsCodeVerified(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Final Password Reset Submission
    const handlePasswordResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!isPasswordValid || !isConfirmPasswordValid) {
            setErrorMessage('Please ensure the password meets all requirements and passwords match.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode, newPassword: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }

            setSuccessMessage('Password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred while resetting the password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Feedback Messages */}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form className="space-y-6" onSubmit={handlePasswordResetSubmit}>

                {/*  Email Input */}
                {!isCodeVerified && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                        <div className="mt-1">
                            <input
                                id="email" name="email" type="email" autoComplete="email" required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={isEmailSubmitted} // Make read-only after code is sent
                                className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 ${isEmailSubmitted ? 'read-only:bg-gray-100 dark:read-only:bg-gray-600' : ''}`}
                            />
                        </div>
                    </div>
                )}

                {/*  Send/Resend Code Button */}
                {!isCodeVerified && (
                    <div>
                        <button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={isLoading || isResendDisabled}
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && !isEmailSubmitted ? 'Sending...' :
                                isLoading && isEmailSubmitted ? 'Resending...' :
                                    isResendDisabled ? `Resend Code (${countdown}s)` :
                                        isEmailSubmitted ? 'Resend Code' : 'Send Verification Code'
                            }
                        </button>
                    </div>
                )}

                {/* Verification Code */}
                {isEmailSubmitted && !isCodeVerified && (
                    <>
                        <div>
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                            <div className="mt-1 flex gap-2">
                                <input
                                    id="verificationCode" name="verificationCode" type="text" required
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter code from email"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    disabled={isLoading || !verificationCode}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </button>
                            </div>
                        </div>
                    </>
                )}


                {/* New Password Fields */}
                {isCodeVerified && (
                    <>
                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="mt-1 relative">
                                <input id="password" name="password" type="password" autoComplete="new-password" required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setShowPasswordRequirements(true)}
                                    className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 pr-10`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {isPasswordValid ? (
                                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    ) : password.length > 0 ? (
                                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    ) : null}
                                </div>
                            </div>
                            {showPasswordRequirements && (
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p className="font-medium mb-1">Password must contain:</p>
                                    <ul className="space-y-1 list-disc list-inside">
                                        <li className={passwordRules.minLength ? 'text-green-600' : 'text-red-600'}>At least 8 characters</li>
                                        <li className={passwordRules.hasUpperCase ? 'text-green-600' : 'text-red-600'}>At least one uppercase letter (A-Z)</li>
                                        <li className={passwordRules.hasLowerCase ? 'text-green-600' : 'text-red-600'}>At least one lowercase letter (a-z)</li>
                                        <li className={passwordRules.hasNumber ? 'text-green-600' : 'text-red-600'}>At least one number (0-9)</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <div className="mt-1 relative">
                                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 pr-10`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {password.length > 0 && confirmPassword.length > 0 && (
                                        isConfirmPasswordValid ? (
                                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        )
                                    )}
                                </div>
                            </div>
                            {password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
                            )}
                        </div>

                        {/* Submit New Password Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !isPasswordValid || !isConfirmPasswordValid}
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </>
    );
}

function ForgetPasswordFormWrapper() {
    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">LeetDesign</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your email to receive a verification code.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <ForgetPasswordForm />
                    <div className="mt-6 text-center">
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

function ForgetPasswordFormLoading() {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600"></div>
            <p className="ml-3 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
    );
}

export default function ForgetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Suspense fallback={<ForgetPasswordFormLoading />}>
                <ForgetPasswordFormWrapper />
            </Suspense>
        </div>
    );
}