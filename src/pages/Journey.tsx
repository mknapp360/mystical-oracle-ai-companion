import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TarotCard as TarotCardType } from "@/types/tarot";
import { TarotCard } from "@/components/TarotCard";

interface Reading {
  id: string;
  question: string;
  cards: string; // stored as JSON string
  interpretation: string;
  created_at: string;
}

export default function JourneyPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [parsedCards, setParsedCards] = useState<{ card: TarotCardType; orientation: string }[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndReadings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("readings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setReadings(data);
        if (error) console.error("Error fetching readings:", error.message);
      }
    };

    fetchUserAndReadings();
  }, []);

  const handleSelectReading = (reading: Reading) => {
    try {
      const cards = JSON.parse(reading.cards);
      setParsedCards(cards);
    } catch (err) {
      console.error("Error parsing cards:", err);
      setParsedCards([]);
    }
    setSelectedReading(reading);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-serif text-purple-200 text-center">🧭 My Journey</h1>

      {readings.length === 0 && (
        <p className="text-center text-muted-foreground">No readings yet. Start your journey by drawing your first card!</p>
      )}

      {readings.map((reading) => (
        <Card
          key={reading.id}
          className="bg-card/50 backdrop-blur-sm border-purple-500/30 hover:shadow-md transition cursor-pointer"
          onClick={() => handleSelectReading(reading)}
        >
          <CardContent className="py-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {new Date(reading.created_at).toLocaleDateString()}
              </p>
              <p className="text-lg text-purple-200 font-serif mt-1">
                {reading.question || "Untitled Question"}
              </p>
            </div>
            <div className="bg-black text-white text-xs px-2 py-1 rounded">tarot</div>
          </CardContent>
        </Card>
      ))}

      {/* Modal to show full reading */}
      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto border-purple-500/30 bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-purple-200 font-serif">
              Reading from {selectedReading && new Date(selectedReading.created_at).toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <p className="italic text-muted-foreground">
              {selectedReading?.question || "No question provided."}
            </p>

            {/* Render AI interpretation */}
            <div className="space-y-2">
              <h3 className="text-purple-200 font-serif text-lg">Interpretation</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {selectedReading?.interpretation}
              </p>
            </div>

            {/* Render cards */}
            {parsedCards.length > 0 && (
              <div>
                <h3 className="text-purple-200 font-serif text-lg mb-2">Drawn Cards</h3>
                <div className={`grid gap-4 ${parsedCards.length === 3 ? 'md:grid-cols-3' : 'justify-center'}`}>
                  {parsedCards.map((entry, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2">
                      <div
                        className={`transition-transform ${
                          entry.orientation === "reversed" ? "rotate-180" : ""
                        }`}
                      >
                        <TarotCard card={entry.card} isRevealed={true} />
                      </div>
                      <p className="text-xs italic text-muted-foreground">
                        {entry.orientation.charAt(0).toUpperCase() + entry.orientation.slice(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}