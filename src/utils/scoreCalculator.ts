
import { BookType, CriteriaWeights } from '@/types/book';

// Default weights for criteria
export const defaultWeights: CriteriaWeights = {
  price: 1.5,
  publishYear: 1.0,
  averageRating: 1.2,
  goodreadsReviews: 1.3,
};

/**
 * Calculate individual criteria scores
 */
export const calculateCriteriaScores = (book: Omit<BookType, 'id' | 'scores' | 'totalScore' | 'date'>) => {
  // Calculate scores for each criterion (0-10 scale)
  return {
    // Price scoring (lower is better)
    price: calculatePriceScore(book.price),
    
    // Publication year scoring (newer is better)
    publishYear: calculatePublishYearScore(book.publishYear),
    
    // Amazon rating scoring
    averageRating: calculateAmazonRatingScore(book.averageRating || 0),
    
    // Goodreads reviews scoring
    goodreadsReviews: calculateGoodreadsReviewsScore(book.goodreadsReviews || 0),
  };
};

/**
 * Calculate final weighted score
 */
export const calculateTotalScore = (
  criteriaScores: BookType['scores'],
  weights: CriteriaWeights = defaultWeights
) => {
  const weightSum = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  const weightedScore = 
    (criteriaScores.price * weights.price) +
    (criteriaScores.publishYear * weights.publishYear) +
    (criteriaScores.averageRating * weights.averageRating) +
    (criteriaScores.goodreadsReviews * weights.goodreadsReviews);
  
  return +(weightedScore / weightSum).toFixed(1);
};

// Helper functions to convert raw values to 10-point scales
const calculatePriceScore = (price: number): number => {
  // Convert price to pounds if needed (assuming price is in dollars)
  const priceInPounds = price * 0.8; // Approximate USD to GBP conversion
  
  if (priceInPounds < 2) return 10;
  if (priceInPounds < 5) return 9;
  if (priceInPounds < 8) return 8;
  if (priceInPounds < 11) return 7;
  if (priceInPounds < 14) return 6;
  if (priceInPounds < 17) return 5;
  if (priceInPounds < 20) return 4;
  if (priceInPounds < 23) return 3;
  if (priceInPounds < 26) return 2;
  if (priceInPounds < 29) return 1;
  return 0; // Over £29
};

const calculatePublishYearScore = (year: number): number => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;
  
  if (yearsAgo <= 1) return 10;
  if (yearsAgo <= 2) return 9;
  if (yearsAgo <= 4) return 8;
  if (yearsAgo <= 6) return 7;
  if (yearsAgo <= 8) return 6;
  if (yearsAgo <= 10) return 5;
  if (yearsAgo <= 12) return 4;
  if (yearsAgo <= 14) return 3;
  if (yearsAgo <= 16) return 2;
  if (yearsAgo <= 18) return 1;
  return 0; // Over 18 years ago
};

const calculateAmazonRatingScore = (rating: number): number => {
  if (rating >= 4.5) return 10;
  if (rating >= 4.0) return 9;
  if (rating >= 3.5) return 8;
  if (rating >= 3.0) return 7;
  if (rating >= 2.5) return 6;
  if (rating >= 2.0) return 5;
  if (rating >= 1.5) return 4;
  if (rating >= 1.0) return 3;
  if (rating >= 0.5) return 2;
  if (rating > 0.0) return 1; // Rating between 0.1-0.4
  return 0; // Rating 0.0
};

const calculateGoodreadsReviewsScore = (reviewCount: number): number => {
  if (reviewCount > 100000) return 10;
  if (reviewCount > 50000) return 9;
  if (reviewCount > 10000) return 8;
  if (reviewCount > 5000) return 7;
  if (reviewCount > 1000) return 6;
  if (reviewCount > 500) return 5;
  if (reviewCount > 250) return 4;
  if (reviewCount > 100) return 3;
  if (reviewCount > 50) return 2;
  if (reviewCount > 10) return 1;
  return 0; // 0-10 reviews
};
