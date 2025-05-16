
export type CriteriaWeights = {
  price: number;
  publishYear: number;
  averageRating: number;
  goodreadsReviews: number;
  hasPrize: number;
  hasJEDI: number;
  notInOtherLibraries: number;
};

export type BookType = {
  id: string;
  title: string;
  author: string;
  publishYear: number;
  price: number;
  scores: {
    price: number;
    publishYear: number;
    averageRating: number;
    goodreadsReviews: number;
    hasPrize: number;
    hasJEDI: number;
    notInOtherLibraries: number;
  };
  totalScore: number;
  date: Date;
  imageUrl?: string | null;
  averageRating?: number;
  goodreadsReviews?: number;
  category?: string;
  isbn?: string;
  publisher?: string;
  hasPrize: boolean;
  prizeDetails?: string;
  hasJEDI: boolean;
  notInOtherLibraries: boolean;
};

export type BookSearchResult = {
  title: string;
  author: string;
  category: string;
  price: number;
  publishYear: number;
  averageRating: number;
  imageUrl: string | null;
  goodreadsReviews: number;
  isbn?: string;
  publisher?: string;
  hasPrize?: boolean;
  prizeDetails?: string;
  hasJEDI?: boolean;
  notInOtherLibraries?: boolean;
};
