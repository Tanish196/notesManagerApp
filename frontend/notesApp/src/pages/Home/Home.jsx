import React, { useState, useEffect, useMemo } from 'react'
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(true);
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
    const itemId = item?._id
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
        navigate('/LogIn')
      }
    }
  }

  const getAllNotes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/get-all-notes')
      if (res.data && res.data.notes) {
        setAllNotes(res.data.notes)
      }
    } catch (error) {
      console.log("An unexpected Error occurred")
    } finally {
      setIsLoading(false);
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
    // handleDelete()
    return () => { }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const notesList = useMemo(() => {
    return allNotes.map((item) => (
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
    ));
  }, [allNotes]); // re-run only when allNotes changes
  
  return (<>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
    <div className='mx-auto container px-4 pt-20'>
      {isLoading ? (
        <div className="flex justify-center items-center mt-40">
          <div className="animate-loading">
            <div className="h-16 w-16 border-4 border-t-green-500 border-r-green-200 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
          </div>
          <span className="ml-4 text-xl text-green-600 animate-pulse">Loading notes...</span>
        </div>
      ) : allNotes.length > 0 ?
        <div className={`cards ${
  viewMode === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
    : 'flex flex-col'
} gap-6 mt-8 animate-fadeInNoteList`}>
          {notesList}
        </div> : (isSearch ? (
          <div className='flex justify-center mt-40 text-2xl sm:text-4xl text-center text-green-700 animate-fadeInNoteList'>
            Note not found. Click the Add button to create note
          </div>
        ) : (
          <div className='flex justify-center mt-40 text-2xl sm:text-4xl text-center text-green-700 animate-fadeInNoteList'>
            No Notes yet. Start creating your first note. Click the Add button to create notes
          </div>
        ))}
    </div>

    <button
      className='w-16 h-16 flex rounded-l-3xl text-secondary bg-green-600 items-center justify-center fixed right-0 bottom-10 shadow-lg hover:bg-green-700 hover:text-white transition animate-bounceAdd'
      onClick={() => {
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }}
      aria-label="Add Note"
    >
      <MdAdd className='text-4xl' />
    </button>

    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => { }}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          padding: 0,
          border: 'none'
        }
      }}
      contentLabel=''
      className={"w-[95%] sm:w-[500px] max-h-[90vh] bg-transparent mx-auto overflow-visible animate-fadeInNote"}
    >
      <AddEditNotes
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        getAllNotes={getAllNotes}
        showToastMessage={showToastMessage}
      />
    </Modal>
    {toast.message && <Toast isShown={toast.isShown} message={toast.message} type={toast.type} onClose={() => { setToast({ isShown: false, message: '' }) }} />}
    <style>
      {`
        .animate-fadeInNoteList {
          animation: fadeInNoteList 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInNoteList {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-bounceAdd {
          animation: bounceAdd 1.2s infinite;
        }
        @keyframes bounceAdd {  
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-fadeInNote {
          animation: fadeInNote 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInNote {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-loading {
          display: inline-block;
          position: relative;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </>

  )
}
export default Home