import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donatur');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi register
    alert(`Register sebagai ${name} (${role})`);
  };

  const handleGoogleRegister = () => {
    alert('Register dengan Google (simulasi)');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Nama lengkap"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Masukkan email"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Masukkan password"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Daftar Sebagai</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="donatur">Donatur</option>
            <option value="pengelola">Pengelola Kampanye</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
        >
          Register
        </button>
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
        >
          Register dengan Google
        </button>
        <div className="text-center text-sm mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-600 hover:underline">Login di sini</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 