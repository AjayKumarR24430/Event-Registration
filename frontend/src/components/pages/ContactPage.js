import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane,
  FaCheck
} from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
          <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Bottom Wave - Now positioned higher to cover content */}
        <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full h-full absolute bottom-0"
            preserveAspectRatio="none"
            style={{ minHeight: '320px' }}
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,256L40,240C80,224,160,192,240,186.7C320,181,400,203,480,192C560,181,640,139,720,149.3C800,160,880,224,960,229.3C1040,235,1120,181,1200,144C1280,107,1360,85,1400,74.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6">
              Get In Touch
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              Contact Us
            </h1>
            
            <p className="text-xl text-indigo-100 animate-slideUp max-w-2xl mx-auto">
              We'd love to hear from you. Reach out for any questions, feedback, or support needs
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8 animate-slideUp">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Get in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-8">
                  Have a question about our platform, or want to learn more about how we can help you organize successful events? Reach out to us using any of the contact methods below, or fill out the form and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Visit Us</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      123 Event Avenue, Suite 200<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                    <FaPhoneAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Call Us</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      +1 (555) 123-4567<br />
                      Mon-Fri, 9AM-6PM PST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      info@eventplatform.com<br />
                      support@eventplatform.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300">
                    <FaFacebook className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300">
                    <FaTwitter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors duration-300">
                    <FaInstagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300">
                    <FaLinkedin className="w-5 h-5 text-blue-800 dark:text-blue-500" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900/30 shadow-xl transform hover:scale-[1.01] transition-all duration-500 animate-slideUp">
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy rounded-2xl"></div>
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
                
                {submitSuccess ? (
                  <div className="py-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <FaCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Thank You!</h4>
                    <p className="text-gray-700 dark:text-gray-300">Your message has been sent successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="form-control"
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="form-control resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    {submitError && (
                      <div className="alert alert-danger">
                        {submitError}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary group relative overflow-hidden"
                        disabled={isSubmitting}
                      >
                        <span className="relative z-10 flex items-center">
                          {isSubmitting ? 'Sending...' : 'Send Message'} 
                          <FaPaperPlane className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1134346646177!2d-122.41947688439044!3d37.77492657975922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580a683a3ce15%3A0x36384c5e1f3851dd!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1649790839784!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 