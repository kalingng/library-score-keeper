
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, Loader2, ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookSearchResult } from "@/types/book";
import { searchAmazonBooks } from "@/utils/amazonApi";
import { useIsMobile } from '@/hooks/use-mobile';

interface BookSearchProps {
  onSelectBook?: (book: BookSearchResult) => void;
}

const BookSearch = ({ onSelectBook }: BookSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Search term required",
        description: "Please enter a book title or keywords to search",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Amazon API search function
      const results = await searchAmazonBooks(searchTerm);
      
      setSearchResults(results);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} books matching "${searchTerm}"`,
      });
    } catch (error) {
      toast({
        title: "Error searching books",
        description: "There was a problem connecting to the Amazon Product API. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScanning = () => {
    setIsScanningBarcode(true);
    
    // In a real implementation, this would access the device camera
    // and use a barcode scanning library
    toast({
      title: "Scanning barcode",
      description: "Please position the barcode in the center of the camera view"
    });
    
    // Simulate a barcode scan after 2 seconds
    setTimeout(() => {
      // This is where you'd implement actual barcode scanning logic
      // For now we'll just simulate finding a book with a specific ISBN
      setSearchTerm("9781234567897");
      handleSearchByBarcode("9781234567897");
      setIsScanningBarcode(false);
    }, 2000);
  };
  
  const handleSearchByBarcode = async (isbn: string) => {
    setIsLoading(true);
    
    try {
      // Call the Amazon API search function with the ISBN
      const results = await searchAmazonBooks(isbn);
      
      setSearchResults(results);
      
      toast({
        title: "Book found",
        description: `Found book with ISBN: ${isbn}`,
      });
    } catch (error) {
      toast({
        title: "Error finding book",
        description: "Could not find a book with this barcode. Please try again or search by title.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (book: BookSearchResult) => {
    if (onSelectBook) {
      onSelectBook(book);
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (halfStar) {
      stars.push('½');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return stars.join('');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-library-brown">Book Search</h2>
      </div>
      
      <form onSubmit={handleSearch} className="flex flex-col gap-4 bg-white/90 p-6 rounded-lg shadow-sm border border-library-tan/50">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-library-brown" />
          <Input
            type="text"
            placeholder="Enter book title or keywords..."
            className="pl-8 border-library-tan bg-library-paper"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || isScanningBarcode}
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            type="submit" 
            disabled={isLoading || isScanningBarcode}
            className="w-40 bg-library-brown hover:bg-library-darkBrown"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={handleBarcodeScanning}
            disabled={isLoading || isScanningBarcode}
            className="w-40 border-library-brown text-library-brown hover:bg-library-tan/50"
          >
            {isScanningBarcode ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ScanBarcode className="mr-2 h-4 w-4" />
                Scan Barcode
              </>
            )}
          </Button>
        </div>
      </form>
      
      {searchResults.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((book, index) => (
            <Card 
              key={index} 
              className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer border-library-tan/50"
              onClick={() => handleSelectBook(book)}
            >
              <CardHeader className="bg-library-cream pb-2 border-b border-library-tan/30">
                <CardTitle className="text-lg leading-tight line-clamp-2 text-library-darkBrown">{book.title}</CardTitle>
                <p className="text-sm text-library-brown">by {book.author}</p>
              </CardHeader>
              <CardContent className="pt-4 bg-white">
                <div className="flex flex-col space-y-4">
                  {/* Book Cover Image */}
                  <div className="flex justify-center">
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={`Cover of ${book.title}`} 
                        className="h-48 object-contain rounded-md shadow-md border border-library-tan/50"
                      />
                    ) : (
                      <div className="h-48 w-32 bg-library-paper flex items-center justify-center rounded-md border border-library-tan/50">
                        <Book className="h-12 w-12 text-library-brown/60" />
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="grid grid-cols-2 gap-2 bg-library-cream/50 p-3 rounded-md">
                    <div className="text-sm font-medium text-library-darkBrown">Genre:</div>
                    <div className="text-sm text-library-brown">{book.category}</div>
                    
                    <div className="text-sm font-medium text-library-darkBrown">Price:</div>
                    <div className="text-sm text-library-brown">${book.price.toFixed(2)}</div>
                    
                    <div className="text-sm font-medium text-library-darkBrown">Published:</div>
                    <div className="text-sm text-library-brown">{book.publishYear}</div>
                    
                    <div className="text-sm font-medium text-library-darkBrown">Rating:</div>
                    <div className="text-amber-700 text-sm font-medium">
                      {getRatingStars(book.averageRating)} ({book.averageRating})
                    </div>
                    
                    <div className="text-sm font-medium text-library-darkBrown">Reviews:</div>
                    <div className="text-sm font-medium text-library-burgundy">
                      {book.goodreadsReviews.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchResults.length === 0 && !isLoading && searchTerm.length > 0 && (
        <div className="text-center py-10 bg-white/90 rounded-lg shadow-sm border border-library-tan/30">
          <Book className="mx-auto h-12 w-12 text-library-tan" />
          <h3 className="mt-4 text-lg font-medium text-library-darkBrown">No books found</h3>
          <p className="text-library-brown">Try different keywords or broaden your search</p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
