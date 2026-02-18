import { FC, useState, ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: FC = () => {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Form Submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-muted-foreground mt-4">
            We'd love to hear your feedback or collaboration ideas.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-10 shadow-lg space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-muted outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg bg-muted outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-muted outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="message"
            placeholder="Your Message *"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-muted outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Send Message
          </button>

          {submitted && (
            <p className="text-green-500 text-sm text-center">
              Message submitted successfully!
            </p>
          )}
        </form>

        {/* Contact Info */}
        <div className="mt-12 text-center space-y-3 text-muted-foreground">
          <div className="flex justify-center items-center gap-2">
            <Mail className="w-4 h-4" />
            singhabirai0609@gmail.com
          </div>
          <div className="flex justify-center items-center gap-2">
            <Phone className="w-4 h-4" />
            +91 8825019012
          </div>
          <div className="flex justify-center items-center gap-2">
            <MapPin className="w-4 h-4" />
            Jammu, India
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
