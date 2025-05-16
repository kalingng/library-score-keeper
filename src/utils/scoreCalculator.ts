
import { BookType, CriteriaWeights } from '@/types/book';

/**
 * The weights for each scoring criterion
 * These determine the importance of each factor in the final score
 */
export const CRITERIA_WEIGHTS: CriteriaWeights = {
  price: 1.0,
  publishYear: 1.0,
  averageRating: 1.0,
  goodreadsReviews: 1.0,
  hasPrize: 1.0,
  hasJEDI: 1.0,
  notInOtherLibraries: 1.0
};

/**
 * Calculate scores for each criterion based on book data
 * @param bookData Book information to score
 * @returns Object containing scores for each criterion
 */
export const calculateCriteriaScores = (
  bookData: Omit<BookType, 'id' | 'date' | 'scores' | 'totalScore'>
) => {
  // Price score - Higher score for lower prices
  const priceScore = calculatePriceScore(bookData.price);
  
  // Publication year score - Higher score for newer books
  const publishYearScore = calculatePublishYearScore(bookData.publishYear);
  
  // Amazon rating score - Higher score for better ratings
  const averageRatingScore = calculateAmazonRatingScore(bookData.averageRating || 0);
  
  // Goodreads reviews score - Higher score for more popular books
  const goodreadsReviewsScore = calculateGoodreadsReviewsScore(bookData.goodreadsReviews || 0);
  
  // New criteria - binary scores (0 or 5)
  const hasPrizeScore = bookData.hasPrize ? 5 : 0;
  const hasJEDIScore = bookData.hasJEDI ? 5 : 0;
  const notInOtherLibrariesScore = bookData.notInOtherLibraries ? 5 : 0;
  
  return {
    price: priceScore,
    publishYear: publishYearScore,
    averageRating: averageRatingScore,
    goodreadsReviews: goodreadsReviewsScore,
    hasPrize: hasPrizeScore,
    hasJEDI: hasJEDIScore,
    notInOtherLibraries: notInOtherLibrariesScore
  };
};

/**
 * Calculate the total score based on all criteria scores and their weights
 * @param scores Object containing scores for each criterion
 * @returns Number representing the overall score (0-10)
 */
export const calculateTotalScore = (scores: BookType['scores']) => {
  // Calculate weighted sum of the original criteria
  const weightedSum = 
    scores.price * CRITERIA_WEIGHTS.price +
    scores.publishYear * CRITERIA_WEIGHTS.publishYear +
    scores.averageRating * CRITERIA_WEIGHTS.averageRating +
    scores.goodreadsReviews * CRITERIA_WEIGHTS.goodreadsReviews;
  
  // Calculate base score (average of the original 4 criteria)
  const baseScore = weightedSum / 4;
  
  // Add bonus points for the new criteria (0 or 5 for each)
  const bonusPoints = (scores.hasPrize + scores.hasJEDI + scores.notInOtherLibraries) / 7;
  
  // Calculate final score (capped at 10)
  let totalScore = baseScore + bonusPoints;
  if (totalScore > 10) totalScore = 10;
  
  return parseFloat(totalScore.toFixed(1));
};

/**
 * Helper functions for calculating individual criteria scores
 */
function calculatePriceScore(price: number) {
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
}

function calculatePublishYearScore(year: number) {
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
}

function calculateAmazonRatingScore(rating: number) {
  if (!rating) return 5; // Default value if no rating available
  
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
}

function calculateGoodreadsReviewsScore(reviewCount: number) {
  if (!reviewCount) return 5; // Default value if no review count available
  
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
}
