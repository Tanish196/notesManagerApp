import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Notes Manager
        </h1>
        <p className="text-gray-600 mb-6">
          Organize your thoughts, keep track of tasks, and manage your notes all in one place.
        </p>
        <div className="flex flex-col gap-4">
          <Link to="/LogIn" className="w-full bg-secondary text-white py-2 rounded-xl font-semibold hover:bg-primary transition">
            Login
          </Link>
          <Link to="/SignUp" className="w-full border border-secondary text-secondary py-2 rounded-xl font-semibold hover:bg-green-50 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;