import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Benefit {
  id: number;
  text: string;
}

interface Ingredient {
  id: number;
  text: string;
}

interface ProductDetailsAccordianProps {
  longDescription?: string;
  benefits?: Benefit[];
  ingredients?: Ingredient[];
}

const ProductDetailsAccordian = ({
  longDescription,
  benefits,
  ingredients,
}: ProductDetailsAccordianProps) => {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {/* Long Description */}
        {longDescription && (
          <AccordionItem value="item-1">
            <AccordionTrigger className="uppercase subHeading tracking-[1px]">
              DESCRIPTION
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: longDescription }}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Key Benefits */}
        {benefits && benefits.length > 0 && (
          <AccordionItem value="item-2">
            <AccordionTrigger className="uppercase subHeading tracking-[1px]">
              KEY BENEFITS
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit.id}>{benefit.text}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Ingredients */}
        {ingredients && ingredients.length > 0 && (
          <AccordionItem value="item-3">
            <AccordionTrigger className="uppercase subHeading tracking-[1px]">
              INGREDIENTS
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.text}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* FAQ - Static for now */}
        <AccordionItem value="item-4">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            FAQ&apos;S
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">How do I use this product?</p>
                <p className="text-gray-600">
                  Follow the instructions provided on the product packaging.
                </p>
              </div>
              <div>
                <p className="font-semibold">What is the shelf life?</p>
                <p className="text-gray-600">
                  Please check the manufacturing date and best before date on the product.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetailsAccordian;
