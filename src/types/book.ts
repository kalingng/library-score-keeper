
export type CriteriaWeights = {
  price: number;
  publishYear: number;
  awards: number;
  relevance: number;
  condition: number;
  demand: number;
};

export type BookType = {
  id: string;
  title: string;
  author: string;
  publishYear: number;
  price: number;
  awards: number;
  relevance: number;
  condition: number;
  demand: number;
  scores: {
    price: number;
    publishYear: number;
    awards: number;
    relevance: number;
    condition: number;
    demand: number;
  };
  totalScore: number;
  date: Date;
};
