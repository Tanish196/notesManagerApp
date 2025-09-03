import React, { useState } from 'react'
// import Navbar from '../../components/Navbar/Navbar';
// import PasswordInput from '../../components/Input/PasswordInput.jsx';
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/validateEmail.js';
import axiosInstance from '../../utils/axiosInstance.js';

const PasswordInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mb-3">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="input-box w-full pr-10"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-sm"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};

const LogIn = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setError("Please enter pass")
            return
        }
        setError("")
        setLoading(true);
        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password
            })
            setLoading(false);
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard')
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Unexpected error Occured")
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col">
            {/* Navbar */}
            <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-green-600 shadow-md">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow">NoteMan</span>
                <div>
                    <Link
                        to="/SignUp"
                        className="px-4 sm:px-5 py-2 rounded-lg border border-white text-white font-semibold hover:bg-green-500 transition text-sm sm:text-base"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-2 sm:px-4">
                <div className='w-full max-w-md border rounded-2xl bg-white shadow-2xl px-7 py-10 animate-fadeIn'>
                    <form action="" onSubmit={handleSubmit}>
                        <h4 className='text-2xl mb-7 text-center text-primary font-bold'> Login </h4>
                        <input
                            value={email}
                            type="text"
                            placeholder='Email'
                            className='input-box w-full mb-3'
                            onChange={(e) => setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit' className='btn-primary w-full mt-4' disabled={loading}>
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              Logging In...
                            </span>
                          ) : "Login"}
                        </button>
                        {error && <p className='text-xs text-red-500 m-1'>{error}</p>}
                        <p className='text-center text-sm mt-4'>Not registered yet?
                            <Link to='/signUp' className='text-primary font-semibold'> Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
            {/* Animation keyframes and theme */}
            <style>
                {`
                  .animate-fadeIn {
                    animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1);
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                  }
                  .text-primary { color: #22c55e; }
                  .bg-primary { background: #22c55e; }
                  .border-primary { border-color: #22c55e; }
                `}
            </style>
        </div>
    )
}

export default LogIn;