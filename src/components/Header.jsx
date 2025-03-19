import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";

const Header = () => {
  const { userInfo } = useSelector((state) => state.user); // Get user info from Redux
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Function to handle image display
  const getImageSrc = () => {
    if (userInfo?.image) {
      // If the image is a file object, convert it to a URL
      if (userInfo.image instanceof File) {
        return URL.createObjectURL(userInfo.image);
      }
      // If the image is already a URL (Base64 or normal URL), return it as is
      return userInfo.image;
    }
    // Default icon if there's no image
    return null; // Return null for default icon handling in render
  };

  return (
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold animate-pulse transition-transform duration-500 ease-in-out">
              KMW CAR RENTAL PVT(LTD)
            </h1>

            {/* User Section */}
            <div className="relative">
              <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {/* Render the image if available, or fallback to default icon */}
                  {getImageSrc() ? (
                      <img
                          src={getImageSrc()} // Display the user image
                          alt="User Profile"
                          className="h-full w-full object-cover rounded-full"
                      />
                  ) : (
                      <FiUser className="h-6 w-6" /> // Display fallback icon if no image
                  )}
                </div>
              </button>

              {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        {userInfo?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userInfo?.email || "user@example.com"}
                      </p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
