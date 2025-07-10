import { Home, BookOpen, History, LogOut } from 'lucide-react';
import { useMediaQuery } from '@uidotdev/usehooks'; // optional but great for responsive logic
import { logout } from './Auth';
import { useNavigate, Link } from 'react-router-dom';

export const NavBar = ({ user }: { user: any }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav
      className={`fixed z-50 w-full bg-background/90 backdrop-blur-sm border-t border-purple-500/20
        ${isMobile ? 'bottom-0' : 'top-0 border-b'}`}
    >
      <div className="flex justify-around items-center p-2 max-w-4xl mx-auto text-purple-300">
        <button onClick={() => navigate('/')} className="flex flex-col items-center hover:text-purple-100">
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>

        <button onClick={() => navigate('/library')} className="flex flex-col items-center hover:text-purple-100">
          <BookOpen size={20} />
          <span className="text-xs">Library</span>
        </button>

        <button onClick={() => navigate('/my-readings')} className="flex flex-col items-center hover:text-purple-100">
          <History size={20} />
          <span className="text-xs">My Readings</span>
        </button>

        <button onClick={logout} className="flex flex-col items-center hover:text-pink-400">
          <LogOut size={20} />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </nav>
  );
};