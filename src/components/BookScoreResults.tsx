import { useState, useEffect } from 'react';
import { BookType } from '@/types/book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen, Book, Edit, Timer, CircleMinus } from 'lucide-react';
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

type BookScoreResultsProps = {
  book: BookType | null;
  onScoresUpdate?: (bookId: string, scores: BookType['scores']) => void;
};

const BookScoreResults = ({ book, onScoresUpdate }: BookScoreResultsProps) => {
  const { toast } = useToast();
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
        <h3 className="text-xl font-medium text-gray-600">No book evaluated yet</h3>
        <p className="text-gray-500 mt-2">Search for a book and click on it to see results here</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getScoreBackgroundColor = (score: number) => {
    if (score >= 8) return "#FFDEE2"; // Soft pink for high scores
    if (score >= 6) return "#FFE8BE"; // Soft yellow for good scores
    if (score >= 4) return "#E3F2FD"; // Light blue for medium scores
    return "#D3E4FD"; // Softer blue for low scores
  };

  const getRecommendation = (score: number) => {
    if (score >= 8) return "Highly Recommended";
    if (score >= 6) return "Recommended";
    if (score >= 4) return "Consider";
    return "Not Recommended";
  };

  const getRecommendationClass = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-blue-100 text-blue-800";
    if (score >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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

  const handleAdjustScores = () => {
    setEditedScores({ ...book.scores });
    setIsAdjustingScores(true);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Based on all criteria</CardDescription>
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
                    stroke={getScoreColor(book.totalScore)} 
                    strokeWidth="10" 
                    strokeDasharray={`${book.totalScore * 28.27} 282.7`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: getScoreBackgroundColor(book.totalScore) }}
                >
                  <div className="text-center">
                    <span className="text-5xl font-bold">{book.totalScore}</span>
                    <span className="text-sm font-medium block">out of 10</span>
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
                  className="flex-1"
                  onClick={handleAdjustScores}
                >
                  <Edit className="h-4 w-4 mr-2" /> Adjust
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleResetScores}
                >
                  <Timer className="h-4 w-4 mr-2" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover Image */}
              <div className="flex justify-center">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={`Cover of ${book.title}`} 
                    className="h-64 object-contain rounded-md shadow-sm"
                  />
                ) : (
                  <div className="h-64 w-48 bg-gray-100 flex items-center justify-center rounded-md">
                    <Book className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Book Information */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{book.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium">{book.author}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Genre</p>
                    <p className="font-medium">{book.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium">{book.isbn || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Publisher</p>
                    <p className="font-medium">{book.publisher || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Publication Year</p>
                    <p className="font-medium">{book.publishYear}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${book.price.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Rating from Amazon</p>
                    <p className="text-amber-500 font-medium">
                      {getRatingStars(book.averageRating || 0)} ({book.averageRating || "N/A"})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Number of reviews on Goodreads</p>
                    <p className="font-medium text-purple-600">
                      {book.goodreadsReviews?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            Criteria Scores
          </CardTitle>
          <CardDescription>Individual scores for each evaluation criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Price Value</span>
                <span className="text-sm font-medium">{book.scores.price}/10</span>
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
                <span className="text-sm font-medium">Publication Recency</span>
                <span className="text-sm font-medium">{book.scores.publishYear}/10</span>
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
                <span className="text-sm font-medium">Awards Recognition</span>
                <span className="text-sm font-medium">{book.scores.awards}/10</span>
              </div>
              <Slider 
                value={[book.scores.awards]} 
                min={0} 
                max={10} 
                step={1} 
                className="h-2"
                onValueChange={(value) => {
                  if (onScoresUpdate) {
                    const updatedScores = {
                      ...book.scores,
                      awards: value[0]
                    };
                    onScoresUpdate(book.id, updatedScores);
                  }
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Collection Relevance</span>
                <span className="text-sm font-medium">{book.scores.relevance}/10</span>
              </div>
              <Slider 
                value={[book.scores.relevance]} 
                min={0} 
                max={10} 
                step={1} 
                className="h-2"
                onValueChange={(value) => {
                  if (onScoresUpdate) {
                    const updatedScores = {
                      ...book.scores,
                      relevance: value[0]
                    };
                    onScoresUpdate(book.id, updatedScores);
                  }
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Physical Condition</span>
                <span className="text-sm font-medium">{book.scores.condition}/10</span>
              </div>
              <Slider 
                value={[book.scores.condition]} 
                min={0} 
                max={10} 
                step={1} 
                className="h-2"
                onValueChange={(value) => {
                  if (onScoresUpdate) {
                    const updatedScores = {
                      ...book.scores,
                      condition: value[0]
                    };
                    onScoresUpdate(book.id, updatedScores);
                  }
                }}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Reader Demand</span>
                <span className="text-sm font-medium">{book.scores.demand}/10</span>
              </div>
              <Slider 
                value={[book.scores.demand]} 
                min={0} 
                max={10} 
                step={1} 
                className="h-2"
                onValueChange={(value) => {
                  if (onScoresUpdate) {
                    const updatedScores = {
                      ...book.scores,
                      demand: value[0]
                    };
                    onScoresUpdate(book.id, updatedScores);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleResetScores}
              className="flex items-center"
            >
              <Timer className="h-4 w-4 mr-2" /> Reset Scores
            </Button>
            <Button
              variant="outline"
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

      {/* Score Adjustment Dialog */}
      <Dialog open={isAdjustingScores} onOpenChange={setIsAdjustingScores}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Scores Manually</DialogTitle>
            <DialogDescription>
              Move the sliders to adjust the individual scores for this book
            </DialogDescription>
          </DialogHeader>
          
          {editedScores && (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Price Value</span>
                  <span>{editedScores.price}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.price]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('price', value)} 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Publication Recency</span>
                  <span>{editedScores.publishYear}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.publishYear]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('publishYear', value)} 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Awards Recognition</span>
                  <span>{editedScores.awards}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.awards]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('awards', value)} 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Collection Relevance</span>
                  <span>{editedScores.relevance}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.relevance]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('relevance', value)} 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Physical Condition</span>
                  <span>{editedScores.condition}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.condition]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('condition', value)} 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex justify-between">
                  <span>Reader Demand</span>
                  <span>{editedScores.demand}/10</span>
                </Label>
                <Slider 
                  value={[editedScores.demand]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(value) => handleScoreChange('demand', value)} 
                />
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
