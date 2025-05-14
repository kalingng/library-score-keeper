
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BookSearchResult = {
  title: string;
  author: string;
  category: string;
  price: number;
  publishYear: number;
  averageRating: number;
  imageUrl: string | null;
};

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const { toast } = useToast();

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
      // Mock API call - in a real application, this would be replaced with an actual API call
      // We're simulating network delay with setTimeout
      setTimeout(() => {
        // Mock data based on search term
        const mockResults: BookSearchResult[] = [
          {
            title: `${searchTerm} - A Complete Guide`,
            author: "Jane Smith",
            category: "Non-fiction",
            price: 24.99,
            publishYear: 2022,
            averageRating: 4.5,
            imageUrl: null
          },
          {
            title: `The Art of ${searchTerm}`,
            author: "John Doe",
            category: "Education",
            price: 19.95,
            publishYear: 2021,
            averageRating: 4.2,
            imageUrl: null
          },
          {
            title: `${searchTerm}: A Modern Perspective`,
            author: "Emily Johnson",
            category: "Academic",
            price: 32.50,
            publishYear: 2023,
            averageRating: 4.7,
            imageUrl: null
          }
        ];
        
        setSearchResults(mockResults);
        setIsLoading(false);
        
        toast({
          title: "Search completed",
          description: `Found ${mockResults.length} books matching "${searchTerm}"`,
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error searching books",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive"
      });
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
        <h2 className="text-2xl font-bold text-blue-800">Book Search</h2>
        <p className="text-gray-600">Search for books by title or keywords to get details</p>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Enter book title or keywords..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
      
      {searchResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((book, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-blue-50 pb-2">
                <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <span className="text-sm">{book.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Price:</span>
                    <span className="text-sm">${book.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Published:</span>
                    <span className="text-sm">{book.publishYear}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Rating:</span>
                    <span className="text-amber-500 text-sm font-medium">
                      {getRatingStars(book.averageRating)} ({book.averageRating})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchResults.length === 0 && !isLoading && searchTerm.length > 0 && (
        <div className="text-center py-10">
          <Book className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-600">No books found</h3>
          <p className="text-gray-500">Try different keywords or broaden your search</p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
