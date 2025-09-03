import { Link } from 'react-router-dom';
import { FaTags, FaSearch, FaLock, FaUserCircle, FaBell } from 'react-icons/fa';

const features = [
  {
    icon: <FaTags className="text-primary text-3xl" />,
    title: "Tag Your Notes",
    desc: "Organize notes with custom tags for easy filtering.",
  },
  {
    icon: <FaSearch className="text-primary text-3xl" />,
    title: "Smart Search",
    desc: "Quickly find notes using the search bar.",
  },
  {
    icon: <FaLock className="text-primary text-3xl" />,
    title: "Secure Login",
    desc: "Your notes are protected with secure authentication.",
  },
  {
    icon: <FaBell className="text-primary text-3xl" />,
    title: "Instant Feedback",
    desc: "Get toast notifications for actions and errors.",
  },
  {
    icon: <FaUserCircle className="text-primary text-3xl" />,
    title: "Profile Management",
    desc: "Manage your account and view your profile.",
  },
];

const Intro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-green-600 shadow-md">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow">NoteMan</span>
        <div className="flex gap-2">
          <Link
            to="/LogIn"
            className="px-4 sm:px-5 py-2 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-100 transition text-sm sm:text-base"
          >
            Login
          </Link>
          <Link
            to="/SignUp"
            className="px-4 sm:px-5 py-2 rounded-lg border border-white text-white font-semibold hover:bg-green-500 transition text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-primary mb-3 tracking-tight drop-shadow animate-fadeIn text-center">
          Notes Manager
        </h1>
        <p className="text-gray-700 mb-7 text-base sm:text-xl text-center max-w-2xl animate-fadeIn">
          Organize your thoughts, manage tasks, and keep your notes safe & accessible.
        </p>
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-green-50 rounded-xl p-4 sm:p-6 shadow-lg hover:scale-105 transition animate-fadeIn"
            >
              {f.icon}
              <span className="font-semibold mt-3 text-green-900 text-base sm:text-lg text-center">{f.title}</span>
              <span className="text-xs sm:text-sm text-gray-600 mt-2 text-center">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Animation keyframes and theme */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .text-primary { color: #22c55e; }
          .bg-primary { background: #22c55e; }
          .border-primary { border-color: #22c55e; }
        `}
      </style>
      <footer className="w-full text-center py-4 mt-6 sm:mt-10 text-green-700 font-medium opacity-80 text-sm sm:text-base">
        Made by <span className="font-bold text-green-900">Tanish Jagetiya</span>
      </footer>
    </div>
  );
};

export default Intro;