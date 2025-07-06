import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput.jsx';
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/validateEmail.js';
import axiosInstance from '../../utils/axiosInstance.js';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter name")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!pass) {
      setError("Please enter pass")
      return
    }

    setError("")

    try {
      const res = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: pass,
      })
      // Handle Successful Registration
      if (res.data && res.data.error) {
        setError(res.data.message)
        return
      }

      if (res.data && res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.res && error.res.data && error.res.data.message) {
        setError(error.res.data.message)
      } else {
        setError("Unexpected Error Occured")
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-30'>
        <div className='w-96 border rounded bg-amber-50 px-7 py-10'>
          <form action="" onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7 text-center'> Sign Up </h4>
            <input
              value={name}
              type="text"
              placeholder='Name'
              className='input-box'
              onChange={(e) => setName(e.target.value)} />
            <input
              value={email}
              type="text"
              placeholder='Email'
              className='input-box'
              onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput value={pass} onChange={(e) => setPass(e.target.value)} />
            <button type='submit' className='btn-primary'>Login</button>
            {error && <p className='text-xs text-red-500 m-1'>{error}</p>}
            <p className='text-center text-sm mt-4'>Already have an account ?
              <Link to='/logIn' className=''>  Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )

}

export default SignUp