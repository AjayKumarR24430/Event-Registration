import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaLightbulb, FaShieldAlt, FaUsersCog, FaRegCreditCard, FaCalendarCheck, FaEnvelope, FaComments, FaPhoneAlt, FaCheck } from 'react-icons/fa';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState({});
  
  const faqCategories = [
    { id: 'general', name: 'General', icon: FaLightbulb },
    { id: 'account', name: 'Account & Security', icon: FaShieldAlt },
    { id: 'events', name: 'Events', icon: FaCalendarCheck },
    { id: 'registration', name: 'Registration', icon: FaUsersCog },
    { id: 'payment', name: 'Payment', icon: FaRegCreditCard },
  ];
  
  const faqData = {
    general: [
      {
        question: 'What is Event Registration Platform?',
        answer: 'Our Event Registration Platform is a comprehensive solution designed to help event organizers create, manage, and promote events of all types and sizes. Attendees can browse events, register, and manage their bookings through our user-friendly interface.'
      },
      {
        question: 'How do I contact customer support?',
        answer: 'You can reach our customer support team by emailing support@eventplatform.com, calling our toll-free number at 1-800-EVENT-HELP, or using the live chat feature in the bottom right corner of the screen. Our support hours are Monday through Friday, 9 AM to 6 PM EST.'
      },
      {
        question: 'Is your platform accessible on mobile devices?',
        answer: 'Yes, our platform is fully responsive and works on mobile phones, tablets, and desktop computers. We have dedicated mobile apps available for iOS and Android devices as well, providing a seamless experience across all your devices.'
      },
      {
        question: 'What types of events can be hosted on your platform?',
        answer: `Our platform supports a wide range of events including conferences, workshops, seminars, networking events, health and wellness sessions, virtual events, hybrid events, and more. Whether you're planning a small workshop or a large-scale conference, our platform has the features to support your needs.`
      }
    ],
    account: [
      {
        question: 'How do I create an account?',
        answer: `To create an account, click on the "Sign Up" button in the top right corner of the page. You can register using your email address, or sign up with your Google or Facebook account for faster access. Once you've submitted your information, you'll receive a verification email to activate your account.`
      },
      {
        question: 'How can I reset my password?',
        answer: `If you've forgotten your password, click on the "Login" button, then select "Forgot Password". Enter the email address associated with your account, and we'll send you a password reset link. For security reasons, this link will expire after 24 hours.`
      },
      {
        question: 'Is my personal information secure?',
        answer: `Yes, we take data security very seriously. All personal information is encrypted both in transit and at rest. We use industry-standard security protocols and regularly audit our systems to ensure compliance with data protection regulations. We never share your personal information with third parties without your explicit consent.`
      },
      {
        question: 'Can I have multiple user accounts?',
        answer: `We recommend maintaining a single user account per individual to ensure a consistent experience. However, if you need to manage events for different organizations, you can create organization profiles within your single account and switch between them easily.`
      }
    ],
    events: [
      {
        question: 'How do I find events near me?',
        answer: `On the "Events" page, you can use the search filters to find events by location, date, category, and more. You can also enable location services to automatically show events in your area. For the best experience, create an account and set your preferences to receive personalized event recommendations.`
      },
      {
        question: 'Are there virtual events available?',
        answer: `Yes, our platform supports both in-person and virtual events. You can filter for virtual events specifically in the search interface. Virtual events will provide access instructions after registration, typically including a link to the virtual event platform and any necessary access codes.`
      },
      {
        question: 'Can I save events to attend later?',
        answer: `Yes, if you're logged in, you can bookmark any event by clicking the "Save" button on the event card or page. You can view all your saved events in your user dashboard under "Saved Events". We'll also send you optional reminders as the event date approaches.`
      },
      {
        question: 'How can I share an event with friends?',
        answer: `Each event page includes social sharing buttons that allow you to share via Facebook, Twitter, LinkedIn, WhatsApp, or email. You can also copy a direct link to the event to share through any channel you prefer. Some events offer special referral incentives when you successfully invite friends.`
      }
    ],
    registration: [
      {
        question: 'How do I register for an event?',
        answer: `To register for an event, navigate to the event page and click the "Register" button. You'll need to provide any required information and complete the payment process if it's a paid event. Once registered, you'll receive a confirmation email with your ticket and event details.`
      },
      {
        question: 'Can I register multiple people at once?',
        answer: `Yes, most events allow group registrations. During the registration process, you'll see an option to "Add attendee" where you can input information for additional participants. Group discounts may apply automatically based on the number of registrations.`
      },
      {
        question: 'How do I view my registrations?',
        answer: `All your event registrations are available in your user dashboard under "My Registrations". There, you can view event details, download tickets, add events to your calendar, and manage your registrations including cancellations where permitted.`
      },
      {
        question: 'What is the registration approval process?',
        answer: `For most public events, registration is instant upon completion. However, some events require approval from the organizer. If you've registered for an event that requires approval, your registration status will be "Pending" until the organizer approves it. You'll receive an email notification once your registration is approved or if additional information is required.`
      }
    ],
    payment: [
      {
        question: 'What payment methods do you accept?',
        answer: `We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and in some regions, we support local payment methods like bank transfers. For organizations, we also offer invoice-based payments with net-30 terms upon approval.`
      },
      {
        question: 'Is my payment information secure?',
        answer: `Absolutely. We do not store your credit card information on our servers. All payment processing is handled by PCI-DSS compliant payment processors. Your payment data is encrypted end-to-end and processed using secure HTTPS connections.`
      },
      {
        question: 'Can I get a refund if I can not attend?',
        answer: `Refund policies are set by individual event organizers and can vary by event. The refund policy is always displayed during the registration process and in your confirmation email. If allowed, you can request refunds from your user dashboard under "My Registrations". Some events may offer transfers or credits instead of refunds.`
      },
      {
        question: 'Are there any additional fees when registering?',
        answer: `Depending on the event and payment method, there may be service fees or taxes applied to your registration. These fees are always displayed transparently before you complete your purchase. Some event organizers choose to absorb these fees, in which case you'll only pay the advertised ticket price.`
      }
    ]
  };
  
  const handleToggleQuestion = (categoryId, index) => {
    setOpenQuestions(prev => {
      const key = `${categoryId}-${index}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };
  
  const isQuestionOpen = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    return !!openQuestions[key];
  };
  
  const filteredFAQs = searchQuery
    ? Object.entries(faqData).flatMap(([categoryId, questions]) => 
        questions
          .filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(item => ({ ...item, categoryId }))
      )
    : faqData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/622fbc5a718ac3417fcd3d75/62328c3aef177acc681d309f_noise.png')] opacity-50"></div>
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fadeIn text-white shadow-lg shadow-black/30" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Frequently Asked Questions</h1>
            <p className="text-xl text-white mb-8 animate-slideUp">
              Find answers to common questions about our event platform
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-indigo-300" />
              </div>
              <input
                type="text"
                placeholder="Search for questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          {!searchQuery && (
            <div className="mb-12 animate-fadeIn">
              <div className="flex flex-wrap justify-center gap-4">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <category.icon className={`w-5 h-5 ${activeCategory === category.id ? 'animate-scaleIn' : ''}`} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            {searchQuery && filteredFAQs.length === 0 ? (
              <div className="text-center py-12 animate-fadeIn">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FaSearch className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn't find any questions matching "{searchQuery}"
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {searchQuery ? (
                  filteredFAQs.map((item, index) => {
                    const CategoryIcon = faqCategories.find(c => c.id === item.categoryId)?.icon || FaLightbulb;
                    const isOpen = isQuestionOpen(item.categoryId, index);
                    
                    return (
                      <div 
                        key={`search-${index}`}
                        className={`card hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 overflow-hidden animate-slideUp`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 pr-8">
                                {item.question}
                              </h3>
                              <button
                                onClick={() => handleToggleQuestion(item.categoryId, index)}
                                className={`p-1 rounded-full transition-colors duration-300 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex-shrink-0`}
                              >
                                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {item.answer}
                              </p>
                              <div className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                Category: {faqCategories.find(c => c.id === item.categoryId)?.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  faqData[activeCategory].map((item, index) => {
                    const isOpen = isQuestionOpen(activeCategory, index);
                    
                    return (
                      <div 
                        key={`${activeCategory}-${index}`}
                        className={`card hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 overflow-hidden animate-slideUp`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <button
                          onClick={() => handleToggleQuestion(activeCategory, index)}
                          className="w-full text-left flex justify-between items-center"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.question}
                          </h3>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ${isOpen ? 'rotate-180' : ''}`}>
                            <FaChevronDown className="w-3 h-3" />
                          </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Still Have Questions Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Still Have <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
              If you couldn't find the answer to your question, our support team is here to help you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card hover-lift">
                <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a href="mailto:support@eventplatform.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
                  support@eventplatform.com
                </a>
              </div>
              
              <div className="card hover-lift">
                <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-green-600 to-teal-600 text-white flex items-center justify-center mx-auto">
                  <FaComments className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Chat with our support agents in real-time during business hours.
                </p>
                <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
                  Start Chat
                </button>
              </div>
              
              <div className="card hover-lift">
                <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-center mx-auto">
                  <FaPhoneAlt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Give us a call if you need immediate assistance.
                </p>
                <a href="tel:+18001234567" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300">
                  +1 800 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/622fbc5a718ac3417fcd3d75/62328c3aef177acc681d309f_noise.png')] opacity-50"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Create Your Event?</h2>
            <p className="text-xl text-white mb-10">
              Join thousands of event organizers who trust our platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-100/30">
                Create an Event
              </button>
              <button className="btn btn-outline border-white text-white hover:bg-white/10">
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 