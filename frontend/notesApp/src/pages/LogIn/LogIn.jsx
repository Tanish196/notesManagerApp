import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput.jsx';
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/validateEmail.js';
import axiosInstance from '../../utils/axiosInstance.js';

const LogIn = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        
        if (!password) {
            setError("Please enter pass")
            return
        }

        setError("")

        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password
            })

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard')
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Unexpected error Occured")
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-30'>
                <div className='w-96 border rounded bg-amber-50 px-7 py-10'>
                    <form action="" onSubmit={handleSubmit}>
                        <h4 className='text-2xl mb-7 text-center'> Login </h4>
                        <input
                            value={email}
                            type="text"
                            placeholder='Email'
                            className='input-box'
                            onChange={(e) => setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit' className='btn-primary'>Login</button>
                        {error && <p className='text-xs text-red-500 m-1'>{error}</p>}
                        <p className='text-center text-sm mt-4'>Not registered yet?
                            <Link to='/signUp' className=''>Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LogIn