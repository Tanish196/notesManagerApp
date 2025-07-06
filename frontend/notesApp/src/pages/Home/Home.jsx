import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Note from '../../components/Cards/Note'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import moment from "moment"
import Toast from '../../components/ToastMessage/Toast'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [isSearch, setIsSearch] = useState(false)

  const [toast, setToast] = useState({
    isShown: true,
    message: "",
    type: "add"
  })

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate()

  const showToastMessage = ({ message, type }) => {
    setToast({
      isShown: true,
      message: message,
      type: type
    })
  }

  const onSearchNote = async (query) => {
    try {
      const res = await axiosInstance.get('/search-note', {
        params: { query }
      })
      if (res.data && res.data.notes) {
        setIsSearch(true)
        setAllNotes(res.data.notes)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: 'edit', data: noteDetails })
  }

  const handleDelete = async (item) => {
    const itemId = item._id
    try {
      const res = await axiosInstance.delete('/delete-note/' + itemId)

      if (res.data && !res.data.error) {
        showToastMessage({ message: "Note Deleted Sucessfully", type: 'delete' })
        getAllNotes()
      }
    } catch (error) {
      if (error.res && error.res.data && error.res.data.message) {
        setError("An Unexpected error occurred")
      }
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await axiosInstance.get('/get-user');
      if (res.data && res.data.user) {
        setUserInfo(res.data.user)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  const getAllNotes = async () => {
    try {
      const res = await axiosInstance.get('/get-all-notes')
      if (res.data && res.data.notes) {
        setAllNotes(res.data.notes)
      }
    } catch (error) {
      console.log("An unexpected Error occurred")
    }
  }

  const updateIsPinned = async (item) => {
    const noteId = item._id
    try {
      const res = await axiosInstance.put('/note-pinned/' + noteId, {
        isPinned: !item.isPinned
      })

      if (res.data && res.data.note) {
        // showToastMessage()
        getAllNotes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserInfo()
    getAllNotes()
    handleDelete()
    return () => { }
  }, [])

  return (<>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
    <div className='mx-auto container px-4'>
      {allNotes.length > 0 ?
        <div className="cards grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <Note
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format("Do MMM YYYY")}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onPinNote={() => updateIsPinned(item)}
              onDelete={() => handleDelete(item)}
              onEdit={() => handleEdit(item)}
            />
          ))}
        </div> : (isSearch ? (<div className='flex justify-center mt-40 text-4xl text-center text-white'>Note not found. Click the Add button to create note</div>) : (<div className='flex justify-center mt-40 text-4xl text-center text-white'>No Notes yet. Start creating your first note. Click the Add button to create notes</div>))}
    </div>

    <button className='w-16 h-16 flex rounded-l-3xl text-secondary bg-white items-center justify-center absolute right-0 bottom-10 hover:bg-black  hover:text-white '>
      <MdAdd className='text-4xl' onClick={() => {
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }} />
    </button>

    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => { }}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
      contentLabel=''
      className={"w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"}>

      <AddEditNotes type={openAddEditModal.type} noteData={openAddEditModal.data} onClose={() => {
        setOpenAddEditModal({ isShown: false, type: "add", data: null });
      }}
        getAllNotes={getAllNotes}
        showToastMessage={showToastMessage} />

    </Modal>
    {toast.message && <Toast isShown={toast.isShown} message={toast.message} type={toast.type} onClose={() => { setToast({ isShown: false, message: '' }) }} />}
  </>

  )
}
export default Home