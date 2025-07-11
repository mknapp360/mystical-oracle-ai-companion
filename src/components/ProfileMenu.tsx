import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileMenu({ open, onClose, user }: ProfileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-xs w-full bg-background border-l border-purple-300/30">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">{user?.user_metadata?.full_name || "User"}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 text-sm font-medium">
          <div className="text-xs text-muted-foreground">Sun Sign</div>
          <div className="text-xs text-muted-foreground">Rising Sign</div>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-left text-purple-200">
          <button className="hover:text-white">Account Settings</button>
          <button className="hover:text-white">Reading Settings</button>
          <button className="hover:text-white">About Us</button>
          <button className="hover:text-white">Help</button>
          <button className="hover:text-white">Feature Requests</button>
          <button className="hover:text-white mt-6 border-t border-purple-300/20 pt-4" onClick={onClose}>
            Log Out
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-white"
        >
          <X size={18} />
        </button>
      </SheetContent>
    </Sheet>
  );
}