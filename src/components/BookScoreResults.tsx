
import { useState } from 'react';
import { BookType } from '@/types/book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen } from 'lucide-react';

type BookScoreResultsProps = {
  book: BookType | null;
};

const BookScoreResults = ({ book }: BookScoreResultsProps) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  if (!book) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No book evaluated yet</h3>
        <p className="text-gray-500 mt-2">Fill out the evaluation form to see results here</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Based on all criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <div className={`absolute inset-0 rounded-full ${getScoreColor(book.totalScore)} opacity-20`}></div>
                <span className="text-5xl font-bold">{book.totalScore}</span>
                <span className="text-sm font-medium absolute bottom-3">out of 10</span>
              </div>
              
              <Badge className={`${getRecommendationClass(book.totalScore)} text-sm px-3 py-1`}>
                {getRecommendation(book.totalScore)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{book.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-medium">{book.author}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Publication Year</p>
                <p className="font-medium">{book.publishYear}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">${book.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <p className="font-medium">{book.awards} Award{book.awards !== 1 ? 's' : ''}</p>
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
              <Progress value={book.scores.price * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Publication Recency</span>
                <span className="text-sm font-medium">{book.scores.publishYear}/10</span>
              </div>
              <Progress value={book.scores.publishYear * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Awards Recognition</span>
                <span className="text-sm font-medium">{book.scores.awards}/10</span>
              </div>
              <Progress value={book.scores.awards * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Collection Relevance</span>
                <span className="text-sm font-medium">{book.scores.relevance}/10</span>
              </div>
              <Progress value={book.scores.relevance * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Physical Condition</span>
                <span className="text-sm font-medium">{book.scores.condition}/10</span>
              </div>
              <Progress value={book.scores.condition * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Reader Demand</span>
                <span className="text-sm font-medium">{book.scores.demand}/10</span>
              </div>
              <Progress value={book.scores.demand * 10} className="h-2" />
            </div>
          </div>

          <div className="flex justify-end mt-6">
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
    </div>
  );
};

export default BookScoreResults;
