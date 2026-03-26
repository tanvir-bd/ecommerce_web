import React from "react";
import Link from "next/link";

import { API_URL } from '@/lib/config';

interface SpecialCombosProps {
  data: Array<{ id: number; title: string; imageUrl: string; link: string }>;
}

const SpecialCombos = ({ data }: SpecialCombosProps) => {
  const API_BASE_URL = API_URL;

  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        SPECIAL COMBOS
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {data.map((combo) => (
            <Link
              key={combo.id}
              href={combo.link}
              className="flex-shrink-0 w-[80vw] sm:w-[347px]"
            >
              <img
                src={`${API_BASE_URL}${combo.imageUrl}`}
                alt={combo.title}
                className="w-full h-auto object-cover"
              />
              <p className="text-center uppercase textGap font-[500]">
                {combo.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialCombos;
