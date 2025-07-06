import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
const Note = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
    return (
        <div className='border rounded w-full p-4 bg-white hover:shadow-xl transition:all ease-in-out'>
            <div className='items-center justify-between flex'>
                <div>
                    <h1 className='text-lg font-medium'>{title}</h1>
                    <div className='text-xs text-slate-500'>{date}</div>
                </div>
                <MdOutlinePushPin onClick={onPinNote} className={`icon-btn ${isPinned?'text-green-700 text-bold':'text-slate-300'}`} />
            </div>
            <p className='text-sm mt-2'>{content}</p>
            <div className='text-sm flex justify-between mt-2'>
                <div className='text-slate-500'>{tags.map((item)=>`#${item}   `)}</div>
                <div className='flex gap-2 '>
                    <MdCreate className='icon-btn' onClick={onEdit} />
                    <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete} />
                </div>
            </div>
        </div>
    )
}

export default Note