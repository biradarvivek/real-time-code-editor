import React, { useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [formData, setFormData] = useState({
    roomId: "",
    username: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Joining room:", formData);
    // Add your room joining logic here
  };

  const handleCreateNewRoom = () => {
    console.log("Creating new room");
    // Add your new room creation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        {/* Glass Morphism Container */}
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-8 text-center border-b border-gray-700/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            >
              {/* Replace with your logo */}
              <img
                src="../../images/SmallSquareLogoJpg.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </motion.div>
            <p className="text-gray-300 text-lg">Enter the ROOM ID</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room ID Field */}
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wider">
                  ROOM ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border-2 border-cyan-500/30 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-lg font-medium"
                    placeholder="Enter Room ID"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
                    🔑
                  </div>
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wider">
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border-2 border-cyan-500/30 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-lg font-medium"
                    placeholder="Enter your username"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
                    👤
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 uppercase tracking-wider"
              >
                JOIN
              </motion.button>
            </form>

            {/* Create New Room Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have a room ID?{" "}
                <button
                  onClick={handleCreateNewRoom}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline"
                >
                  create New Room
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Real-time collaborative code editing
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
