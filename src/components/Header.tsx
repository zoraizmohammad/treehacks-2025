
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isWorkNight?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isWorkNight }) => {
  return (
    <header className={`border-b ${isWorkNight ? 'border-white/10 bg-black' : 'border-white/10 bg-[#1A1F2C]'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            {/* Logo/Brand */}
            <Link to={isWorkNight ? "/worknight" : "/"} className="text-2xl font-bold text-white">
              {isWorkNight ? "WorkNight" : "MindfulUniversity"}
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {isWorkNight ? (
                <>
                  <Link to="/jobs" className="text-white/90 hover:text-white transition-colors">
                    Jobs
                  </Link>
                  <Link to="/career-path" className="text-white/90 hover:text-white transition-colors">
                    Career Path
                  </Link>
                  <Link to="/benefits" className="text-white/90 hover:text-white transition-colors">
                    Benefits
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/approach" className="text-white/90 hover:text-white transition-colors">
                    Our Approach
                  </Link>
                  <Link to="/results" className="text-white/90 hover:text-white transition-colors">
                    Our Results
                  </Link>
                  <Link to="/resources" className="text-white/90 hover:text-white transition-colors">
                    Resources
                  </Link>
                  <Link to="/about" className="text-white/90 hover:text-white transition-colors">
                    Who We Are
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Theme Switcher & Admin Login */}
          <div className="flex items-center space-x-6">
            <Link 
              to={isWorkNight ? "/" : "/worknight"} 
              className="text-white/90 hover:text-white transition-colors"
            >
              Switch to {isWorkNight ? "MindfulUniversity" : "WorkNight"}
            </Link>
            <Link 
              to={isWorkNight ? "/worknight/admin" : "/admin"}
              className="inline-flex items-center text-[#0EA5E9] hover:text-white transition-colors"
            >
              Admin login
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
