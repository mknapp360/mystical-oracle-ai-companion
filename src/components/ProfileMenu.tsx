import { X } from 'lucide-react';
import { logout } from './Auth';

export default function ProfileMenu({ open, onClose, user }: { open: boolean, onClose: () => void, user: any }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-72 bg-[#f8f8ea] shadow-lg transform transition-transform duration-300 z-50 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <p className="font-bold text-gray-800">{user?.user_metadata?.name || 'Your Name'}</p>
          <p className="text-xs text-gray-500">Sun Sign</p>
          <p className="text-xs text-gray-500">Rising Sign</p>
        </div>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {[
          'Account Settings',
          'Reading Settings',
          'About Us',
          'Help',
          'Feature Requests',
        ].map((item) => (
          <button
            key={item}
            className="w-full text-left text-sm text-gray-700 hover:text-purple-600"
            onClick={() => {
              // Add your routing or modal logic here
              onClose();
            }}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full text-left text-sm text-red-600 hover:text-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}