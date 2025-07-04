import { Product } from "./types";

export const featuredProducts: Product[] = [
  {
    id: "prod1",
    name: "Premium Quality Shilajit",
    price: 1998,
    discountPercentage: 55,
    shortDescription:
      "Shilajit is a natural substance that is found in the Himalayas. It is a dark, tar-like substance that is found in the rocks of the Himalayas. It is a natural substance that is found in the Himalayas. It is a natural substance that is found in the Himalayas.",
    fullDescription:
      "Shilajit is rich in nutrients such as mineral salts, amino acids, and other organic components including benzoic acid, hippuric acid, fatty acids (myristic acid, stearic acid, oleic acid, petroselinic acid, linoleic acid, lauric acid, saturated fatty acids), ichthyridine, salicylic acid, resins, triterpenes, sterols, aromatic carboxylic acids, 3,4-benzocoumarins, amino groups acids, phenolic lipids, latex, albumin, sterols, tea polyphenols, phenolic lipids, dibenzo-alpha-pyrones (DBP), and dibenzo-α-pyrone chromoproteins (DCPs).",
    images: [
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
      "/images/6.png",
      "/images/7.png",
      "/images/8.png",
    ],
    category: "cat2",
    tags: ["Shilajit", "mineral salts", "organic components"],
    reviewCount: 89,
    rating: 4.7,
    availableUnits: 20,
    featured: true,
  },
  {
    id: "prod2",
    name: "Shaastrayog Narsingh Prash Testobooster",
    price: 1998,
    discountPercentage: 35,
    shortDescription: "Improves Overall Health",
    fullDescription:
      "Narsingh Prash is a classical Ayurvedic recipe designed to enhance both overall and sexual health. Its unique blend of natural ingredients offers a multitude of benefits: Improves Overall Health Narsingh prash supports holistic well-being by enhancing bodily functions and boosting immunity.Rejuvenates Cells and Tissues.",
    images: ["/images/16.png"],
    category: "cat1",
    tags: ["Narsingh Prash", "Ayurvedic", "sexual health"],
    reviewCount: 124,
    rating: 4.8,
    availableUnits: 0,
    featured: true,
  },
];

export const allProducts: Product[] = [...featuredProducts];
