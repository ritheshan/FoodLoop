import { useState } from 'react';
import Loader from '../Components/ui/Loader';

const ForgotPassword = ({ onBack, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error sending reset code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (data.success) {
        setStep(3);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error verifying code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Password reset successfully');
        onBack(); // Go back to login after successful reset
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error resetting password. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-600">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify Code' : 'Reset Password'}
        </h2>
        <p className="text-gray-600 mt-2">
          {step === 1 
            ? 'Enter your email to receive a reset code' 
            : step === 2 
              ? 'Enter the verification code sent to your email' 
              : 'Create a new password for your account'}
        </p>
      </div>
      
      {step === 1 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="forgot-email">
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSendCode}
            disabled={loading}
            className={`w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader className="h-5 w-5 mr-2" /> : null}
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </>
      )}
      
      {step === 2 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="verification-code">
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              placeholder="Enter verification code"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className={`w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader className="h-5 w-5 mr-2" /> : null}
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </>
      )}
      
      {step === 3 && (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className={`w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors flex justify-center items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader className="h-5 w-5 mr-2" /> : null}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
      
      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-green-600 hover:underline flex items-center justify-center mx-auto"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;