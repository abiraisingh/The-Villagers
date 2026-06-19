import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BASE_URL as API_URL } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (!res.ok) {
        const message = data?.error || `Login failed (${res.status})`;
        throw new Error(message);
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user?.email || email);
      localStorage.setItem("userId", data.user?.id || "");
      if (data.user?.avatarUrl) localStorage.setItem('userAvatar', data.user.avatarUrl);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="village-container max-w-md mx-auto py-32">
        <h1 className="font-serif text-3xl mb-4">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
          {error && <p className="text-red-500">{error}</p>}
          <input className="w-full border p-3 rounded" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full border p-3 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </div>
    </Layout>
  );
}
