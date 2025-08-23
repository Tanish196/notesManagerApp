import React, { useState } from 'react'
import Profile from '../Cards/Profile'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../searchBar/SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch}) => {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/LogIn")
  }

  const [searchQuery, setSearchQuery] = useState("")
  const handleSearch = () => { 
    if (searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (

    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow gap-1'>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
      {userInfo && (<SearchBar
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value) }} />)}
      <Profile userInfo={userInfo} onLogout={onLogout} />

    </div>
  )
}

export default Navbar