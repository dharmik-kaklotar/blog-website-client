import React from 'react';
import Button from '../common/Button';


const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category?.id}
          variant={selectedCategory === category?.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category?.id)}
          className={`capitalize ${
            selectedCategory === category?.id
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          {category == '' ? 'All Categories' : category?.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
