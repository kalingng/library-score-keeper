
import { useState } from 'react';
import BookScoreResults from '@/components/BookScoreResults';
import BookHistory from '@/components/BookHistory';
import BookSearch from '@/components/BookSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookType, BookSearchResult } from '@/types/book';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [scoredBooks, setScoredBooks] = useState<BookType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("search");
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [selectedHistoryBook, setSelectedHistoryBook] = useState<BookType | null>(null);

  const handleBookScored = (book: BookType) => {
    setScoredBooks(prev => [...prev, book]);
  };

  const handleBookSelected = (book: BookSearchResult) => {
    setSelectedBook(book);
    
    // Create a new BookType object from the search result
    const newBook: BookType = {
      id: uuidv4(),
      title: book.title,
      author: book.author,
      publishYear: book.publishYear,
      price: book.price,
      awards: 0, // Default value
      relevance: 5, // Default value
      condition: 5, // Default value
      demand: 5, // Default value
      scores: {
        price: calculatePriceScore(book.price),
        publishYear: calculatePublishYearScore(book.publishYear),
        awards: 0, // Default value
        relevance: 5, // Default value
        condition: 5, // Default value
        demand: 5, // Default value
      },
      totalScore: 0, // Will be calculated
      date: new Date(),
      imageUrl: book.imageUrl,
      averageRating: book.averageRating,
      goodreadsReviews: book.goodreadsReviews,
      category: book.category,
      isbn: book.isbn,
      publisher: book.publisher
    };
    
    // Calculate total score
    newBook.totalScore = calculateTotalScore(newBook.scores);
    
    // Add the book to scored books
    setScoredBooks(prev => [...prev, newBook]);
    
    // Switch to the results tab
    setActiveTab("results");
  };

  const handleHistoryBookSelected = (book: BookType) => {
    setSelectedHistoryBook(book);
    setActiveTab("results");
  };
  
  // Helper function to calculate price score
  const calculatePriceScore = (price: number) => {
    if (price <= 10) return 9;
    if (price <= 20) return 7;
    if (price <= 30) return 5;
    if (price <= 40) return 3;
    return 1;
  };
  
  // Helper function to calculate publish year score
  const calculatePublishYearScore = (year: number) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age <= 1) return 10;
    if (age <= 3) return 8;
    if (age <= 5) return 6;
    if (age <= 10) return 4;
    return 2;
  };
  
  // Helper function to calculate total score
  const calculateTotalScore = (scores: any) => {
    const { price, publishYear, awards, relevance, condition, demand } = scores;
    const total = (price + publishYear + awards + relevance + condition + demand) / 6;
    return parseFloat(total.toFixed(1));
  };

  // Function to update book scores
  const handleUpdateBookScores = (bookId: string, updatedScores: BookType['scores']) => {
    setScoredBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        const updatedBook = {
          ...book,
          scores: updatedScores,
          // Update individual score properties
          awards: updatedScores.awards,
          relevance: updatedScores.relevance,
          condition: updatedScores.condition,
          demand: updatedScores.demand
        };
        // Recalculate total score
        updatedBook.totalScore = calculateTotalScore(updatedScores);
        return updatedBook;
      }
      return book;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Book Acquisition Scoring Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Evaluate books based on multiple criteria to make informed acquisition decisions for your library.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Books</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-6 bg-white rounded-lg shadow-md">
            <BookSearch onSelectBook={handleBookSelected} />
          </TabsContent>

          <TabsContent value="results" className="p-6 bg-white rounded-lg shadow-md">
            <BookScoreResults 
              book={selectedHistoryBook || (scoredBooks.length > 0 ? scoredBooks[scoredBooks.length - 1] : null)}
              onScoresUpdate={handleUpdateBookScores}
            />
          </TabsContent>

          <TabsContent value="history" className="p-6 bg-white rounded-lg shadow-md">
            <BookHistory 
              books={scoredBooks} 
              onSelectBook={handleHistoryBookSelected}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
