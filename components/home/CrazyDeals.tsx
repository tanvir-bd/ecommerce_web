import React from "react";
import Link from "next/link";

import { API_URL } from '@/lib/config';

interface CrazyDealsProps {
  data: Array<{ id: number; title: string; imageUrl: string; link: string }>;
}

const CrazyDeals = ({ data }: CrazyDealsProps) => {
  const API_BASE_URL = API_URL;

  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        Crazy Deals
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {data.map((deal) => (
            <Link
              key={deal.id}
              href={deal.link}
              className="flex-shrink-0 w-[80vw] sm:w-[347px]"
            >
              <img
                src={`${API_BASE_URL}${deal.imageUrl}`}
                alt={deal.title}
                className="w-full h-auto object-cover"
              />
              <p className="text-center uppercase textGap font-[500]">
                {deal.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrazyDeals;
