import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import rajmachawal from "@/assets/rajmachawal.jpg";
import ghevar from "@/assets/Ghevar.webp";
import bamboo from "@/assets/bamboo.webp";
import idli from "@/assets/idli.jpg";
import samosa from "@/assets/samosa.jpg";
import ragi from "@/assets/ragi.jpg";
/* ---------------- TYPES ---------------- */

type Village = {
  id: string;
  name: string;
};

type Food = {
  id: string;
  name: string;
  description?: string;
  ingredients?: string;
  imageUrl?: string;
  village: string;
  pincode: string;
  isDemo?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- MOCK DATA ---------------- */
/* Add your local images inside public/images */
const MOCK_FOODS: Food[] = [
  {
    id: "demo-1",
    name: "Rajma Chawal",
    description: "Rajma Rice (Rajma Chawal) is a beloved North Indian comfort food consisting of slow-cooked red kidney beans in a thick, spiced onion-tomato gravy, served over steaming, fragrant Basmati rice. It is a hearty, protein-rich, and filling vegetarian dish, commonly accompanied by yogurt, raw onions, or pickles. ",
    ingredients: "Kidney beans, rice, spices",
    imageUrl: rajmachawal,
    village: "Jammu",
    pincode: "180001",
    isDemo: true
  },
  {
    id: "demo-2",
    name: "Ghevar",
    description: "Ghevar is a traditional Indian sweet made from flour, ghee, and sugar. It is a popular dessert in Rajasthan and is often served during festivals.",
    ingredients: "Flour, ghee, sugar",
    imageUrl: ghevar,
    village: "Jodhpur",
    pincode: "342001",
    isDemo: true
  },
   {
    id: "demo-3",
    name: "Samosa",
    description: "Samosa is a popular Indian snack made from fried or baked pastry filled with spiced potatoes, peas, and other ingredients.",
    ingredients: "Flour, ghee, potatoes, peas",
    imageUrl: samosa,
    village: "Punjab",
    pincode: "160001",
    isDemo: true
  },
   {
    id: "demo-4",
    name: "Idli",
    description: "Idli is a popular South Indian breakfast dish made from fermented rice and lentil batter, steamed in special molds.",
    ingredients: "Rice, lentils, salt",
    imageUrl: idli,
    village: "Chennai",
    pincode: "600001",
    isDemo: true
  },
   {
    id: "demo-5",
    name: "Bamboo Shoots",
    description: "Bamboo shoots are the young stems of bamboo plants, commonly used in South Indian and Southeast Asian cuisines. They are crisp, slightly sweet, and have a mild flavor.",
    ingredients: "Bamboo shoots, spices",
    imageUrl: bamboo,
    village: "Nagaland",
    pincode: "797001",
    isDemo: true
  },
   {
    id: "demo-6",
    name: "Ragi Mudde",
    description: "Ragi Mudde is a traditional South Indian dish made from ragi (finger millet) flour, water, and salt. It is a popular staple food in Karnataka and Tamil Nadu.",
    ingredients: "Ragi flour, water, salt",
    imageUrl: ragi,
    village: "Karnataka",
    pincode: "560001",
    isDemo: true
  }
];

export default function FoodPage() {
  const [foods, setFoods] = useState<Food[]>(MOCK_FOODS);
  const [showForm, setShowForm] = useState(false);

  /* FORM STATE */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [pincode, setPincode] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [village, setVillage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingVillage, setLoadingVillage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- PINCODE → VILLAGES ---------------- */
  useEffect(() => {
    if (pincode.length !== 6) {
      setVillages([]);
      setVillage("");
      return;
    }

    const t = setTimeout(async () => {
      setLoadingVillage(true);
      try {
        const res = await fetch(`${API_URL}/api/pincodes/${pincode}`);
        if (!res.ok) return;

        const data = await res.json();

        if (Array.isArray(data.villages)) {
          setVillages(data.villages);
          if (data.villages.length === 1) {
            setVillage(data.villages[0].name);
          }
        }
      } finally {
        setLoadingVillage(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [pincode]);

  /* ---------------- RESTORED BACKEND LOAD ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/foods`);
        if (!res.ok) return;

        const backendFoods = await res.json();

        // Merge backend foods ABOVE demo foods
        if (Array.isArray(backendFoods)) {
          setFoods(prev => [
            ...backendFoods.map((f: Food) => ({
              ...f,
              isDemo: false
            })),
            ...prev
          ]);
        }
      } catch (err) {
        console.log("Backend fetch failed");
      }
    })();
  }, []);

  /* ---------------- UPLOAD ---------------- */
  async function uploadFood() {
    if (!name || !pincode || !village) return;

    setSubmitting(true);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("ingredients", ingredients);
    fd.append("pincode", pincode);
    fd.append("villageName", village);
    if (file) fd.append("image", file);

    const res = await fetch(`${API_URL}/api/foods`, {
      method: "POST",
      body: fd
    });

    if (!res.ok) {
      alert("Upload failed");
      setSubmitting(false);
      return;
    }

    const newFood = await res.json();

    setFoods(prev => [
      { ...newFood, isDemo: false },
      ...prev
    ]);

    setShowForm(false);
    setName("");
    setDescription("");
    setIngredients("");
    setPincode("");
    setVillage("");
    setVillages([]);
    setFile(null);
    setSubmitting(false);
  }

  return (
    <Layout>
      <section className="py-12 border-b">
        <div className="village-container flex justify-between">
          <h1 className="font-serif text-3xl">Village Foods</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Add Food
          </Button>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12">
        <div className="village-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map(food => (
            <div key={food.id} className="border rounded-xl overflow-hidden relative">
              
              {food.imageUrl && (
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Demo Tag ONLY for mock */}
              {food.isDemo && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full shadow">
                  Demo
                </div>
              )}

              <div className="p-4">
                <h3 className="font-serif text-lg">{food.name}</h3>

                {food.description && (
                  <p className="text-sm text-muted-foreground">
                    {food.description}
                  </p>
                )}

                {food.ingredients && (
                  <p className="text-sm mt-1">
                    <strong>Ingredients:</strong> {food.ingredients}
                  </p>
                )}

                <p className="text-sm flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  {food.village} ({food.pincode})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative space-y-3">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <input
              className="border p-3 rounded w-full"
              placeholder="Food name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <textarea
              className="border p-3 rounded w-full"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <textarea
              className="border p-3 rounded w-full"
              placeholder="Ingredients (optional)"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
            />

            <input
              className="border p-3 rounded w-full"
              placeholder="Pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
            />

            {loadingVillage && <p className="text-sm">Detecting villages…</p>}

            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <Button
              className="w-full"
              onClick={uploadFood}
              disabled={submitting || !village}
            >
              {submitting ? "Uploading…" : "Add Food"}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
