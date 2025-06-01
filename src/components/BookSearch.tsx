import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, Loader2, ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookSearchResult } from "@/types/book";
import { searchAmazonBooks } from "@/utils/amazonApi";
import { useIsMobile } from '@/hooks/use-mobile';
import { BarcodeScanner } from './BarcodeScanner';

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

  const handleBarcodeScan = (isbn: string) => {
    setSearchTerm(isbn);
    handleSearchByBarcode(isbn);
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
            onClick={() => setIsScanningBarcode(true)}
            disabled={isLoading || isScanningBarcode}
            className="w-40 border-library-brown text-library-brown hover:bg-library-tan/50"
          >
            <ScanBarcode className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
        </div>
      </form>

      <BarcodeScanner
        isOpen={isScanningBarcode}
        onClose={() => setIsScanningBarcode(false)}
        onScan={handleBarcodeScan}
      />
      
      {searchResults.length > 0 && (
        <div className="grid gap-4">
          {searchResults.map((book, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:bg-library-tan/10 transition-colors"
              onClick={() => handleSelectBook(book)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-library-tan/20 rounded flex items-center justify-center">
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={book.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Book className="w-8 h-8 text-library-brown" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-library-brown">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">{book.publishYear}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">${book.price.toFixed(2)}</span>
                      {book.averageRating > 0 && (
                        <>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-yellow-600">{getRatingStars(book.averageRating)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
