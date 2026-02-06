import { useState } from "react";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const mockPincodeData: Record<string, { state: string; district: string; villages: string[] }> = {
  "411001": {
    state: "Maharashtra",
    district: "Pune",
    villages: ["Shivajinagar", "Kasba Peth", "Budhwar Peth"],
  },
  "560001": {
    state: "Karnataka",
    district: "Bangalore",
    villages: ["Chickpet", "Cottonpet", "Sultanpet"],
  },
  "600001": {
    state: "Tamil Nadu",
    district: "Chennai",
    villages: ["George Town", "Parrys Corner", "High Court"],
  },
};

export function VillageFinderSection() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<typeof mockPincodeData["411001"] | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    setSelectedVillage(null);
    
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    const data = mockPincodeData[pincode];
    if (data) {
      setResult(data);
    } else {
      setResult(null);
      setError("No villages found for this pincode. Try 411001, 560001, or 600001 for demo.");
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="village-container">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              <span>Village Discovery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Find Your Village
            </h2>
            <p className="text-muted-foreground text-lg">
              Enter your pincode to discover villages and start contributing 
              to their cultural preservation.
            </p>
          </div>

          {/* Search Box */}
          <div className="village-card">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-12 text-base"
                />
              </div>
              <Button variant="hero" size="lg" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-destructive text-sm mt-4">{error}</p>
            )}

            {/* Results */}
            {result && (
              <div className="mt-6 pt-6 border-t border-border animate-fade-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{result.district}</p>
                    <p className="text-sm text-muted-foreground">{result.state}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Select your village:
                  </p>
                  {result.villages.map((village) => (
                    <button
                      key={village}
                      onClick={() => setSelectedVillage(village)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        selectedVillage === village
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-medium text-foreground">{village}</span>
                      <ChevronRight className={`w-5 h-5 transition-colors ${
                        selectedVillage === village ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </button>
                  ))}
                </div>

                {selectedVillage && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 animate-scale-in">
                    <p className="text-sm text-muted-foreground mb-3">
                      Ready to explore <span className="font-medium text-primary">{selectedVillage}</span>?
                    </p>
                    <Button variant="hero" size="default" className="w-full">
                      Enter Village
                    </Button>
                  </div>
                )}

                <button className="w-full mt-4 text-sm text-primary hover:underline">
                  Don't see your village? Request to add it
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
