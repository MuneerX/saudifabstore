"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
 {
    id: 1,
    name: "Midnight Oud",
    description: "A luxurious blend of agarwood and spices",
    price: "$120.00",
    originalPrice: "$150.00",
    discount: "20% Off",
    image: "https://placehold.co/300x300",
  },
  {
    id: 2,
    name: "Rose Noir",
    description: "Dark roses with a hint of vanilla",
    price: "$95.00",
    originalPrice: "$110.00",
    discount: "14% Off",
    image: "https://placehold.co/300x300",
  },
  {
    id: 3,
    name: "Ocean Breeze",
    description: "Fresh marine notes with citrus",
    price: "$85.00",
    originalPrice: "$100.00",
    discount: "15% Off",
    image: "https://placehold.co/300x300",
  },
  {
    id: 4,
    name: "Amber Mystique",
    description: "Warm amber with exotic spices",
    price: "$110.00",
    originalPrice: "$130.00",
    discount: "15% Off",
    image: "https://placehold.co/300x300",
  },
];

export function FeaturedProducts() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Products
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our most popular fragrances, crafted with premium ingredients.
            </p>
          </div>
          <Button variant="outline">View All Products</Button>
        </div>
        <div className="grid gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  alt={product.name}
                  className="object-cover w-full h-60"
                  height={300}
                  src={product.image}
                  width={300}
                />
                <Badge className="absolute top-2 right-2 bg-red-500">
                  {product.discount}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}