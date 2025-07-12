import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TarotCard as TarotCardComponent } from "@/components/TarotCard";
import { ChevronDown, Share2, Download, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Reading {
  id: string;
  question: string;
  cards: string; // stored as stringified JSON
  interpretation: string;
  created_at: string;
}

export default function JourneyPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
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

  const parsedCards = selectedReading ? JSON.parse(selectedReading.cards) : [];

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6 bg-background">
      <h1 className="text-3xl font-serif text-headerText text-center">🧭 My Journey</h1>

      {readings.length === 0 && (
        <p className="text-center text-muted-foreground">
          No readings yet. Start your journey by drawing your first card!
        </p>
      )}

      {readings.map((reading) => (
        <Card
          key={reading.id}
          className="bg-input backdrop-blur-sm border-border hover:shadow-md transition cursor-pointer"
          onClick={() => setSelectedReading(reading)}
        >
          <CardContent className="py-4 flex justify-between items-center relative">
            <div>
              <p className="text-sm text-black">
                {new Date(reading.created_at).toLocaleDateString()}
              </p>
              <p className="text-lg text-black font-serif mt-1">
                {reading.question || "Untitled Question"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-black text-white text-xs px-2 py-1 rounded">tarot</div>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ml-2">
                  <ChevronDown size={18} className="text-muted-foreground hover:text-white transition" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border shadow-lg mt-2 p-2 rounded-md">
                  <DropdownMenuItem
                    onClick={() => console.log("Share", reading.id)}
                    className="flex items-center gap-2 hover:bg-purple-100/10 text-sm"
                  >
                    <Share2 size={14} /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Download", reading.id)}
                    className="flex items-center gap-2 hover:bg-purple-100/10 text-sm"
                  >
                    <Download size={14} /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Delete", reading.id)}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-100/10 text-sm"
                  >
                    <Trash size={14} /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal for reading detail */}
      <Dialog open={!!selectedReading} onOpenChange={() => setSelectedReading(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-border bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white font-serif">
              Reading from{" "}
              {selectedReading && new Date(selectedReading.created_at).toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>

          {selectedReading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-white">Interpretation</h3>
                <p className="italic text-muted-foreground">
                  {selectedReading.question || "No question provided."}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {selectedReading.interpretation}
                </p>
              </div>

              {parsedCards.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-white">Drawn Cards</h3>
                  <div className="grid grid-cols-3 gap-6 justify-center items-start">
                    {parsedCards.map((entry: any, index: number) => (
                      <div
                        key={index}
                        className={`max-w-[180px] mx-auto transform ${
                          entry.orientation === "reversed" ? "rotate-180" : ""
                        }`}
                      >
                        <TarotCardComponent
                          card={entry.card}
                          isRevealed={true}
                          className="w-full h-auto"
                        />
                        <p className="text-center text-xs text-muted-foreground mt-2 italic">
                          {entry.orientation === "reversed" ? "Reversed" : "Upright"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}