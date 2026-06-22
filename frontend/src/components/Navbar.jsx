import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Typing animation
  const fullText = "TeyzixMarket";
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (displayed.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1));
        }, 100);
      } else {
        // Poora type ho gaya — 2 sec ruko phir delete karo
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 60);
      } else {
        // Sab delete ho gaya — phir type karo
        timeout = setTimeout(() => setTyping(true), 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <nav
      style={{ backgroundColor: "#ffffff" }}
      className={`sticky top-0 z-50 border-b border-[#e5e0d8] transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            style={{ backgroundColor: "#151c5c" }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
          >
            <span className="text-white font-bold text-lg">T</span>
          </div>

          {/* Typing Text */}
          <span style={{ color: "#1a1a2e" }} className="text-xl font-bold tracking-tight min-w-[160px]">
            <span style={{ color: "#1a1a2e" }}>
              {displayed.slice(0, 6)}
            </span>
            <span style={{ color: "#5a5f90" }}>
              {displayed.slice(6)}
            </span>
            {/* Cursor */}
            <span
              style={{ color: "#151c5c" }}
              className="animate-pulse"
            >
              |
            </span>
          </span>
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            style={{ color: "#1a1a2e" }}
            className="text-sm font-medium hover:opacity-60 transition relative group"
          >
            Browse
            {/* Underline animation */}
            <span
              style={{ backgroundColor: "#151c5c" }}
              className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            />
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                style={{ color: "#151c5c" }}
                className="text-sm font-semibold hover:opacity-70 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ backgroundColor: "#151c5c" }}
                className="text-sm text-white px-5 py-2 rounded-xl shadow hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all duration-200 font-medium btn-primary"
              >
                Get Started →
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "customer" && (
                <Link
                  to="/dashboard"
                  style={{ color: "#1a1a2e" }}
                  className="text-sm font-medium hover:opacity-60 transition relative group"
                >
                  Dashboard
                  <span
                    style={{ backgroundColor: "#151c5c" }}
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              )}

              {user.role === "provider" && (
                <>
                  <Link
                    to="/provider/dashboard"
                    style={{ color: "#1a1a2e" }}
                    className="text-sm font-medium hover:opacity-60 transition relative group"
                  >
                    Dashboard
                    <span
                      style={{ backgroundColor: "#151c5c" }}
                      className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    />
                  </Link>
                  <Link
                    to="/provider/services/new"
                    style={{ backgroundColor: "#151c5c" }}
                    className="text-sm text-white px-4 py-2 rounded-xl shadow hover:opacity-90 hover:scale-105 transition-all duration-200 font-medium btn-primary"
                  >
                    + Add Service
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{ color: "#1a1a2e" }}
                  className="text-sm font-medium hover:opacity-60 transition relative group"
                >
                  Admin Panel
                  <span
                    style={{ backgroundColor: "#151c5c" }}
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {user?.img ? (
                    <img
                      src={user.img}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#535DCA] hover:scale-110 transition"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: "#151c5c" }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow hover:scale-110 transition"
                    >
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ color: "#1a1a2e" }} className="text-sm font-medium hidden lg:block">
                    {user?.username}
                  </span>
                  <svg
                    style={{ color: "#151c5c" }}
                    className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    style={{ backgroundColor: "#fff", borderColor: "#e5e0d8" }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border shadow-xl py-2 z-50 animate-[fadeInUp_0.2s_ease]"
                  >
                    <div className="px-4 py-2 border-b border-[#e5e0d8]">
                      <p style={{ color: "#1a1a2e" }} className="text-sm font-semibold">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <span
                        style={{ backgroundColor: "#535DCA20", color: "#151c5c" }}
                        className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium"
                      >
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#ffffff] transition"
                      style={{ color: "#1a1a2e" }}
                    >
                      <span>👤</span> My Profile
                    </Link>

                    {user.role === "customer" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#ffffff] transition"
                        style={{ color: "#1a1a2e" }}
                      >
                        <span>📋</span> My Requests
                      </Link>
                    )}

                    {user.role === "provider" && (
                      <Link
                        to="/provider/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#ffffff] transition"
                        style={{ color: "#1a1a2e" }}
                      >
                        <span>💼</span> My Projects
                      </Link>
                    )}

                    <div className="border-t border-[#e5e0d8] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-red-50 transition text-red-500"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            style={{ backgroundColor: "#151c5c" }}
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            style={{ backgroundColor: "#151c5c" }}
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            style={{ backgroundColor: "#151c5c" }}
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        style={{ backgroundColor: "#ffffff", borderColor: "#e5e0d8" }}
        className={`md:hidden border-t px-6 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: "#1a1a2e" }} className="text-sm font-medium">
            Browse
          </Link>
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: "#151c5c" }} className="text-sm font-semibold">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                style={{ backgroundColor: "#151c5c" }}
                className="text-sm text-white px-4 py-2 rounded-xl text-center font-medium"
              >
                Get Started →
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: "#1a1a2e" }} className="text-sm font-medium">
                👤 Profile
              </Link>
              {user.role === "customer" && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "#1a1a2e" }} className="text-sm font-medium">
                  📋 Dashboard
                </Link>
              )}
              {user.role === "provider" && (
                <>
                  <Link to="/provider/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "#1a1a2e" }} className="text-sm font-medium">
                    💼 Dashboard
                  </Link>
                  <Link
                    to="/provider/services/new"
                    onClick={() => setMenuOpen(false)}
                    style={{ backgroundColor: "#151c5c" }}
                    className="text-sm text-white px-4 py-2 rounded-xl text-center"
                  >
                    + Add Service
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: "#1a1a2e" }} className="text-sm font-medium">
                  🛡️ Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm text-red-500 text-left font-medium">
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}