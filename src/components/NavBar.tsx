import { Home, Book, BookOpen, History, LogIn, LogOut } from 'lucide-react';
import { useMediaQuery } from '@uidotdev/usehooks'; // optional but great for responsive logic
import { logout } from './Auth';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle } from './Auth';

interface NavBarProps {
  user: any;
}

export const NavBar = ({ user }: NavBarProps) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <nav
      className={`fixed ${isMobile ? 'bottom-0' : 'top-0'} w-full bg-background border-t border-purple-700/20 z-50`}
    >
      <div className="flex justify-around items-center py-3">
        {/* Shared: Link to Card Library */}
        <Link to="/library" className="text-purple-300 hover:text-white flex flex-col items-center">
          <Book size={20} />
          <span className="text-xs">Library</span>
        </Link>

        {/* If user is logged in */}
        {user ? (
          <>
            <Link to="/" className="text-purple-300 hover:text-white flex flex-col items-center">
              <Home size={20} />
              <span className="text-xs">Reading</span>
            </Link>

            <button
              onClick={logout}
              className="text-purple-300 hover:text-white flex flex-col items-center"
            >
              <LogOut size={20} />
              <span className="text-xs">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={loginWithGoogle} // Or trigger OAuth flow
            className="text-purple-300 hover:text-white flex flex-col items-center"
          >
            <LogIn size={20} />
            <span className="text-xs">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};