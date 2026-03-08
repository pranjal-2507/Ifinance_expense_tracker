// Aboutus.jsx
import React from "react";
import Layout from "./Layout";
import { MdMobileFriendly } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { RiCommunityFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { useScrollReveal, getRevealClass } from "../hooks/useScrollReveal";

function Aboutus() {
  const navigate = useNavigate();
  const headerRef = useScrollReveal({ threshold: 0.1 });
  const missionRef = useScrollReveal({ threshold: 0.15 });
  const offer1Ref = useScrollReveal({ threshold: 0.15 });
  const offer2Ref = useScrollReveal({ threshold: 0.15 });
  const why1Ref = useScrollReveal({ threshold: 0.15 });
  const why2Ref = useScrollReveal({ threshold: 0.15 });
  const why3Ref = useScrollReveal({ threshold: 0.15 });
  const why4Ref = useScrollReveal({ threshold: 0.15 });
  const ctaRef = useScrollReveal({ threshold: 0.15 });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 animate-page-enter">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div ref={headerRef.ref} className={getRevealClass(headerRef.isVisible, 'up')}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-700 bg-clip-text text-transparent drop-shadow-sm">
              Welcome to iFinance!
            </h1>
          </div>

          <div
            ref={headerRef.ref}
            className={`bg-white rounded-3xl shadow-xl p-10 mb-16 border border-gray-100 transition-all hover:shadow-2xl gradient-border ${getRevealClass(headerRef.isVisible, 'scale')}`}
          >
            <p className="text-xl text-gray-800 leading-relaxed text-center font-medium">
              At iFinance, we believe that managing your finances should be
              straightforward, intuitive, and accessible to everyone. Whether you're
              tracking your personal income and expenses or managing a group's
              contributions, we've got you covered.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-20" ref={missionRef.ref}>
            <div className={getRevealClass(missionRef.isVisible, 'up')}>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Mission</h2>
              <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-3xl shadow-xl p-10 border border-indigo-100 hover:shadow-2xl transition-all duration-500 glow-card">
                <p className="text-xl text-gray-800 leading-relaxed text-center">
                  We empower individuals and groups to take control of their finances with
                  ease. We understand that managing money can be stressful, but with the
                  right tools and resources, it can become efficient and even empowering.
                </p>
              </div>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">What We Offer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                ref={offer1Ref.ref}
                className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover-lift glow-card ${getRevealClass(offer1Ref.isVisible, 'left')}`}
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">Income and Expense Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Keep a detailed record of your income and expenses and categorize
                  your transactions. Gain valuable insights into where your money goes
                  and make informed financial decisions.
                </p>
              </div>

              <div
                ref={offer2Ref.ref}
                className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover-lift glow-card ${getRevealClass(offer2Ref.isVisible, 'right')}`}
              >
                <h3 className="text-2xl font-bold text-secondary-600 mb-4">Group Expense Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize and manage expenses with your friends or family in our
                  Groups section. Create groups, add members, track contributions, and
                  ensure everyone is on the same page. Perfect for shared living
                  situations, trips, or any group activities with shared expenses.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose I-Finance?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                ref={why1Ref.ref}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover-lift ${getRevealClass(why1Ref.isVisible, 'up')}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl text-primary-600 group-hover:scale-110 transition-transform duration-300">
                    <MdMobileFriendly />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">User-Friendly Interface</h4>
                    <p className="text-gray-600">Our clean and intuitive design makes managing your finances seamless.</p>
                  </div>
                </div>
              </div>

              <div
                ref={why2Ref.ref}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover-lift ${getRevealClass(why2Ref.isVisible, 'up')}`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl text-emerald-600">
                    <RiSecurePaymentFill />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Secure and Private</h4>
                    <p className="text-gray-600">We use top-notch security measures to ensure your financial data is safe and private.</p>
                  </div>
                </div>
              </div>

              <div
                ref={why3Ref.ref}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover-lift ${getRevealClass(why3Ref.isVisible, 'up')}`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl text-purple-600">
                    <TbReport />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Comprehensive Reports</h4>
                    <p className="text-gray-600">Gain insights with detailed reports and visualizations of your spending habits. Make better budgeting decisions based on data.</p>
                  </div>
                </div>
              </div>

              <div
                ref={why4Ref.ref}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover-lift ${getRevealClass(why4Ref.isVisible, 'up')}`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-3xl text-secondary-600">
                    <RiCommunityFill />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Community Support</h4>
                    <p className="text-gray-600">Join our community to share tips, ask questions, and support each other on your financial journeys.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            ref={ctaRef.ref}
            className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 rounded-2xl shadow-2xl p-12 text-center animate-gradient bg-[length:200%_200%] ${getRevealClass(ctaRef.isVisible, 'scale')}`}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Join Us Today!</h2>
            <p className="text-white/90 text-lg mb-6">Start your journey to better financial management</p>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-xl font-bold text-indigo-600 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 btn-shimmer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
}

export default Aboutus;
