import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stories from "./pages/Stories";
import Photos from "./pages/Photos";
import Food from "./pages/Food";
import AddFood from "./pages/AddFood";
import Specialties from "./pages/Specialties";
import NotFound from "./pages/NotFound";
import { Header } from "./components/layout/Header";
import AddSpecialty from "./pages/AddSpecialty";
import VillageDetails from "./pages/VillageDetails";
import ExploreVillage from "./pages/ExploreVillage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Guidelines from "./pages/Guidelines";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/food" element={<Food />} />
          <Route path="/food/add" element={<AddFood />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/specialties/add" element={<AddSpecialty />} />
          <Route path="/explore" element={<ExploreVillage />} />
          <Route path="/village/:pincode" element={<VillageDetails />} />

           <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;