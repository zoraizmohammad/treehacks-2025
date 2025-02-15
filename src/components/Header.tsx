
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  isWorkNight?: boolean;
  isTrustedLoans?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isWorkNight, isTrustedLoans }) => {
  const getBrandName = () => {
    if (isWorkNight) return "WorkNight";
    if (isTrustedLoans) return "TrustedLoans";
    return "MindfulUniversity";
  };

  const getHomeRoute = () => {
    if (isWorkNight) return "/worknight";
    if (isTrustedLoans) return "/trustedloans";
    return "/";
  };

  const getAdminRoute = () => {
    if (isWorkNight) return "/worknight/admin";
    if (isTrustedLoans) return "/trustedloans/admin";
    return "/admin";
  };

  const getHeaderClass = () => {
    if (isTrustedLoans) return "border-b border-gray-200 bg-white";
    return `border-b ${isWorkNight ? 'border-white/10 bg-black' : 'border-white/10 bg-[#1A1F2C]'}`;
  };

  const getTextColor = () => {
    if (isTrustedLoans) return "text-gray-800";
    return "text-white";
  };

  const getSwitchOptions = () => {
    if (isTrustedLoans) {
      return [
        { label: "MindfulUniversity", route: "/" },
        { label: "WorkNight", route: "/worknight" }
      ];
    }
    if (isWorkNight) {
      return [
        { label: "MindfulUniversity", route: "/" },
        { label: "TrustedLoans", route: "/trustedloans" }
      ];
    }
    return [
      { label: "WorkNight", route: "/worknight" },
      { label: "TrustedLoans", route: "/trustedloans" }
    ];
  };

  return (
    <header className={getHeaderClass()}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to={getHomeRoute()} className={`text-2xl font-bold ${getTextColor()}`}>
              {getBrandName()}
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {isWorkNight ? (
                <>
                  <Link to="/jobs" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Jobs
                  </Link>
                  <Link to="/career-path" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Explore Career Paths
                  </Link>
                </>
              ) : isTrustedLoans ? (
                <>
                  <Link to="/personal-loans" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Personal Loans
                  </Link>
                  <Link to="/mortgage" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Mortgage
                  </Link>
                  <Link to="/business" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Business
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/approach" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Our Approach
                  </Link>
                  <Link to="/results" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Our Results
                  </Link>
                  <Link to="/resources" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Resources
                  </Link>
                  <Link to="/about" className={`${getTextColor()} opacity-90 hover:opacity-100 transition-colors`}>
                    Who We Are
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <select 
                onChange={(e) => window.location.href = e.target.value}
                className={`appearance-none bg-transparent ${getTextColor()} px-4 py-2 pr-8 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer focus:ring-2 focus:ring-[#0FA0CE] focus:border-transparent`}
                value=""
              >
                <option value="" disabled>Switch Platform</option>
                {getSwitchOptions().map(option => (
                  <option key={option.route} value={option.route} className="text-black bg-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
            <Link 
              to={getAdminRoute()}
              className={isTrustedLoans ? "inline-flex items-center text-[#0FA0CE] hover:text-[#0D8BAD] transition-colors" : "inline-flex items-center text-[#0EA5E9] hover:text-white transition-colors"}
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
