import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="relative min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/404.png')",
      }}
    >
      {/* Optional dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative text-center z-10 text-white">
        <h2 className="text-3xl font-bold">
          OOPS!
        </h2>

        <h3 className="text-3xl font-bold mb-4">
          PAGE NOT FOUND
        </h3>

        <h1 className="text-[120px] font-extrabold drop-shadow-lg">
          404
        </h1>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-600 transition duration-300"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
