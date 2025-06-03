import { useState, useEffect } from 'react';
import { BookType } from '@/types/book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen, Book, Timer, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';

type BookScoreResultsProps = {
  book: BookType | null;
  onScoresUpdate?: (bookId: string, scores: BookType['scores']) => void;
  onToggleFavourite?: (book: BookType) => void;
  isFavourited?: boolean;
};

const BookScoreResults = ({ book, onScoresUpdate, onToggleFavourite, isFavourited = false }: BookScoreResultsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentScores, setCurrentScores] = useState<BookType['scores'] | null>(null);
  const [originalScores, setOriginalScores] = useState<BookType['scores'] | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    if (book) {
      setOriginalScores({...book.scores});
      setCurrentScores({...book.scores});
      calculateTotalScore(book.scores);
    }
  }, [book?.id]);

  const calculateTotalScore = (scores: BookType['scores']) => {
    const { price, publishYear, averageRating, goodreadsReviews } = scores;
    // Add bonus points for additional criteria (1 point for each "Yes")
    const bonusPoints = [
      book.hasPrize ? 1 : 0,
      book.hasJEDI ? 1 : 0,
      book.notInOtherLibraries ? 1 : 0
    ].reduce((sum, points) => sum + points, 0);
    
    const total = (price + publishYear + averageRating + goodreadsReviews + bonusPoints) / 4;
    setTotalScore(Number(total.toFixed(1)));
  };

  const handleScoreChange = (criterion: keyof BookType['scores'], value: number[]) => {
    if (currentScores) {
      const updatedScores = {
        ...currentScores,
        [criterion]: value[0]
      };
      setCurrentScores(updatedScores);
      calculateTotalScore(updatedScores);
      
      if (onScoresUpdate) {
        onScoresUpdate(book.id, updatedScores);
        toast({
          title: "Score updated",
          description: `The ${criterion} score has been adjusted`
        });
      }
    }
  };

  const handleResetScores = () => {
    if (originalScores && onScoresUpdate) {
      onScoresUpdate(book.id, originalScores);
      setCurrentScores({...originalScores});
      // Reset the book's additional criteria to their original values
      if (book) {
        book.hasPrize = false;
        book.hasJEDI = false;
        book.notInOtherLibraries = false;
      }
      calculateTotalScore(originalScores);
      toast({
        title: "Scores reset",
        description: "The book's scores have been reset to original values"
      });
    }
  };
  
  const handleFavouriteToggle = () => {
    if (onToggleFavourite && book) {
      onToggleFavourite(book);
      toast({
        title: isFavourited ? "Removed from favourites" : "Added to favourites",
        description: isFavourited ? 
          "The book has been removed from your favourites" : 
          "The book has been added to your favourites"
      });
    }
  };

  const handleToggleCriteria = (criteria: 'hasPrize' | 'hasJEDI' | 'notInOtherLibraries') => {
    if (book) {
      // Immediately update the book's state
      book[criteria] = !book[criteria];
      
      if (onScoresUpdate) {
        onScoresUpdate(book.id, book.scores);
        calculateTotalScore(book.scores);
        toast({
          title: "Criteria updated",
          description: `${criteria === 'hasPrize' ? 'Prize' : criteria === 'hasJEDI' ? 'JEDI' : 'Library availability'} status has been updated to ${book[criteria] ? 'Yes' : 'No'}`
        });
      }
    }
  };

  if (!book) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-library-brown">No book evaluated yet</h3>
        <p className="text-gray-600 mt-2">Search for a book and click on it to see results here</p>
      </div>
    );
  }

  // Spectral color palette from the attached image (10 colors from grey to burgundy)
  const spectralColorPalette = [
    "#CCCCCC", // Score 0: Grey (lowest)
    "#E06666", // Score 1: Pink-Red
    "#E67C43", // Score 2: Orange-Red
    "#F1C232", // Score 3: Orange-Yellow
    "#FFD966", // Score 4: Yellow
    "#DFF2A9", // Score 5: Light Green-Yellow
    "#9FC686", // Score 6: Light Green
    "#76A5AF", // Score 7: Teal
    "#6D9EEB", // Score 8: Blue
    "#9E1C47"  // Score 9-10: Burgundy/Red (highest)
  ];
  
  const getSpectralColor = (score: number) => {
    // Calculate which color to use based on the value
    const colorIndex = Math.min(9, Math.floor((score / 10) * 10));
    return spectralColorPalette[colorIndex];
  };
  
  const getScoreBackgroundColor = (score: number) => {
    // Use a more muted vintage paper look
    return "rgba(247, 242, 234, 0.8)";
  };

  // Updated recommendation logic with new labels
  const getRecommendation = (score: number) => {
    if (score >= 9) return "Must buy!!";
    if (score >= 8) return "Should buy!";
    if (score >= 7) return "Nice to have";
    if (score >= 5) return "May consider";
    if (score >= 3) return "Optional";
    return "Not necessary";
  };

  // Updated badge style for more obvious recommendation
  const getRecommendationClass = (score: number) => {
    if (score >= 9) return "bg-green-700 text-white text-lg font-extrabold px-6 py-3 shadow-lg animate-pulse";
    if (score >= 8) return "bg-green-500 text-white text-lg font-bold px-5 py-2 shadow-md";
    if (score >= 7) return "bg-blue-400 text-white text-base font-semibold px-4 py-2";
    if (score >= 5) return "bg-yellow-400 text-gray-900 text-base font-semibold px-4 py-2";
    if (score >= 3) return "bg-orange-300 text-gray-900 text-base font-semibold px-4 py-2";
    return "bg-gray-400 text-white text-base font-semibold px-4 py-2";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-white shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-library-brown">Overall Score</CardTitle>
                <CardDescription>Based on all criteria</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleFavouriteToggle}
                title={isFavourited ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavourited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="absolute w-32 h-32" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#f1f1f1" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={getSpectralColor(totalScore)} 
                    strokeWidth="10" 
                    strokeDasharray={`${totalScore * 28.27} 282.7`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: "#E6F3FF" }}
                >
                  <div className="text-center">
                    <span className="text-5xl font-bold text-library-brown">{totalScore}</span>
                    <span className="text-sm font-medium block text-library-brown">out of 10</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center mt-2">
                <span className="uppercase tracking-wider text-xs text-library-wood font-bold mb-1">Recommendation</span>
                <Badge className={getRecommendationClass(totalScore)}>
                  {getRecommendation(totalScore)}
                </Badge>
              </div>

              <div className="flex gap-2 mt-4 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-library-wood text-library-brown hover:bg-library-cream hover:text-library-wood"
                  onClick={handleResetScores}
                >
                  <Timer className="h-4 w-4 mr-2" /> Reset
                </Button>
              </div>
            </div>

            {/* Criteria Scores with adjustable sliders */}
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium mb-2 text-library-brown">Criteria Scores</h3>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Affordable</span>
                  <span className="text-xs font-medium">{currentScores?.price || book.scores.price}/10</span>
                </div>
                <Slider 
                  value={[currentScores?.price || book.scores.price]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => handleScoreChange('price', value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How New</span>
                  <span className="text-xs font-medium">{currentScores?.publishYear || book.scores.publishYear}/10</span>
                </div>
                <Slider 
                  value={[currentScores?.publishYear || book.scores.publishYear]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2" 
                  onValueChange={(value) => handleScoreChange('publishYear', value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Good</span>
                  <span className="text-xs font-medium">{currentScores?.averageRating || book.scores.averageRating}/10</span>
                </div>
                <Slider 
                  value={[currentScores?.averageRating || book.scores.averageRating]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => handleScoreChange('averageRating', value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Popular</span>
                  <span className="text-xs font-medium">{currentScores?.goodreadsReviews || book.scores.goodreadsReviews}/10</span>
                </div>
                <Slider 
                  value={[currentScores?.goodreadsReviews || book.scores.goodreadsReviews]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => handleScoreChange('goodreadsReviews', value)}
                />
              </div>
              
              {/* Additional criteria section */}
              <div className="mt-8 space-y-2 pt-4 border-t border-library-tan/40">
                <h3 className="text-sm font-medium text-library-brown">Additional Criteria</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Got any prize?</span>
                  <Button
                    variant={book.hasPrize ? "default" : "outline"}
                    size="sm"
                    className={book.hasPrize ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}
                    onClick={() => handleToggleCriteria('hasPrize')}
                  >
                    {book.hasPrize ? "Yes" : "No"}
                  </Button>
                </div>
                
                {book.hasPrize && book.prizeDetails && (
                  <div className="bg-library-cream/60 p-2 rounded-md text-xs text-library-brown ml-4">
                    <Trophy className="inline h-3 w-3 mr-1" /> {book.prizeDetails}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Include JEDI?</span>
                  <Button
                    variant={book.hasJEDI ? "default" : "outline"}
                    size="sm"
                    className={book.hasJEDI ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}
                    onClick={() => handleToggleCriteria('hasJEDI')}
                  >
                    {book.hasJEDI ? "Yes" : "No"}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Not in other libraries?</span>
                  <Button
                    variant={book.notInOtherLibraries ? "default" : "outline"}
                    size="sm"
                    className={book.notInOtherLibraries ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}
                    onClick={() => handleToggleCriteria('notInOtherLibraries')}
                  >
                    {book.notInOtherLibraries ? "Yes" : "No"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-library-brown">Book Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover Image */}
              <div className="flex justify-center">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={`Cover of ${book.title}`} 
                    className="h-64 object-contain rounded-md shadow-sm border border-library-tan/40"
                  />
                ) : (
                  <div className="h-64 w-48 bg-library-cream flex items-center justify-center rounded-md border border-library-tan/40">
                    <Book className="h-16 w-16 text-library-wood" />
                  </div>
                )}
              </div>
              
              {/* Book Information */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <p className="text-sm text-library-wood">Title</p>
                    <p className="font-medium text-library-brown">{book.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Author</p>
                    <p className="font-medium text-library-brown">{book.author}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Genre</p>
                    <p className="font-medium text-library-brown">{book.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-library-wood">ISBN</p>
                    <p className="font-medium text-library-brown">{book.isbn || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Publisher</p>
                    <p className="font-medium text-library-brown">{book.publisher || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Publication Year</p>
                    <p className="font-medium text-library-brown">{book.publishYear}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Price</p>
                    <p className="font-medium text-library-brown">${book.price.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Rating from Amazon</p>
                    <p className="text-amber-500 font-medium">
                      {getRatingStars(book.averageRating || 0)} ({book.averageRating || "N/A"})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-library-wood">Number of reviews on Goodreads</p>
                    <p className="font-medium text-library-wood">
                      {book.goodreadsReviews?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="bg-white hover:bg-library-cream border-library-wood text-library-brown hover:text-library-wood"
                onClick={() => {
                  toast({
                    title: "Score details copied",
                    description: "Book evaluation details copied to clipboard"
                  });
                }}
              >
                Copy Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookScoreResults;
