import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({ tags, setTags }) => {

    const [newValue, setNewValue] = useState("")
    const addNewTag = () => {
        if (newValue.trim() != "") {
            setTags([...tags, newValue.trim()])
            setNewValue("")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <>
            {tags?.length > 0 && (
                // learn about implicit and explicit return (diff bw () and {})
                <div className='flex gap-3 my-3'>{tags.map((tag, index) => (
                    <span className='bg-slate-200 rounded text-sm items-center justify-center flex gap-2 p-1' key={index}>
                        # {tag} <button className='cursor-pointer' onClick={()=>removeTag(tag)}><MdClose /></button>        
                    </span>
                ))}</div>
            )}

            <div className='flex items-center gap-2'>
                <input type="text" placeholder='Enter Tag' className='outline-none ' onChange={(e) => { setNewValue(e.target.value) }} onKeyDown={handleKeyDown} value={newValue} />
                <button onClick={addNewTag} className='bg-primary items-center justify-center rounded '>
                    <MdAdd className='h-6 w-6 text-white' />
                </button>
            </div>
        </>
    )
}
export default TagInput