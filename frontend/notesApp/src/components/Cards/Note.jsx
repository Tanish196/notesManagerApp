import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
const Note = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote, style }) => {
    return (
        <div
            className='rounded-2xl w-full p-5 bg-white shadow-md hover:shadow-xl transition-all duration-200 ease-in-out animate-fadeInCard'
            style={style}
        >
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-lg font-semibold text-green-700'>{title}</h1>
                    <div className='text-xs text-green-400'>{date}</div>
                </div>
                <MdOutlinePushPin
                    onClick={onPinNote}
                    className={`icon-btn ${isPinned ? 'text-green-600 font-bold' : 'text-slate-300'} transition-colors duration-200`}
                    title={isPinned ? "Unpin" : "Pin"}
                />
            </div>
            <p className='text-sm mt-3 text-slate-700'>{content}</p>
            <div className='text-sm flex justify-between mt-4 items-center'>
                <div className='flex flex-wrap gap-1'>
                    {tags.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">#{item}</span>
                    ))}
                </div>
                <div className='flex gap-3'>
                    <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit} title="Edit" />
                    <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete} title="Delete" />
                </div>
            </div>
            <style>
                {`
                    .animate-fadeInCard {
                        animation: fadeInCard 0.6s cubic-bezier(.4,0,.2,1) both;
                    }
                    @keyframes fadeInCard {
                        from { opacity: 0; transform: scale(0.96) translateY(20px);}
                        to { opacity: 1; transform: scale(1) translateY(0);}
                    }
                `}
            </style>
        </div>
    )
}

export default Note