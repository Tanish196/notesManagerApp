import React from 'react'
import { getInitials } from '../../utils/initials'
const Profile = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex items-center rounded-full bg-slate-400 justify-center'>{getInitials(userInfo.fullName)}
        </div>
        <div className='text-sm '>
          <p className='font-medium'>{userInfo.fullName}</p>
          <button className='underline' onClick={onLogout}>Logout</button>
        </div>
      </div>)
  )
}

export default Profile