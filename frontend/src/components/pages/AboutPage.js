import React from 'react';
import { 
  FaUsers, FaHistory, FaMedal, FaBullseye, 
  FaHandshake, FaGlobe, FaLeaf, FaChartLine 
} from 'react-icons/fa';

const AboutPage = () => {
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
        
        <div className="container-custom relative z-20 pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6">
              Our Story
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              About EventHub
            </h1>
            
            <p className="text-xl text-indigo-100 animate-slideUp max-w-2xl mx-auto">
              We're on a mission to bring people together through amazing events and create unforgettable experiences
            </p>
          </div>
        </div>
        
        {/* Bottom Wave - Positioned better to avoid covering text */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full absolute bottom-0"
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,256L40,240C80,224,160,192,240,186.7C320,181,400,203,480,192C560,181,640,139,720,149.3C800,160,880,224,960,229.3C1040,235,1120,181,1200,144C1280,107,1360,85,1400,74.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Additional decorative wave at the bottom to ensure text visibility */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: "-1" }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full absolute bottom-0"
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="0.3" 
              d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,192C840,192,960,224,1080,213.3C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-slideUp">
              <div className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium text-sm">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Creating Memorable <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Experiences</span> Since 2018
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our journey began with a simple idea: to create a platform that makes it easy to discover, join, and host events that matter. Whether you're looking for professional networking, skill development, or just a fun night out, we've got you covered.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Over the years, we've helped thousands of people connect through events across multiple industries and interests. Our platform is now used by individuals and organizations worldwide to create meaningful connections and unforgettable experiences.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl animate-float card-3d">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">5000+</div>
                  <div className="text-gray-600 dark:text-gray-300">Events Hosted</div>
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 shadow-xl animate-float card-3d" style={{ animationDelay: '0.5s' }}>
                  <div className="text-3xl font-bold">25K+</div>
                  <div className="text-indigo-100">Happy Attendees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <div className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Guided by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Strong Principles</span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At our core, we believe in creating a platform that brings value to everyone involved. Our values shape how we build our product and interact with our community.
            </p>
          </div>
          
          {/* Values Grid - Fixed responsive layout to prevent overlapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: FaUsers, 
                title: 'Community First', 
                description: 'We prioritize creating meaningful connections between people.',
                color: 'from-indigo-600 to-indigo-400',
                delay: '0s'
              },
              { 
                icon: FaHandshake, 
                title: 'Accessibility', 
                description: 'Events on our platform are designed to be inclusive and accessible to all.',
                color: 'from-purple-600 to-purple-400',
                delay: '0.2s'
              },
              { 
                icon: FaGlobe, 
                title: 'Diversity', 
                description: 'We celebrate differences and ensure our platform represents various cultures.',
                color: 'from-pink-600 to-pink-400',
                delay: '0.4s'
              },
              { 
                icon: FaLeaf, 
                title: 'Sustainability', 
                description: 'We promote sustainable practices in all the events we help organize.',
                color: 'from-emerald-600 to-emerald-400',
                delay: '0.6s'
              }
            ].map((value, index) => (
              <div key={index} className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slideUp" style={{ animationDelay: value.delay }}>
                {/* Fixed the icon container class issue by adding backticks */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${value.color} text-white flex items-center justify-center mb-6`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section - Added proper spacing and fixed responsive layout */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
            <div className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Meet the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Talented People</span> Behind the Platform
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our diverse team of experts is dedicated to creating the best event experience platform. We combine technical expertise with a passion for bringing people together.
            </p>
          </div>
          
          {/* Team Grid - Fixed height and responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                name: 'Yuki Tanaka',
                role: 'CEO & Founder',
                image: 'https://api.dicebear.com/7.x/personas/svg?seed=Yuki&backgroundColor=b6e3f4',
                delay: '0s'
              },
              {
                name: 'Mei Chen',
                role: 'Chief Technology Officer',
                image: 'https://api.dicebear.com/7.x/personas/svg?seed=Mei&backgroundColor=ffdfbf',
                delay: '0.2s'
              },
              {
                name: 'Hiroshi Nakamura',
                role: 'Head of Operations',
                image: 'https://api.dicebear.com/7.x/personas/svg?seed=Hiroshi&backgroundColor=c0aede',
                delay: '0.4s'
              },
              {
                name: 'Sakura Yamamoto',
                role: 'Head of Marketing',
                image: 'https://api.dicebear.com/7.x/personas/svg?seed=Sakura&backgroundColor=d1d4f9',
                delay: '0.6s'
              }
            ].map((member, index) => (
              <div key={index} className="flip-card animate-slideUp h-96 mb-8" style={{ animationDelay: member.delay }}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="relative h-64 overflow-hidden rounded-t-2xl">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent opacity-70"></div>
                      </div>
                      <div className="p-4 flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-indigo-600 dark:text-indigo-400">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="h-full flex flex-col justify-center p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl">
                      <h3 className="text-xl font-semibold mb-4">{member.name}</h3>
                      <p className="mb-6 text-indigo-100">{member.role}</p>
                      <p className="text-sm text-indigo-100">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Added proper spacing between Team section and CTA section */}
      <div className="py-16"></div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/622fbc5a718ac3417fcd3d75/62328c3aef177acc681d309f_noise.png')] opacity-50"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Join Our Community?</h2>
            <p className="text-xl text-white mb-10">
              Discover events, connect with like-minded people, and create memorable experiences
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-100/30">
                Browse Events
              </button>
              <button className="btn bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-100/30">
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;