const BASE_URL = "http://localhost:4000";

export async function fetchPincode(code: string) {
  const res = await fetch(`${BASE_URL}/api/pincodes/${code}`);
  if (!res.ok) {
    throw new Error("Pincode not found");
  }
  return res.json();
}

export async function fetchStoriesByVillage(villageId: string) {
  const res = await fetch(
    `${BASE_URL}/api/stories/village/${villageId}`
  );
  if (!res.ok) {
    throw new Error("Failed to load stories");
  }
  return res.json();
}
