import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { HiMenu, HiX } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";

const clientID = "311238508492-i7o334gljj6h57ped9mdie180691do8e.apps.googleusercontent.com"
function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      localStorage.removeItem("profile");

      toast.success("You have successfully logged out. We hope to see you again soon!");
      setIsMenuOpen(false);
    }
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg font-medium transition-all duration-300 block relative underline-grow ${isActive
          ? 'bg-indigo-500 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm animate-nav-slide-down">
      <nav className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Text */}
          <div className="flex-shrink-0">
            <NavLink to={"/"} aria-label="Home" onClick={() => setIsMenuOpen(false)}>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-700 to-teal-700 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-lg">
                iFinance
              </h1>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/friends">Friends</NavItem>
            <NavItem to="/aboutus">About us</NavItem>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 btn-shimmer"
                >
                  Logout
                </button>
                <NavLink to={"/profile"} className="transition-transform duration-300 hover:scale-110">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md hover:shadow-indigo-300/50 hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={localStorage.getItem("profile") || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </NavLink>
              </div>
            ) : (
              <NavLink to={"/login"} className="ml-4">
                <button className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-sans btn-shimmer">
                  Login
                </button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:rotate-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-2 pb-4 stagger-children">
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/friends">Friends</NavItem>
            <NavItem to="/aboutus">About us</NavItem>

            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</span>
                    <NavLink to={"/profile"} onClick={() => setIsMenuOpen(false)}>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 shadow-sm hover:shadow-indigo-300/50 transition-shadow duration-300">
                        <img
                          src={localStorage.getItem("profile") || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </NavLink>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md btn-shimmer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to={"/login"} className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-md btn-shimmer">
                    Login
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="light"
      />
    </div>
  );
}

export default Navbar;
