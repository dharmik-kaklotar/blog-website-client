import React from "react";
import Carousel from "../common/Carousel";
import Button from "../common/Button";
import { Clock, User, Heart, Share2 } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BlogSlider = ({ blogs }) => {
  const navigate = useNavigate();

  // const handleLike = (blogId) => {
  //   console.log('Liked blog:', blogId);
  // };

  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: `${window.location.href}blog/${blog?.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log("Blog shared:", blog.id);
    }
  };

  const carouselItems = blogs.map((blog) => (
    <div
      key={blog.id}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden mx-2"
    >
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={blog.media_url}
            alt={blog.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {blog.category?.name || "Other"}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-gray-600 mb-6 line-clamp-3">{blog.description}</p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">{blog.admin?.name || "Unknown"}</span>
              {/* <Clock className="h-4 w-4 mr-1" />
              <span>{blog.readTime}</span> */}
            </div>
            <div className="text-sm text-gray-500">
              {moment(blog?.created_at).format("DD-MM-YYYY")}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              target='_blank'
              to={`/blog/${blog?.id}`}
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              Read More
            </Link>

            <div className="flex items-center space-x-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => handleLike(blog.id)}
                className="flex items-center space-x-1"
              >
                <Heart className="h-4 w-4" />
                <span>{blog.likes}</span>
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(blog)}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <Carousel className="w-full max-w-5xl mx-auto">{carouselItems}</Carousel>
  );
};

export default BlogSlider;
