import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Spinner from '../components/layout/Spinner';
import Alert from '../components/layout/Alert';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt, FaChevronRight, 
  FaStar, FaArrowRight, FaSearch, FaFilter, FaUsers, FaMicrophone,
  FaLaptop, FaMusic, FaGraduationCap, FaUtensils, FaHeartbeat, FaSun, FaMoon, FaImages, FaShare
} from 'react-icons/fa';

const Home = () => {
  const { events, getEvents, loading, error } = useEventContext();
  const { isRtl, t } = useRtlContext();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);
  
  // Mouse position for spotlight effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty('--x', `${x}%`);
        hero.style.setProperty('--y', `${y}%`);
        setMousePosition({ x, y });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle animation
  useEffect(() => {
    const createParticle = () => {
      const particles = document.querySelector('.particles');
      if (!particles) return;
      
      const particle = document.createElement('div');
      particle.className = 'particle animate-particle';
      
      const size = Math.random() * 20 + 5;
      const duration = Math.random() * 10 + 5;
      const x = Math.random() * particles.offsetWidth;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
      particle.style.animationDuration = `${duration}s`;
      
      particles.appendChild(particle);
      
      setTimeout(() => {
        if (particles.contains(particle)) {
          particles.removeChild(particle);
        }
      }, duration * 1000);
    };
    
    const particleInterval = setInterval(createParticle, 300);
    return () => clearInterval(particleInterval);
  }, []);
  
  // Testimonial autoplay
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      await getEvents();
    } catch (err) {
      console.log('Events loading failed');
    } finally {
      setIsInitialLoad(false);
    }
  }, [getEvents]);

  useEffect(() => {
    if (isInitialLoad) {
      loadEvents();
    }
  }, [isInitialLoad, loadEvents]);
  
  // Mock categories
  const categories = [
    { id: 'all', name: 'All Events', icon: FaCalendarAlt },
    { id: 'tech', name: 'Tech', icon: FaLaptop },
    { id: 'music', name: 'Music', icon: FaMusic },
    { id: 'education', name: 'Education', icon: FaGraduationCap },
    { id: 'food', name: 'Food & Drink', icon: FaUtensils },
    { id: 'health', name: 'Health', icon: FaHeartbeat }
  ];
  
  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sakura T.',
      role: 'Event Organizer',
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=Sakura&backgroundColor=ffdfbf',
      text: "EventHub has revolutionized how we manage event registrations. The platform is intuitive and our attendees love the seamless experience!"
    },
    {
      id: 2,
      name: 'Kenta M.',
      role: 'Conference Attendee',
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=Kenta&backgroundColor=c0aede',
      text: "I've attended multiple events through EventHub and the registration process is always smooth. The mobile tickets are convenient and easy to use."
    },
    {
      id: 3,
      name: 'Yuna K.',
      role: 'Marketing Director',
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=Yuna&backgroundColor=b6e3f4',
      text: "The analytics we get from EventHub help us understand our audience better. It's been instrumental in growing our event series."
    }
  ];

  const getFeaturedEvents = useCallback(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6);
  }, [events]);

  const featuredEvents = getFeaturedEvents();
  
  const filteredEvents = featuredEvents.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format date in a more user-friendly way
  const formatEventDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days remaining until event
  const getDaysRemaining = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden spotlight"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 z-0"></div>
        
        {/* Animated Particles */}
        <div className="particles absolute inset-0 z-10"></div>
        
        {/* Blurred Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-300 dark:bg-purple-900 filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-300 dark:bg-indigo-900 filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-300 dark:bg-blue-900 filter blur-3xl opacity-20 animate-float"></div>
        
        <div className="container-custom relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fadeIn">
                {isRtl ? 'اكتشف ألمع الفعاليات' : 'Discover Amazing Events'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slideIn">
                {isRtl 
                  ? 'ابحث، سجل، واستمتع بتجربة فريدة في الفعاليات القادمة' 
                  : 'Find, register, and enjoy unique experiences at upcoming events'}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-slideIn delay-150">
                <Link 
                  to="/events" 
                  className="btn btn-primary px-8 py-3 text-lg font-medium hover-lift"
                >
                  <span>{isRtl ? 'تصفح جميع الفعاليات' : 'Browse Events'}</span>
                  <FaArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <Link 
                  to="/register" 
                  className="btn btn-glass px-8 py-3 text-lg font-medium hover-scale"
                >
                  {isRtl ? 'انضم إلينا' : 'Join Us'}
                </Link>
              </div>
              
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 dark:text-gray-400 animate-slideIn delay-300">
                <div className="flex items-center">
                  <FaUsers className="w-5 h-5 mr-2 text-indigo-500" />
                  <span>10K+ Users</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-indigo-500" />
                  <span>500+ Events</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="w-5 h-5 mr-2 text-indigo-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 hidden lg:block animate-scaleIn">
              <div className="absolute inset-0 card-3d">
                <div className="relative h-full w-full p-8 backdrop-card gradient-border transform hover:scale-[1.02] transition-transform duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94" 
                    alt="Featured Event" 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg">
                    <div className="absolute bottom-10 left-10 right-10 text-white">
                      <div className="text-sm text-indigo-300 mb-2 flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        <span>Featured Event</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        International Tech Conference 2023
                      </h3>
                      <div className="flex items-center text-gray-300 text-sm mb-4">
                        <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                        <span>San Francisco, CA</span>
                        <span className="mx-2">•</span>
                        <FaClock className="w-4 h-4 mr-1" />
                        <span>Oct 15-18, 2023</span>
                      </div>
                      <Link 
                        to="/events/1" 
                        className="btn btn-primary py-2 px-4 text-sm inline-flex items-center"
                      >
                        <FaTicketAlt className="w-4 h-4 mr-2" />
                        Reserve Your Spot
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isRtl ? 'الفعاليات المميزة' : 'Featured Events'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRtl ? 'استكشف أحدث الفعاليات المميزة لدينا' : 'Discover our newest featured events'}
              </p>
            </div>
            
            <Link 
              to="/events"
              className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
              <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Search & Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={isRtl ? 'بحث عن فعاليات...' : 'Search events...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2">
                <button className="btn btn-glass py-2.5 px-4 flex items-center gap-2">
                  <FaFilter className="w-4 h-4" />
                  <span>{isRtl ? 'المزيد من الفلاتر' : 'More Filters'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fadeIn">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
          
          {error && <Alert type="error" message={error} />}
          
          {loading && isInitialLoad ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <div 
                  key={event._id} 
                  className="card hover-lift overflow-hidden group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 -mx-6 -mt-6 mb-5 overflow-hidden">
                    <img 
                      src={event.imageUrl || `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent">
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="badge badge-info">{event.category}</span>
                        <span className="badge badge-secondary">${event.price || 'Free'}</span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="text-white">
                          <p className="text-sm text-indigo-300 flex items-center">
                            <FaCalendarAlt className="w-3 h-3 mr-1" />
                            {formatEventDate(event.date)}
                          </p>
                        </div>
                        
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shimmer-bg">
                          {getDaysRemaining(event.date)} days left
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="w-4 h-4 mr-1 text-indigo-500" />
                        <span className="truncate max-w-[120px]">{event.location}</span>
                      </div>
                      
                      <Link 
                        to={`/events/${event._id}`}
                        className="btn btn-outline py-1.5 px-3 group-hover:btn-primary transition-all duration-300"
                      >
                        <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card-glass">
              <h3 className="text-xl font-semibold mb-4">
                {isRtl ? 'لم يتم العثور على فعاليات' : 'No events found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {isRtl 
                  ? 'لا توجد فعاليات تطابق معايير البحث' 
                  : 'There are no events matching your search criteria'}
              </p>
              <button 
                onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
                className="btn btn-primary"
              >
                {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {isRtl ? 'كيف يعمل النظام' : 'How It Works'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {isRtl 
                ? 'عملية سهلة وبسيطة تضمن لك تجربة ممتازة' 
                : 'A simple and easy process to ensure you have a great experience'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: isRtl ? 'تصفح الفعاليات' : 'Browse Events',
                description: isRtl 
                  ? 'استكشف مجموعة الفعاليات القادمة واعثر على ما يهمك' 
                  : 'Explore our collection of upcoming events and find ones that interest you.',
                color: 'from-blue-500 to-indigo-600',
                delay: 0
              },
              {
                step: 2,
                title: isRtl ? 'سجل' : 'Register',
                description: isRtl 
                  ? 'قدم طلب التسجيل للفعاليات التي ترغب في حضورها' 
                  : 'Submit your registration for events you\'d like to attend.',
                color: 'from-purple-500 to-indigo-600',
                delay: 200
              },
              {
                step: 3,
                title: isRtl ? 'احصل على الموافقة' : 'Get Approved',
                description: isRtl 
                  ? 'انتظر موافقة المشرف واستلم تأكيد التسجيل' 
                  : 'Wait for admin approval and receive confirmation of your registration.',
                color: 'from-indigo-500 to-purple-600',
                delay: 400
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="backdrop-card hover-lift animate-fadeIn"
                style={{ animationDelay: `${item.delay}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {isRtl ? 'ماذا يقول عملاؤنا' : 'What Our Users Say'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {isRtl 
                ? 'تعرف على آراء المستخدمين في خدماتنا' 
                : 'Hear from our satisfied users about their experience'}
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(${-currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="card-glass text-center py-10 px-8">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 mb-6">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex flex-col items-center">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-indigo-600 dark:text-indigo-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'bg-indigo-600 w-8'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container-custom relative z-10">
          <div className="backdrop-card bg-white/10 border-white/20 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {isRtl ? 'مستعد للانضمام إلينا؟' : 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {isRtl 
                ? 'انضم إلى آلاف المستخدمين الذين يعتمدون على منصتنا لإدارة فعالياتهم' 
                : 'Join thousands of users who rely on our platform for managing their events'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="btn px-8 py-3 text-lg font-medium bg-white text-indigo-600 hover:bg-gray-100 transition-colors duration-300 hover-lift"
              >
                {isRtl ? 'إنشاء حساب' : 'Create Account'}
              </Link>
              <Link 
                to="/about" 
                className="btn px-8 py-3 text-lg font-medium border-2 border-white text-white hover:bg-white/10 transition-colors duration-300"
              >
                {isRtl ? 'تعرف علينا أكثر' : 'Learn More'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;