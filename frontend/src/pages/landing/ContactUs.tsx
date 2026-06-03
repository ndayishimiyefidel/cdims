import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Church, HelpCircle, User, ArrowRight, Users,
  FileText,
  CheckCircle
} from "lucide-react";
import HeaderBanner from "../../components/landing/HeaderBanner";

// --- Types ---
interface FormData {
  name: string;
  email: string;
  phone: string;
  parish: string;
  inquiryType: string;
  message: string;
}

interface ContactMethod {
  icon: JSX.Element;
  title: string;
  description: string;
  info: string[];
  action: string;
  availability: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    parish: '',
    inquiryType: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setFormSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        parish: '',
        inquiryType: '',
        message: ''
      });
    }, 3000);
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Diocese Office",
      description: "Speak directly with the diocese administration",
      info: ["+250 788 301 000", "+250 788 301 001"],
      action: "Call Diocese",
      availability: "Mon-Fri 8AM-5PM"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Send us your inquiries anytime",
      info: ["info@cyangugudims.rw", "support@cyangugudims.rw"],
      action: "Send Email",
      availability: "Response within 24 hours"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Technical Support",
      description: "Get help with system access or issues",
      info: ["IT Support Desk", "Online Help Center"],
      action: "Get Support",
      availability: "During Office Hours"
    }
  ];

  const inquiryTypes = [
    "System Access Issue",
    "User Account Request",
    "Training Request",
    "Technical Support",
    "Material/Stock Inquiry",
    "Procurement Question",
    "Report Request",
    "General Inquiry",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-15"></div>
      </div>
      
      <HeaderBanner
        title="Contact CDIMS"
        subtitle="Home / Contact Us"
        backgroundStyle="image"
        icon={<Church className="w-10 h-10" />}
      />

  <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative py-5">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-primary-500 to-gray-800 bg-clip-text text-transparent mb-6">
            Contact the Diocese of Cyangugu
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Need help with CDIMS? Have questions about infrastructure management, material requests, 
            or system access? Our team is here to support the parishes and institutions of the 
            Catholic Diocese of Cyangugu.
          </p>
          
          {/* Quick contact badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center bg-primary-50 text-primary-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <Phone size={16} className="mr-2" />
              <span className="font-medium">+250 788 301 000</span>
            </div>
            <div className="flex items-center bg-primary-50 text-primary-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <Mail size={16} className="mr-2" />
              <span className="font-medium">info@cyangugudims.rw</span>
            </div>
            <div className="flex items-center bg-primary-50 text-primary-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <Clock size={16} className="mr-2" />
              <span className="font-medium">Mon-Fri 8AM-5PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How to Reach Us</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple ways to get in touch with the diocese administration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="group bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-100 hover:border-primary-300 hover:-translate-y-2">
                <div className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h4>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <div className="space-y-2 mb-6">
                  {method.info.map((info, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">{info}</p>
                  ))}
                </div>
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                    <Clock className="w-4 h-4 mr-2" />
                    {method.availability}
                  </span>
                </div>
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 group-hover:bg-primary-700">
                  <span>{method.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Diocese Info */}
      <section className="py-20">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-gray-600 mb-8">Fill out the form and we'll get back to you within 24 hours</p>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">Thank you for contacting us. We'll respond soon.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="+250 788 301 000"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <Church className="w-4 h-4 inline mr-2" />
                        Parish / Institution
                      </label>
                      <input
                        type="text"
                        name="parish"
                        value={formData.parish}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your parish or institution"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <HelpCircle className="w-4 h-4 inline mr-2" />
                      Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Tell us about your inquiry..."
                    ></textarea>
                  </div>

                  <div
                    onClick={handleSubmit}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 text-lg shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </div>
                </div>
              )}
            </div>

            {/* Diocese Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Diocese of Cyangugu</h3>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-xl font-bold text-primary-700 mb-3">Diocese Administration Office</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                      <div>
                        <p className="text-gray-700 font-medium">Diocese of Cyangugu</p>
                        <p className="text-gray-600">Cyangugu, Rusizi District</p>
                        <p className="text-gray-600">Western Province, Rwanda</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary-500" />
                      <p className="text-gray-700">+250 788 301 000</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-500" />
                      <p className="text-gray-700">info@cyangugudims.rw</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary-500" />
                      <p className="text-gray-700">Mon - Fri: 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Services Available:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">System Access</span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">User Training</span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Technical Support</span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Account Management</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}