import React, { useState } from 'react'
import Profile from '../Cards/Profile'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../searchBar/SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch}) => {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/")
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

    <div className='fixed top-0 left-0 right-0 z-5 backdrop-blur-md bg-white/80 border-b border-green-100/50 flex items-center justify-between px-6 py-2 gap-1'>
      <h2 className='text-xl font-medium text-black/90 py-2 select-none'>
        <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">Notes</span>
      </h2>
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