import { useState, type ChangeEvent, type FormEvent } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Church, ArrowRight, CheckCircle, Loader2
} from "lucide-react";
import HeaderBanner from "../../components/landing/HeaderBanner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  parish: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", phone: "", parish: "", inquiryType: "", message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", parish: "", inquiryType: "", message: "" });
    }, 4000);
  };

  const contactMethods = [
    { icon: <Phone className="w-7 h-7" />, title: "Diocese Office", info: ["+250 788 301 000", "+250 788 301 001"], avail: "Mon-Fri 8AM-5PM", color: "from-primary-400 to-primary-600" },
    { icon: <Mail className="w-7 h-7" />, title: "Email Support", info: ["info@cyangugudims.rw", "support@cyangugudims.rw"], avail: "Response within 24h", color: "from-green-400 to-emerald-600" },
    { icon: <MessageCircle className="w-7 h-7" />, title: "Technical Support", info: ["IT Support Desk", "Online Help Center"], avail: "During Office Hours", color: "from-purple-400 to-purple-600" }
  ];

  const inquiryTypes = ["System Access Issue", "User Account Request", "Training Request", "Technical Support", "Material/Stock Inquiry", "Procurement Question", "Report Request", "General Inquiry", "Other"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-white">
      <HeaderBanner title="Contact CDIMS" subtitle="Home / Contact Us" backgroundStyle="image" icon={<Church className="w-10 h-10" />} />
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-5 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200/50">
              <MessageCircle size={14} /><span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Let's Start a <span className="gradient-text-primary">Conversation</span></h2>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8">Have questions about CDIMS? Our team is here to support the parishes and institutions of the Catholic Diocese of Cyangugu.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"><Phone size={14} />+250 788 301 000</span>
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"><Mail size={14} />info@cyangugudims.rw</span>
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"><Clock size={14} />Mon-Fri 8AM-5PM</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={"w-14 h-14 bg-gradient-to-br " + method.color + " rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300"}>
                  <div className="text-white">{method.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <div className="space-y-2 mb-5">{method.info.map((info, idx) => (<p key={idx} className="text-gray-600 text-sm">{info}</p>))}</div>
                <div className="mb-6"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full text-xs font-medium"><Clock size={12} />{method.avail}</span></div>
                <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  {method.title === "Diocese Office" ? "Call Diocese" : method.title === "Email Support" ? "Send Email" : "Get Support"}
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-500 mb-8">Fill out the form and we will get back to you within 24 hours</p>
                {formSubmitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-500">Thank you for contacting us. We will respond shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                          className={"w-full px-4 py-3 rounded-xl border text-sm transition-all " + (errors.name ? "border-red-300 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-primary-500") + " focus:outline-none focus:ring-4 focus:ring-primary-500/10"}
                          placeholder="Your full name" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                          className={"w-full px-4 py-3 rounded-xl border text-sm transition-all " + (errors.email ? "border-red-300 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-primary-500") + " focus:outline-none focus:ring-4 focus:ring-primary-500/10"}
                          placeholder="your@email.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="+250 788 301 000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Parish / Institution</label>
                        <input type="text" name="parish" value={formData.parish} onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="Your parish or institution" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Inquiry Type</label>
                      <select name="inquiryType" value={formData.inquiryType} onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all">
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type, i) => <option key={i} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5}
                        className={"w-full px-4 py-3 rounded-xl border text-sm transition-all resize-none " + (errors.message ? "border-red-300 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-primary-500") + " focus:outline-none focus:ring-4 focus:ring-primary-500/10"}
                        placeholder="Tell us about your inquiry..." />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSubmitting ? (<><Loader2 size={18} className="animate-spin" /> Sending...</>) : (<><Send size={18} /> Send Message</>)}
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center"><Church className="w-6 h-6" /></div>
                  <div><h3 className="text-xl font-bold">Diocese of Cyangugu</h3><p className="text-primary-200 text-sm">Administration Office</p></div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-3"><MapPin className="w-5 h-5 shrink-0 mt-0.5 text-primary-200" /><div className="text-sm"><p>Diocese of Cyangugu</p><p className="text-primary-200">Cyangugu, Rusizi District</p><p className="text-primary-200">Western Province, Rwanda</p></div></div>
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0 text-primary-200" /><p className="text-sm">+250 788 301 000</p></div>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 shrink-0 text-primary-200" /><p className="text-sm">info@cyangugudims.rw</p></div>
                  <div className="flex items-center gap-3"><Clock className="w-5 h-5 shrink-0 text-primary-200" /><p className="text-sm">Mon - Fri: 8:00 AM - 5:00 PM</p></div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-primary-200 mb-3">Services Available:</p>
                  <div className="flex flex-wrap gap-2">{["System Access", "User Training", "Technical Support", "Account Management"].map(s => <span key={s} className="px-3 py-1 bg-white/15 rounded-full text-xs">{s}</span>)}</div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl h-64 overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center">
                <div className="text-center"><MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Interactive Map</p><p className="text-xs text-gray-400 mt-1">Diocese of Cyangugu, Rwanda</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
