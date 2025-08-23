import React, { use, useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { IoMdClose } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({ showToastMessage, noteData, type, onClose, getAllNotes }) => {
    const [title, setTitle] = useState(noteData?.title || "")
    const [content, setContent] = useState(noteData?.content || "")
    const [tags, setTags] = useState(noteData?.tags || [])

    const [error, setError] = useState(null)

    const editNote = async () => {
        const noteId = noteData._id
        try {
            const res = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags
            })

            if (res.data && res.data.note) {
                showToastMessage({message:"Note Edited Sucessfully", type:'edit'})
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.res && error.res.data && error.res.data.message) {
                setError(error.res.data.message)
            }
        }
    }

    const addNewNote = async () => {
        try {
            const res = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            })

            if (res.data && res.data.note) {
                showToastMessage({message:"Note Added Sucessfully", type:'add'})
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.res && error.res.data && error.res.data.message) {
                setError(error.res.data.message)
            }
        }
    }
    
    const handleAddNote = () => {
        if (!title) {
            setError("Please enter Title")
            return;
        }
        setError("")

        if (type === "edit") {
            editNote();
        } else {
            addNewNote();
        }
    }

    return (
        <div className='relative'>
            <button className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center absolute -top-3 -right-3 cursor-pointer'>
                <MdClose className='text-xl text-slate-950' onClick={onClose} />
            </button>
            <div className='flex relative flex-col gap-2 w-80'>
                <label className='input-label ' >TITLE</label>
                <input
                    type="text"
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Enter Title'
                    // onChange={(e)=>setTitle(e.target.value)}  same as below
                    onChange={({ target }) => setTitle(target.value)}
                    value={title} />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>CONTENT</label>
                <textarea
                    type='text'
                    className='rounded text-sm text-slate-9500 outline-none bg-slate-50 p-2'
                    rows={10}
                    onChange={({ target }) => setContent(target.value)}
                    value={content}
                    placeholder='content' />
            </div>

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {error && <p className='text-red-500'>{error}</p>}
            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{type === "edit" ? "UPDATE" : "ADD"}</button>
        </div>
    )
}

export default AddEditNotes