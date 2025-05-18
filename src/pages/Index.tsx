
import { useState } from 'react';
import BookScoreResults from '@/components/BookScoreResults';
import BookHistory from '@/components/BookHistory';
import BookSearch from '@/components/BookSearch';
import BookFavourites from '@/components/BookFavourites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookType, BookSearchResult } from '@/types/book';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const Index = () => {
  const [scoredBooks, setScoredBooks] = useState<BookType[]>([]);
  const [favouriteBooks, setFavouriteBooks] = useState<BookType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("search");
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [selectedHistoryBook, setSelectedHistoryBook] = useState<BookType | null>(null);
  const [selectedFavouriteBook, setSelectedFavouriteBook] = useState<BookType | null>(null);
  const { toast } = useToast();

  // Define navigation handling functions
  const handlePrevious = () => {
    switch (activeTab) {
      case "search":
        // Already at first tab, do nothing or wrap around to last
        setActiveTab("history");
        break;
      case "results":
        setActiveTab("search");
        break;
      case "favourites":
        setActiveTab("results");
        break;
      case "history":
        setActiveTab("favourites");
        break;
    }
  };

  const handleNext = () => {
    switch (activeTab) {
      case "search":
        setActiveTab("results");
        break;
      case "results":
        setActiveTab("favourites");
        break;
      case "favourites":
        setActiveTab("history");
        break;
      case "history":
        // Already at last tab, do nothing or wrap around to first
        setActiveTab("search");
        break;
    }
  };

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
      scores: {
        price: calculatePriceScore(book.price),
        publishYear: calculatePublishYearScore(book.publishYear),
        averageRating: calculateAmazonRatingScore(book.averageRating),
        goodreadsReviews: calculateGoodreadsReviewsScore(book.goodreadsReviews),
        hasPrize: book.hasPrize ? 5 : 0,
        hasJEDI: book.hasJEDI ? 5 : 0,
        notInOtherLibraries: book.notInOtherLibraries ? 5 : 0,
      },
      totalScore: 0, // Will be calculated
      date: new Date(),
      imageUrl: book.imageUrl,
      averageRating: book.averageRating,
      goodreadsReviews: book.goodreadsReviews,
      category: book.category,
      isbn: book.isbn,
      publisher: book.publisher,
      hasPrize: book.hasPrize || false,
      prizeDetails: book.prizeDetails || "",
      hasJEDI: book.hasJEDI || false,
      notInOtherLibraries: book.notInOtherLibraries || false,
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

  const handleFavouriteBookSelected = (book: BookType) => {
    setSelectedFavouriteBook(book);
    setActiveTab("results");
  };
  
  const toggleFavourite = (book: BookType) => {
    const isFavourited = favouriteBooks.some(favBook => favBook.id === book.id);
    
    if (isFavourited) {
      setFavouriteBooks(prev => prev.filter(favBook => favBook.id !== book.id));
    } else {
      setFavouriteBooks(prev => [...prev, book]);
    }
  };
  
  // Helper function to check if a book is favourited
  const isBookFavourited = (bookId: string) => {
    return favouriteBooks.some(book => book.id === bookId);
  };

  // Helper function to calculate price score based on the provided criteria
  const calculatePriceScore = (price: number) => {
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
  
  // Helper function to calculate publish year score based on the provided criteria
  const calculatePublishYearScore = (year: number) => {
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
  
  // Helper function to calculate Amazon rating score based on the provided criteria
  const calculateAmazonRatingScore = (rating: number) => {
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
  };
  
  // Helper function to calculate Goodreads reviews score based on the provided criteria
  const calculateGoodreadsReviewsScore = (reviewCount: number) => {
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
  };
  
  // Updated function to calculate total score including new criteria
  const calculateTotalScore = (scores: BookType['scores']) => {
    const { price, publishYear, averageRating, goodreadsReviews, hasPrize, hasJEDI, notInOtherLibraries } = scores;
    
    // Calculate base score (average of the original 4 criteria)
    const baseScore = (price + publishYear + averageRating + goodreadsReviews) / 4;
    
    // Add bonus points for the new criteria (0 or 5 for each)
    const bonusPoints = (hasPrize + hasJEDI + notInOtherLibraries) / 7;
    
    // Calculate final score (capped at 10)
    let totalScore = baseScore + bonusPoints;
    if (totalScore > 10) totalScore = 10;
    
    return parseFloat(totalScore.toFixed(1));
  };

  // Function to update book scores
  const handleUpdateBookScores = (bookId: string, updatedScores: BookType['scores']) => {
    setScoredBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        const updatedBook = {
          ...book,
          scores: updatedScores,
        };
        // Recalculate total score
        updatedBook.totalScore = calculateTotalScore(updatedScores);
        return updatedBook;
      }
      return book;
    }));
  };

  // Add a handler for deleting books from history
  const handleDeleteBookFromHistory = (bookId: string) => {
    setScoredBooks(prev => prev.filter(book => book.id !== bookId));
    
    // If the deleted book is the selected book, clear the selection
    if (selectedHistoryBook && selectedHistoryBook.id === bookId) {
      setSelectedHistoryBook(null);
    }
    
    // Also remove from favorites if it exists there
    if (favouriteBooks.some(book => book.id === bookId)) {
      setFavouriteBooks(prev => prev.filter(book => book.id !== bookId));
      if (selectedFavouriteBook && selectedFavouriteBook.id === bookId) {
        setSelectedFavouriteBook(null);
      }
    }
    
    toast({
      title: "Book deleted",
      description: "The book has been removed from your history"
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-10 vintage-paper p-6 rounded-lg shadow-sm border border-library-tan/40">
          <h1 className="text-3xl md:text-4xl font-bold text-library-brown mb-2">Book Acquisition Scoring Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Evaluate books based on your criteria
            <br />
            to make informed acquisition decisions for your library.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-library-cream p-1 border border-library-tan/30 shadow-sm">
            <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:text-library-brown">Search Books</TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white data-[state=active]:text-library-brown">Results</TabsTrigger>
            <TabsTrigger value="favourites" className="data-[state=active]:bg-white data-[state=active]:text-library-brown">Favourites</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-library-brown">History</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="vintage-paper p-6 rounded-lg shadow-sm border border-library-tan/40">
            <BookSearch onSelectBook={handleBookSelected} />
          </TabsContent>

          <TabsContent value="results" className="vintage-paper p-6 rounded-lg shadow-sm border border-library-tan/40">
            <BookScoreResults 
              book={selectedFavouriteBook || selectedHistoryBook || (scoredBooks.length > 0 ? scoredBooks[scoredBooks.length - 1] : null)}
              onScoresUpdate={handleUpdateBookScores}
              onToggleFavourite={toggleFavourite}
              isFavourited={selectedHistoryBook ? isBookFavourited(selectedHistoryBook.id) : 
                            selectedFavouriteBook ? isBookFavourited(selectedFavouriteBook.id) : 
                            scoredBooks.length > 0 ? isBookFavourited(scoredBooks[scoredBooks.length - 1].id) : false}
            />
          </TabsContent>

          <TabsContent value="favourites" className="vintage-paper p-6 rounded-lg shadow-sm border border-library-tan/40">
            <BookFavourites 
              books={favouriteBooks} 
              onSelectBook={handleFavouriteBookSelected}
              onRemoveFromFavourites={(bookId) => {
                setFavouriteBooks(prev => prev.filter(book => book.id !== bookId));
                if (selectedFavouriteBook && selectedFavouriteBook.id === bookId) {
                  setSelectedFavouriteBook(null);
                }
                toast({
                  title: "Removed from favourites",
                  description: "The book has been removed from your favourites"
                });
              }}
            />
          </TabsContent>

          <TabsContent value="history" className="vintage-paper p-6 rounded-lg shadow-sm border border-library-tan/40">
            <BookHistory 
              books={scoredBooks} 
              onSelectBook={handleHistoryBookSelected}
              onDeleteBook={handleDeleteBookFromHistory}
            />
          </TabsContent>
        </Tabs>
        
        {/* Add navigation buttons at the bottom */}
        <div className="mt-6 max-w-4xl mx-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handlePrevious(); 
                  }}
                  className="border border-library-tan text-library-brown hover:bg-library-cream hover:text-library-wood"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleNext(); 
                  }}
                  className="border border-library-tan text-library-brown hover:bg-library-cream hover:text-library-wood"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Index;
