import React, { useState } from 'react';
import { Heart, Share2, Clock, User } from 'lucide-react';
import Button from '../common/Button';
import moment from 'moment';
import {Link} from 'react-router-dom'
import axios from 'axios'


const BlogCard = ({ blog }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(+blog.likes);

  const apiUrl = process.env.REACT_APP_API_URL;

  const updateLike = async (id,isLiked) => {
    try {
        const form = new FormData()
         form.append("isLiked",!isLiked ? 1 : 0)
         form.append("id",id)

      const response = await axios.post(
        `${apiUrl}/user/like_blog`,
        form // body (if no data to send)
      );
      const data = await response.data;
      // if (data?.status) {
      //   setAllBlogs(data?.data);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
    updateLike(blog.id,isLiked)
    console.log('Toggled like for blog:', blog.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: `${window.location.href}${blog?.title?.trim()?.replaceAll(" ","-")?.toLowerCase()}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log('Blog shared:', blog.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={blog.media_url}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
            {blog.category?.name || "Other"}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-4">{blog.admin?.name || "Unknown"}</span>
            {/* <Clock className="h-4 w-4 mr-1" />
            <span>{blog.readTime}</span> */}
          </div>
          <div>
            {moment(blog?.created_at).format("DD-MM-YYYY")}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Link to={`${window.location.href}${blog?.title?.trim()?.replaceAll(" ","-")?.toLowerCase()}`} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            Read More
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-500 hover:text-blue-600"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
