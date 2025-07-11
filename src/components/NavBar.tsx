import { Home, Book, BookOpen, History, LogIn, LogOut, Menu } from 'lucide-react';
import { logout, loginWithGoogle } from './Auth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import ProfileMenu from './ProfileMenu';

interface NavBarProps {
  user: any;
}

export const NavBar = ({ user }: NavBarProps) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      {/* Bottom NavBar container - always fixed to bottom */}
      <nav className="fixed bottom-0 w-full bg-[#28325c] border-t border-purple-700/20 z-50">
        <div className="flex justify-around items-center py-3 px-4 relative">
          <Link to="/" className="text-white hover:text-white flex flex-col items-center">
            <Home size={20} />
            <span className="text-xs">Home</span>
          </Link>

          <Link to="/library" className="text-white hover:text-white flex flex-col items-center">
            <BookOpen size={20} />
            <span className="text-xs">Library</span>
          </Link>

          {user && (
            <Link to="/journey" className="text-white hover:text-white flex flex-col items-center">
              <History size={20} />
              <span className="text-xs">My Journey</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="text-white hover:text-white flex flex-col items-center"
            >
              <LogOut size={20} />
              <span className="text-xs">Logout</span>
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="text-white hover:text-white flex flex-col items-center"
            >
              <LogIn size={20} />
              <span className="text-xs">Login</span>
            </button>
          )}

          {/* Slide-out Profile Menu Trigger */}
          {user && (
            <button
              onClick={() => setShowProfile(true)}
              className="text-white hover:text-white flex flex-col items-center"
            >
              <Menu size={20} />
              <span className="text-xs">Menu</span>
            </button>
          )}
        </div>
      </nav>

      {/* Profile menu drawer */}
      {user && (
        <ProfileMenu open={showProfile} onClose={() => setShowProfile(false)} user={user} />
      )}
    </>
  );
};