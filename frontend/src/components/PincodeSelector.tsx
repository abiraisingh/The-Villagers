import { useState } from "react";
import { fetchPincode } from "@/lib/api";
import { Village } from "@/types";

interface Props {
  onVillageSelect: (village: Village) => void;
}

export default function PincodeSelector({ onVillageSelect }: Props) {
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [error, setError] = useState("");

  async function handleSearch() {
    setError("");
    try {
      const data = await fetchPincode(pincode);
      setVillages(data.villages);
    } catch {
      setError("Invalid pincode or no villages found");
    }
  }

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Enter pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2"
      >
        Find Villages
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {villages.map((v) => (
          <li
            key={v.id}
            className="border p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onVillageSelect(v)}
          >
            {v.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
