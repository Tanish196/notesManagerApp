import React from 'react'
import { getInitials } from '../../utils/initials'
const Profile = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className='flex items-center gap-3 bg-green-100 px-3 py-2 rounded-xl shadow'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full bg-green-400 text-white font-bold text-lg'>
          {getInitials(userInfo.fullName)}
        </div>
        <div className='text-sm'>
          <p className='font-semibold text-green-700'>{userInfo.fullName}</p>
          <button className='underline text-green-600 hover:text-green-800 transition hover:cursor-pointer' onClick={onLogout}>Logout</button>
        </div>
      </div>
    )
  )
}

export default Profile