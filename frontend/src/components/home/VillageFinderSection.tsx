import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PostOffice = {
  Name: string;
  District: string;
  State: string;
};

export function VillageFinderSection() {
  const [pincode, setPincode] = useState("");
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setSelectedVillage("");
    setPostOffices([]);

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const offices = data[0].PostOffice;

        setPostOffices(offices);
        setDistrict(offices[0].District);
        setStateName(offices[0].State);
      } else {
        setError("No villages found for this pincode.");
      }
    } catch (err) {
      setError("Failed to fetch data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="village-container">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              <span>Village Discovery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Find Your Village
            </h2>

            <p className="text-muted-foreground text-lg">
              Enter your pincode to discover villages.
            </p>
          </div>

          {/* Search Card */}
          <div className="village-card">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-12 text-base"
                />
              </div>

              <Button variant="hero" size="lg" onClick={handleSearch}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {error && (
              <p className="text-destructive text-sm mt-4">{error}</p>
            )}

            {/* Results */}
            {postOffices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border animate-fade-up">

                {/* District + State */}
                <div className="mb-6">
                  <p className="font-medium text-foreground">{district}</p>
                  <p className="text-sm text-muted-foreground">{stateName}</p>
                </div>

                {/* Dropdown */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Select your village:
                  </label>

                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Choose a Village --</option>
                    {postOffices.map((office) => (
                      <option key={office.Name} value={office.Name}>
                        {office.Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enter Button */}
                {selectedVillage && (
                  <div className="mt-6">
                    <Button
                      variant="hero"
                      className="w-full"
                    >
                      Enter {selectedVillage}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
