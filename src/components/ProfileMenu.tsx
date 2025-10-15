// src/components/ProfileMenu.tsx

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getUserBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileMenu({ open, onClose, user }: ProfileMenuProps) {
  const navigate = useNavigate();
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && open) {
      setLoading(true);
      getUserBirthChart(user.id)
        .then(chart => {
          setBirthChart(chart);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading birth chart:', err);
          setLoading(false);
        });
    }
  }, [user, open]);

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-xs w-full bg-[#28325c] border-l border-purple-300/30">
        <Card>
          <div className="flex items-center bg-card rounded-lg">
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
              <p className="text-md font-bold text-[#1a1a2e]">
                {user?.user_metadata?.name || "Your Name"}
              </p>
              <p className="text-xs text-[#444] tracking-wide">LEVEL</p>
              <div className="h-1 bg-[#c2bd95] rounded w-full my-1"></div>
              
              {loading ? (
                <p className="text-xs text-gray-500 italic">Loading chart...</p>
              ) : birthChart ? (
                <>
                  <p className="text-sm">☀️ {birthChart.natal_planets.Sun.sign} Sun</p>
                  <p className="text-sm">⬆️ {birthChart.ascendant_sign} Rising</p>
                  <p className="text-sm">🌙 {birthChart.natal_planets.Moon.sign} Moon</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-500">No birth chart yet</p>
                  <p className="text-xs text-gray-400">Add in Account Settings</p>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-6 flex flex-col gap-4 text-left text-white">
          <button 
            className="hover:text-white mt-6 border-t pt-4 text-left"
            onClick={() => handleNavigation('/settings')}
          >
            Account Settings
          </button>
          <button className="hover:text-white border-t pt-4 text-left">
            Reading Settings
          </button>
          <button className="hover:text-white border-t pt-4 text-left">
            About Us
          </button>
          <button className="hover:text-white border-t pt-4 text-left">
            Help
          </button>
          <button className="hover:text-white border-t pt-4 text-left">
            Feature Requests
          </button>
          <button
            className="hover:text-white border-t border-white pt-4 text-left"
            onClick={onClose}
          >
            Log Out
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </SheetContent>
    </Sheet>
  );
}