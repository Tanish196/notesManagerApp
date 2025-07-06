import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
const passwordInput = ({ value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className='flex items-center bg-transparent input-box'>
            <input className='w-full bg-transparent outline-none' type={showPassword ? "text" : "password"} placeholder={placeholder || 'Password'} value={value} onChange={onChange} />
            {showPassword ? (<FaRegEye size={22} className='text-primary cursor-pointer' onClick={toggleShowPassword} />) : (<FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer' onClick={toggleShowPassword} />)}
        </div>
    )
}

export default passwordInput