import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full text-gray-700 bg-blue-100">
      {/* Newsletter */}
      <div className="container px-4 pt-10 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 pb-6 border-b border-blue-200 lg:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="DMart Logo" className="h-10" />
            <h2 className="text-2xl font-bold text-blue-600">DMart</h2>
          </div>
          <div className="flex w-full lg:w-auto">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 px-4 py-2 text-gray-800 rounded-l-full lg:w-96 focus:outline-none"
            />
            <button className="px-6 py-2 font-medium text-white rounded-r-full bg-blue-500 hover:bg-blue-600">
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Why People Like Us */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">
              Why People Like us!
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              DMart offers a seamless online shopping experience with a wide range of fresh products, competitive prices, and reliable delivery. We prioritize customer satisfaction and quality.
            </p>
            <button className="px-5 py-2 transition border border-blue-400 rounded-full text-blue-400 hover:bg-blue-400 hover:text-white">
              Read More
            </button>
          </div>

          {/* Shop Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">Shop Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-us" className="hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400">FAQs & Help</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/customer-profile" className="hover:text-blue-400">My Account</Link></li>
              <li><Link to="/shop-detail" className="hover:text-blue-400">Shop details</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400">Shopping Cart</Link></li>
              <li><Link to="/customer-profile/wishlist" className="hover:text-blue-400">Wishlist</Link></li>
              <li><Link to="/customer-profile/my-orders" className="hover:text-blue-400">Order History</Link></li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-700">Contact</h3>
            <ul className="mb-4 space-y-2 text-sm">
              <li>Address: 123 DMart Street, City, State, 12345</li>
              <li>Email: support@dmart.com</li>
              <li>Phone: +91 98765 43210</li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-300 transform rounded-full shadow-lg hover:-translate-y-2 hover:scale-125"
                style={{ backgroundColor: "#1DA1F2", color: "white" }}
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-300 transform rounded-full shadow-lg hover:-translate-y-2 hover:scale-125"
                style={{ backgroundColor: "#1877F2", color: "white" }}
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-300 transform rounded-full shadow-lg hover:-translate-y-2 hover:scale-125"
                style={{ backgroundColor: "#FF0000", color: "white" }}
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-300 transform rounded-full shadow-lg hover:-translate-y-2 hover:scale-125"
                style={{ backgroundColor: "#0A66C2", color: "white" }}
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between py-4 text-sm text-center text-gray-600 border-t border-blue-200 lg:flex-row">
          <p>
            © <span className="text-blue-400">DMart</span>, All rights reserved.
          </p>
          <p>
            Designed by <span className="text-blue-400">DMart Team</span> 
          </p>
        </div>
      </div>
    </footer>
  );
}
