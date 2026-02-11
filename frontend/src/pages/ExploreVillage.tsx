import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Village = {
  id: string;
  name: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function ExploreVillage() {
  const navigate = useNavigate();

  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    setError(null);
    setVillages([]);
    setSelectedVillage("");

    try {
      const res = await fetch(
        `${API_URL}/api/pincodes/${pincode}`
      );

      if (!res.ok) {
        throw new Error("Pincode not found");
      }

      const data = await res.json();
      const list: Village[] = data.villages || [];

      if (list.length === 0) {
        setError("No villages found for this pincode");
        return;
      }

      if (list.length === 1) {
        navigate(`/village/${list[0].id}`);
      } else {
        setVillages(list);
      }
    } catch {
      setError("Failed to fetch villages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full space-y-5">
          <h1 className="font-serif text-2xl text-center">
            Explore a Village
          </h1>

          <input
            className="border p-3 rounded-xl w-full"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Finding..." : "Find Village"}
          </Button>

          {villages.length > 1 && (
            <>
              <select
                className="border p-3 rounded-xl w-full"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
              >
                <option value="">Select village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              {selectedVillage && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/village/${selectedVillage}`)}
                >
                  Explore Village
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
