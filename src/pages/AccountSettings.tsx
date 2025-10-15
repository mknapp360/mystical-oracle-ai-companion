// src/pages/AccountSettings.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { BirthChartForm } from '@/components/BirthChartForm';
import { getUserBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Sparkles } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      setUser(user);

      try {
        const chart = await getUserBirthChart(user.id);
        setBirthChart(chart);
      } catch (error) {
        console.error('Error loading birth chart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSave = (chartData: BirthChartData) => {
    setBirthChart(chartData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-[#28325c] border-b border-purple-300/20 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-sm text-purple-200">Manage your profile and birth data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info Card */}
        <Card className="bg-card border-purple-300/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-purple-300/30"
                />
              )}
              <div>
                <p className="font-semibold text-lg">
                  {user?.user_metadata?.name || user?.email}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {birthChart && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200/30">
                <p className="text-sm font-medium mb-2">Your Birth Chart</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Sun:</span>{' '}
                    <span className="font-medium">{birthChart.natal_planets.Sun.sign}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Moon:</span>{' '}
                    <span className="font-medium">{birthChart.natal_planets.Moon.sign}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rising:</span>{' '}
                    <span className="font-medium">{birthChart.ascendant_sign}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  📍 {birthChart.birth_city}, {birthChart.birth_country}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Birth Chart Form */}
        <Card className="bg-card border-purple-300/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {birthChart ? 'Update Birth Data' : 'Add Birth Data'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {birthChart 
                ? 'Update your birth information to refine your personalized readings'
                : 'Enter your birth information to unlock personalized astrological insights'
              }
            </p>
          </CardHeader>
          <CardContent>
            <BirthChartForm
              onSave={handleSave}
              existingChart={birthChart || undefined}
              userId={user?.id}
            />
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground space-y-2 px-4">
          <p>Your birth data is used to calculate your natal chart and provide personalized readings.</p>
          <p>All information is stored securely and privately.</p>
        </div>
      </div>
    </div>
  );
}