import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileMenu({ open, onClose, user }: ProfileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="max-w-xs w-full bg-[#28325c] border-l border-purple-300/30">
        <Card>
            <div className="flex items-center bg-[#ecebdc] rounded-lg shadow px-4 py-3 mb-4">
                {/* Profile Picture */}
                <div className="w-16 h-16 bg-[#d2d1b0] rounded-md flex items-center justify-center text-center text-xs font-serif text-[#333] mr-4">
                    {user?.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-md"
                    />
                    ) : (
                    <span>Google<br />Profile<br />Picture</span>
                    )}
                </div>

                {/* User Info */}
                <div className="flex flex-col justify-center font-serif text-[#2c2c2c]">
                    <p className="text-md font-bold text-[#1a1a2e]">{user?.user_metadata?.name || "Your Name"}</p>
                    <p className="text-xs text-[#444] tracking-wide">LEVEL</p>
                    <div className="h-1 bg-[#c2bd95] rounded w-full my-1"></div>
                    <p className="text-sm">Sun Sign</p>
                    <p className="text-sm">Rising Sign</p>
                </div>
            </div>
        </Card>

        <div className="mt-6 flex flex-col gap-4 text-left text-white">
          <button className="hover:text-white mt-6 border-t">Account Settings</button>
          <button className="hover:text-white mt-6 border-t">Reading Settings</button>
          <button className="hover:text-white mt-6 border-t">About Us</button>
          <button className="hover:text-white mt-6 border-t">Help</button>
          <button className="hover:text-white mt-6 border-t">Feature Requests</button>
          <button className="hover:text-white mt-6 border-t border-purple-300/20 pt-4" onClick={onClose}>
            Log Out
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-white"
        >
        </button>
      </SheetContent>
    </Sheet>
  );
}