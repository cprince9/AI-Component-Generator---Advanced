import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-gradient-to-b from-[#09090b] via-[#101017] to-[#09090b] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#141319]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 shadow-2xl shadow-purple-950/20 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Create GenU Account</h2>
          <p className="text-sm text-gray-400 mt-1">Start building and saving advanced AI UI components</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500"><FiUser size={18} /></span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
                className="w-full bg-[#09090b] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500"><FiMail size={18} /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#09090b] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500"><FiLock size={18} /></span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#09090b] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50 mt-2"
          >
            {loading ? <ClipLoader color="white" size={18} /> : <><span>Create My Account</span> <FiArrowRight /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800/60 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-indigo-300/80">
          <FiShield className="text-indigo-400 shrink-0" size={16} />
          <span>Your data is securely stored in MongoDB with Bcrypt password hashing.</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
