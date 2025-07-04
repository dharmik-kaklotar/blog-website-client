import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Share2, Clock, User } from 'lucide-react';

const BlogSlider = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  const currentBlog = blogs[currentIndex];

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-500">
      {/* Left Arrow */}
      <button onClick={handlePrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10">
        <ArrowLeft size={20} />
      </button>

      {/* Blog Image */}
      <div className="w-full md:w-1/2">
        <img src={currentBlog.image} alt={currentBlog.title} className="w-full h-full object-cover" />
      </div>

      {/* Blog Info */}
      <div className="p-6 w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">
            {currentBlog.category}
          </span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{currentBlog.title}</h3>
          <p className="text-gray-600 mb-4">{currentBlog.excerpt}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
          <div className="flex items-center gap-2">
            <User size={16} />
            {currentBlog.author}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {currentBlog.readTime}
          </div>
          <div>{new Date(currentBlog.date).toLocaleDateString()}</div>
        </div>
        <div className="flex items-center mt-4 gap-4">
          <button className="flex items-center text-gray-600 hover:text-red-500">
            <Heart size={18} className="mr-1" />
            {currentBlog.likes}
          </button>
          <button className="flex items-center text-gray-600 hover:text-blue-500">
            <Share2 size={18} className="mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Right Arrow */}
      <button onClick={handleNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-10">
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default BlogSlider;
