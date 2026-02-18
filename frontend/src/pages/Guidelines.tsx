import { ShieldCheck, HeartHandshake, FileText, AlertTriangle } from "lucide-react";
import { FC } from "react";

interface Guideline {
  title: string;
  description: string;
  icon: React.ElementType;
}

const guidelines: Guideline[] = [
  {
    title: "Respect Cultural Diversity",
    description:
      "The Villagers celebrates traditions across India. Be respectful toward all communities, languages, religions, and cultural practices.",
    icon: ShieldCheck,
  },
  {
    title: "Authentic & Original Content",
    description:
      "Share genuine village stories, traditions, and recipes. Avoid misinformation or copied material from external sources.",
    icon: FileText,
  },
  {
    title: "No Hate or Offensive Content",
    description:
      "Harassment, hate speech, discrimination, or abusive language will result in content removal or account restrictions.",
    icon: AlertTriangle,
  },
  {
    title: "Constructive Community Engagement",
    description:
      "Encourage healthy discussion. Criticism should be respectful and aimed at improvement.",
    icon: HeartHandshake,
  },
];

const Guidelines: FC = () => {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Community Guidelines
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            These guidelines ensure that The Villagers remains a respectful,
            authentic, and inclusive platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {guidelines.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Guidelines;
