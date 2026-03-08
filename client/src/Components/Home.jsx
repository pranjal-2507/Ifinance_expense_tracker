import React from "react";
import Layout from "./Layout";
import mainimg1 from "../images/mainimg.png";
import mainimg2 from "../images/mainimg2.png";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import { RiDashboardFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { HiChartBar, HiUserGroup, HiCog } from "react-icons/hi";
import { useScrollReveal, getRevealClass } from "../hooks/useScrollReveal";

function Home() {
  const userName = localStorage.getItem("user");
  const isLoggedIn = !!localStorage.getItem("token");
  const profileImg = localStorage.getItem("profile");

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const heroRef = useScrollReveal({ threshold: 0.1 });
  const imgRef = useScrollReveal({ threshold: 0.1 });
  const sectionRef = useScrollReveal({ threshold: 0.1 });
  const card1Ref = useScrollReveal({ threshold: 0.15 });
  const card2Ref = useScrollReveal({ threshold: 0.15 });
  const card3Ref = useScrollReveal({ threshold: 0.15 });
  const quickRef = useScrollReveal({ threshold: 0.15 });

  return (
    <Layout>
      {/* Personalized Welcome Banner (shown when logged in) */}
      {isLoggedIn && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 animate-gradient bg-[length:200%_200%]">
          <div className="container mx-auto px-4 py-4 md:py-5">
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-4">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/50 shadow-lg" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-sm font-medium">{getGreeting()}</p>
                  <h2 className="text-white text-xl md:text-2xl font-bold">Welcome back, {userName || "User"}!</h2>
                </div>
              </div>
              <NavLink to="/dashboard">
                <button className="hidden md:flex items-center px-5 py-2.5 rounded-xl font-semibold text-indigo-700 bg-white hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                  <RiDashboardFill className="mr-2" />
                  Go to Dashboard
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full filter blur-3xl animate-morph-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full filter blur-3xl animate-morph-blob" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full filter blur-3xl animate-morph-blob" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              ref={heroRef.ref}
              className={`space-y-8 ${getRevealClass(heroRef.isVisible, 'up')}`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-700 bg-clip-text text-transparent drop-shadow-sm inline-block animate-text-reveal" style={{ animationDelay: '0.1s' }}>
                  Streamline Your Finances,
                </span>
                <br />
                <span className="text-gray-900 drop-shadow-sm inline-block animate-text-reveal" style={{ animationDelay: '0.4s' }}>
                  Simplify Your Life
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl animate-text-reveal" style={{ animationDelay: '0.6s' }}>
                Effortlessly manage expenses with our intuitive platform. Redefine the way you manage your finances and elevate your financial well-being with iFinance.
              </p>

              {/* Dynamic CTA based on login state */}
              {isLoggedIn ? (
                <div className="flex flex-wrap gap-4 animate-text-reveal" style={{ animationDelay: '0.7s' }}>
                  <NavLink to="/dashboard">
                    <button className="group px-8 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 btn-shimmer">
                      <span className="flex items-center">
                        <RiDashboardFill className="mr-2" />
                        My Dashboard
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </NavLink>
                  <NavLink to="/friends">
                    <button className="group px-8 py-4 rounded-xl font-bold text-indigo-700 text-lg bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      <span className="flex items-center">
                        <FaUserFriends className="mr-2" />
                        Split Bills
                      </span>
                    </button>
                  </NavLink>
                </div>
              ) : (
                <NavLink to="/login">
                  <button className="group px-10 py-5 rounded-xl font-bold text-white text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:via-purple-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 animate-gradient bg-[length:200%_200%] btn-shimmer">
                    <span className="flex items-center">
                      EXPLORE NOW
                      <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </NavLink>
              )}

              <p className="text-gray-500 leading-relaxed mt-6">
                An expense tracking and financial analysis platform, equipping you with the knowledge and resources needed to navigate today's dynamic economic landscape with confidence and clarity.
              </p>
            </div>

            {/* Right Images */}
            <div
              ref={imgRef.ref}
              className={`relative h-96 md:h-[500px] lg:h-[600px] ${getRevealClass(imgRef.isVisible, 'right')}`}
            >
              <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-indigo-200/50 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)]">
                <img
                  src={mainimg1}
                  alt="Finance Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 z-10 hover:shadow-teal-200/50 hover:shadow-[0_20px_60px_-15px_rgba(20,184,166,0.3)]" style={{ animationDelay: '0.3s' }}>
                <img
                  src={mainimg2}
                  alt="Expense Tracking"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/40 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-300/30 rounded-full filter blur-lg animate-float" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section (for logged-in users) */}
      {isLoggedIn && (
        <div className="bg-white py-12 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div
              ref={quickRef.ref}
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto ${getRevealClass(quickRef.isVisible, 'up')}`}
            >
              <NavLink to="/dashboard" className="group">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 hover-lift text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    <HiChartBar size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Track Expenses</h3>
                  <p className="text-sm text-gray-500">View & manage your transactions</p>
                </div>
              </NavLink>

              <NavLink to="/friends" className="group">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100 hover:shadow-xl transition-all duration-300 hover-lift text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-300">
                    <HiUserGroup size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Split Bills</h3>
                  <p className="text-sm text-gray-500">Manage shared expenses easily</p>
                </div>
              </NavLink>

              <NavLink to="/profile" className="group">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-xl transition-all duration-300 hover-lift text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    <HiCog size={28} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Your Profile</h3>
                  <p className="text-sm text-gray-500">Update your details & photo</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* How it Works Section */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div
            ref={sectionRef.ref}
            className={getRevealClass(sectionRef.isVisible, 'up')}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
              How it Works?
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-teal-500 mx-auto mb-16 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dashboard Card */}
            <div
              ref={card1Ref.ref}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 glow-card hover-lift ${getRevealClass(card1Ref.isVisible, 'up')}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="text-5xl mb-6 text-indigo-600 flex justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <RiDashboardFill />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Dashboard
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our intuitive dashboard provides a comprehensive overview of your expenses. Track your spending habits, view transaction history, and gain insights into your financial activities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Visualize your expenses through interactive tables, diagrams, and pie charts. Analyze your expenditure patterns and make informed financial decisions.
              </p>
            </div>

            {/* Friends Section Card */}
            <div
              ref={card2Ref.ref}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 glow-card hover-lift ${getRevealClass(card2Ref.isVisible, 'up')}`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="text-5xl mb-6 text-teal-600 flex justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <FaUserFriends />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Friends Section
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Easily manage shared expenses with friends and family. Keep track of money owed and payments made among your social circle.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Collaborate on expenses, split bills seamlessly, and ensure everyone stays on top of their financial commitments.
              </p>
            </div>

            {/* About Us Card */}
            <div
              ref={card3Ref.ref}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 glow-card hover-lift ${getRevealClass(card3Ref.isVisible, 'up')}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="text-5xl mb-6 flex justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <FcAbout />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                About Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Learn more about iFinance and our mission to revolutionize expense management.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Discover our commitment to providing innovative solutions for businesses and individuals alike.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
}

export default Home;
