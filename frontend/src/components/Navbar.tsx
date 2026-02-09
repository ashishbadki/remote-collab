// components/Navbar.tsx - Refined
import { useEffect, useRef, useState } from "react";
import { getProfileApi } from "../api/user.api";
import profileImg from "../assets/profile_img.avif";
import { Logo } from "../components/Logo";

const Navbar = () => {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        setProfile(data);
      } catch (error) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
                <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full"></div>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-3 rounded-lg p-1.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="hidden text-right md:block">
                    <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                  </div>
                  <div className="relative">
                    <img
                      src={profileImg}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <svg 
                    className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-1">

                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{profile?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                    </div>

                    <div className="py-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </a>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          window.location.href = "/login";
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="mr-3 h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;