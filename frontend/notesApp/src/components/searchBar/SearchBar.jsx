import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className='w-80 bg-slate-200 rounded-full px-4 items-center flex gap-3'>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder='Search Note'
        className='w-full text-s bg-transparent py-1 outline-none'
      />
      {value && <IoMdClose className='text-slate-400 cursor-pointer hover:text-black' onClick={onClearSearch} />}
      <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-black' onClick={handleSearch} />

    </div>
  )
}
export default SearchBar