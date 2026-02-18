import { FC } from "react";
import { Github, Mail, Phone, MapPin, Globe } from "lucide-react";
import profile from "../assets/profile.jpg";

const About: FC = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden py-24">

      {/* ================= Floating Gradient Particles ================= */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-floatSlow opacity-40" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-[140px] animate-floatMedium opacity-40" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-pink-500/20 rounded-full blur-[110px] animate-floatSlow opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* ================= Header ================= */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            About the Developer
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-16">

          {/* ================= Glass Profile Card ================= */}
          <div className="relative group">

            <div className="relative w-72 h-80 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">

              {/* Light Sweep Animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-12 group-hover:animate-lightSweep" />
              </div>

              {/* Subtle Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

              <img
                src={profile}
                alt="Abirai Singh"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Bengaluru, India – 560067
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 88250 19012
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                singhabirai75@gmail.com
              </div>
            </div>
          </div>

          {/* ================= Main Content ================= */}
          <div className="flex-1 space-y-10">

            {/* Summary */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Abirai Singh – Full Stack Developer (MERN)
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Full-stack developer specializing in the MERN stack.
                Experienced in building production-ready front-end
                applications using React, TypeScript, and modern frameworks.
                Skilled in REST APIs, state management, authentication,
                and database integration. Strong focus on clean UI,
                performance optimization, and modular, reusable code.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Technical Skills</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "React",
                  "TypeScript",
                  "JavaScript",
                  "HTML5",
                  "CSS3",
                  "Bootstrap",
                  "Vite",
                  "React Router",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "Mongoose",
                  "Git",
                  "Postman"
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-semibold mb-3">Education</h3>
              <p className="text-muted-foreground text-sm">
                <strong>B.E. Computer Science & Engineering</strong><br />
                MVJ College of Engineering (2022–2026) – CGPA: 8.40/10
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Higher Secondary Education (Science) – 93%
              </p>
            </div>

            {/* Certification */}
            <div>
              <h3 className="font-semibold mb-3">Certifications</h3>
              <p className="text-muted-foreground text-sm">
                Full Stack Web Development (MERN) – Udemy (2025)
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/abiraisingh"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>

              <a
                href="http://abirai-portfolio.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
              >
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
