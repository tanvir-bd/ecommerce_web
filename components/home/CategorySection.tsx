import React from "react";
import Link from "next/link";

import { API_URL } from '@/lib/config';

interface CategorySectionProps {
  subcategories: Array<{ id: number; name: string; image: string }>;
}

const CategorySection = ({ subcategories }: CategorySectionProps) => {
  const API_BASE_URL = API_URL;

  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="flex justify-center">
        <div className="heading my-[10px] ownContainer text-center uppercase heading ownContainer sm:my-[40px]">
          Luxury Categories
        </div>
      </div>
      <div className="relative flex justify-center">
        <div className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar pb-4">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/category/${subcategory.id}`}
              className="flex-shrink-0 w-[150px] sm:w-[250px] group cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] overflow-hidden rounded-lg mb-3">
                  <img
                    src={`${API_BASE_URL}${subcategory.image}`}
                    alt={subcategory.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-center uppercase tracking-wide group-hover:text-primary transition-colors">
                  {subcategory.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
