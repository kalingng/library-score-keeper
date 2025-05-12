
import { BookType, CriteriaWeights } from '@/types/book';

// Default weights for criteria
export const defaultWeights: CriteriaWeights = {
  price: 1.5,
  publishYear: 1,
  awards: 1.2,
  relevance: 1.7,
  condition: 1,
  demand: 1.3,
};

/**
 * Calculate individual criteria scores
 */
export const calculateCriteriaScores = (book: Omit<BookType, 'id' | 'scores' | 'totalScore' | 'date'>) => {
  const currentYear = new Date().getFullYear();
  
  // Calculate scores for each criterion (0-10 scale)
  return {
    // Lower price is better (inverted score)
    price: price10Scale(book.price),
    
    // Newer books score higher
    publishYear: year10Scale(book.publishYear, currentYear),
    
    // More awards is better
    awards: awards10Scale(book.awards),
    
    // Direct scores from user input (already on 1-10 scale)
    relevance: book.relevance,
    condition: book.condition,
    demand: book.demand,
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
    (criteriaScores.awards * weights.awards) +
    (criteriaScores.relevance * weights.relevance) +
    (criteriaScores.condition * weights.condition) +
    (criteriaScores.demand * weights.demand);
  
  return +(weightedScore / weightSum).toFixed(1);
};

// Helper functions to convert raw values to 10-point scales
const price10Scale = (price: number): number => {
  // $0-100 range mapped to 0-10 scale, inverted so lower prices score higher
  if (price <= 0) return 10;
  if (price >= 100) return 0;
  return +(10 - (price / 10)).toFixed(1);
};

const year10Scale = (year: number, currentYear: number): number => {
  const age = currentYear - year;
  // 0-50 years old mapped to 10-0 scale
  if (age <= 0) return 10;
  if (age >= 50) return 0;
  return +((50 - age) / 5).toFixed(1);
};

const awards10Scale = (awards: number): number => {
  // 0-5 awards mapped to 0-10 scale
  if (awards <= 0) return 0;
  if (awards >= 5) return 10;
  return +(awards * 2).toFixed(1);
};
