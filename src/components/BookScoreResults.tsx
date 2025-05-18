
import { useState, useEffect } from 'react';
import { BookType } from '@/types/book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen, Book, Edit, Timer, CircleMinus, Heart } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
  const [showDetails, setShowDetails] = useState(false);
  const [isAdjustingScores, setIsAdjustingScores] = useState(false);
  const [editedScores, setEditedScores] = useState<BookType['scores'] | null>(null);
  const [originalScores, setOriginalScores] = useState<BookType['scores'] | null>(null);

  useEffect(() => {
    if (book) {
      setOriginalScores({...book.scores});
    }
  }, [book?.id]);

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

  const getRecommendation = (score: number) => {
    if (score >= 8) return "Highly Recommended";
    if (score >= 6) return "Recommended";
    if (score >= 4) return "Consider";
    return "Not Recommended";
  };

  const getRecommendationClass = (score: number) => {
    if (score >= 8) return "bg-green-100 text-library-brown";
    if (score >= 6) return "bg-blue-100 text-library-brown";
    if (score >= 4) return "bg-yellow-100 text-library-brown";
    return "bg-red-100 text-library-brown";
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

  const handleScoreChange = (criterion: keyof BookType['scores'], value: number[]) => {
    if (editedScores) {
      setEditedScores({
        ...editedScores,
        [criterion]: value[0]
      });
    }
  };

  const handleSaveScores = () => {
    if (editedScores && onScoresUpdate) {
      onScoresUpdate(book.id, editedScores);
      setIsAdjustingScores(false);
      toast({
        title: "Scores updated",
        description: "The book's scores have been adjusted successfully"
      });
    }
  };
  
  const handleResetScores = () => {
    if (originalScores && onScoresUpdate) {
      onScoresUpdate(book.id, originalScores);
      toast({
        title: "Scores reset",
        description: "The book's scores have been reset to original values"
      });
      
      if (isAdjustingScores) {
        setEditedScores({...originalScores});
      }
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 vintage-card">
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
                    stroke={getSpectralColor(book.totalScore)} 
                    strokeWidth="10" 
                    strokeDasharray={`${book.totalScore * 28.27} 282.7`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: getSpectralColor(book.totalScore) }}
                >
                  <div className="text-center">
                    <span className="text-5xl font-bold text-white">{book.totalScore}</span>
                    <span className="text-sm font-medium block text-white">out of 10</span>
                  </div>
                </div>
              </div>
              
              <Badge className={`${getRecommendationClass(book.totalScore)} text-sm px-3 py-1`}>
                {getRecommendation(book.totalScore)}
              </Badge>

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

            {/* Criteria Scores with updated spectral theme */}
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium mb-2 text-library-brown">Criteria Scores</h3>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Affordable</span>
                  <span className="text-xs font-medium">{book.scores.price}/10</span>
                </div>
                <Slider 
                  value={[book.scores.price]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => {
                    if (onScoresUpdate) {
                      const updatedScores = {
                        ...book.scores,
                        price: value[0]
                      };
                      onScoresUpdate(book.id, updatedScores);
                    }
                  }}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How New</span>
                  <span className="text-xs font-medium">{book.scores.publishYear}/10</span>
                </div>
                <Slider 
                  value={[book.scores.publishYear]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2" 
                  onValueChange={(value) => {
                    if (onScoresUpdate) {
                      const updatedScores = {
                        ...book.scores,
                        publishYear: value[0]
                      };
                      onScoresUpdate(book.id, updatedScores);
                    }
                  }}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Good</span>
                  <span className="text-xs font-medium">{book.scores.averageRating}/10</span>
                </div>
                <Slider 
                  value={[book.scores.averageRating]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => {
                    if (onScoresUpdate) {
                      const updatedScores = {
                        ...book.scores,
                        averageRating: value[0]
                      };
                      onScoresUpdate(book.id, updatedScores);
                    }
                  }}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-library-brown">How Popular</span>
                  <span className="text-xs font-medium">{book.scores.goodreadsReviews}/10</span>
                </div>
                <Slider 
                  value={[book.scores.goodreadsReviews]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  className="h-2"
                  onValueChange={(value) => {
                    if (onScoresUpdate) {
                      const updatedScores = {
                        ...book.scores,
                        goodreadsReviews: value[0]
                      };
                      onScoresUpdate(book.id, updatedScores);
                    }
                  }}
                />
              </div>
              
              {/* Updated additional criteria with vintage styling */}
              <div className="mt-8 space-y-2 pt-4 border-t border-library-tan/40">
                <h3 className="text-sm font-medium text-library-brown">Additional Criteria</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Got any prize?</span>
                  <Badge variant={book.hasPrize ? "default" : "outline"} className={book.hasPrize ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}>
                    {book.hasPrize ? "Yes" : "No"}
                  </Badge>
                </div>
                
                {book.hasPrize && book.prizeDetails && (
                  <div className="bg-library-cream/60 p-2 rounded-md text-xs text-library-brown ml-4">
                    <Trophy className="inline h-3 w-3 mr-1" /> {book.prizeDetails}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Include JEDI?</span>
                  <Badge variant={book.hasJEDI ? "default" : "outline"} className={book.hasJEDI ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}>
                    {book.hasJEDI ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-library-brown">Not in other libraries?</span>
                  <Badge variant={book.notInOtherLibraries ? "default" : "outline"} className={book.notInOtherLibraries ? "bg-library-wood text-white" : "border-library-wood text-library-brown"}>
                    {book.notInOtherLibraries ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 vintage-card">
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

      {/* Score Adjustment Dialog */}
      <Dialog open={isAdjustingScores} onOpenChange={setIsAdjustingScores}>
        <DialogContent className="max-w-md vintage-paper">
          <DialogHeader>
            <DialogTitle className="text-library-brown">Adjust Scores Manually</DialogTitle>
            <DialogDescription>
              Move the sliders to adjust the individual scores for this book
            </DialogDescription>
          </DialogHeader>
          
          {editedScores && (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>How Affordable</span>
                  <span>{editedScores.price}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.price]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('price', value)} 
                />
                <div className="text-xs text-gray-500 grid grid-cols-6 w-full">
                  <span>&lt;£2</span>
                  <span>£2-8</span>
                  <span>£8-17</span>
                  <span>£17-23</span>
                  <span>£23-29</span>
                  <span>&gt;£29</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>How New</span>
                  <span>{editedScores.publishYear}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.publishYear]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('publishYear', value)} 
                />
                <div className="text-xs text-gray-500 grid grid-cols-6 w-full">
                  <span>0-1 yrs</span>
                  <span>1-4 yrs</span>
                  <span>4-10 yrs</span>
                  <span>10-14 yrs</span>
                  <span>14-18 yrs</span>
                  <span>&gt;18 yrs</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>How Good</span>
                  <span>{editedScores.averageRating}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.averageRating]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('averageRating', value)} 
                />
                <div className="text-xs text-gray-500 grid grid-cols-6 w-full">
                  <span>4.5-5.0</span>
                  <span>4.0-4.4</span>
                  <span>3.5-3.9</span>
                  <span>2.5-3.4</span>
                  <span>0.5-2.4</span>
                  <span>0.0</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>How Popular</span>
                  <span>{editedScores.goodreadsReviews}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.goodreadsReviews]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('goodreadsReviews', value)} 
                />
                <div className="text-xs text-gray-500 grid grid-cols-6 w-full">
                  <span>&gt;100k</span>
                  <span>50k-100k</span>
                  <span>10k-50k</span>
                  <span>1k-10k</span>
                  <span>11-1k</span>
                  <span>&lt;10</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAdjustingScores(false)}
              className="flex items-center"
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => {
                if (originalScores) {
                  setEditedScores({...originalScores});
                }
              }}
            >
              <Timer className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleSaveScores}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookScoreResults;
