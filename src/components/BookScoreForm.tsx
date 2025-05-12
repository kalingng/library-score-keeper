
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookType } from '@/types/book';
import { calculateCriteriaScores, calculateTotalScore } from '@/utils/scoreCalculator';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  publishYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()),
  price: z.coerce.number().min(0),
  awards: z.coerce.number().int().min(0),
  relevance: z.coerce.number().min(1).max(10),
  condition: z.coerce.number().min(1).max(10),
  demand: z.coerce.number().min(1).max(10),
});

type BookScoreFormProps = {
  onBookScored: (book: BookType) => void;
};

const BookScoreForm = ({ onBookScored }: BookScoreFormProps) => {
  const { toast } = useToast();
  const [relevanceValue, setRelevanceValue] = useState([5]);
  const [conditionValue, setConditionValue] = useState([5]);
  const [demandValue, setDemandValue] = useState([5]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      publishYear: new Date().getFullYear(),
      price: 19.99,
      awards: 0,
      relevance: 5,
      condition: 5,
      demand: 5,
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Create a properly typed object with all required fields
      const bookData: Omit<BookType, 'id' | 'scores' | 'totalScore' | 'date'> = {
        title: values.title,
        author: values.author,
        publishYear: values.publishYear,
        price: values.price,
        awards: values.awards,
        relevance: relevanceValue[0],
        condition: conditionValue[0],
        demand: demandValue[0],
      };
      
      // Calculate scores
      const criteriaScores = calculateCriteriaScores(bookData);
      const totalScore = calculateTotalScore(criteriaScores);
      
      // Create final book object
      const scoredBook: BookType = {
        id: `book-${Date.now()}`,
        ...bookData,
        scores: criteriaScores,
        totalScore,
        date: new Date(),
      };
      
      onBookScored(scoredBook);
      
      toast({
        title: "Book scored successfully",
        description: `${values.title} received a score of ${totalScore}/10`,
      });
    } catch (error) {
      console.error("Error calculating score:", error);
      toast({
        title: "Error",
        description: "There was a problem calculating the score",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Book Details</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter book title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="publishYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Year the book was published
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="awards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Awards</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many awards/prizes has this book received?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Subjective Criteria</h3>
              
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="relevance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevance to Collection (1-10)</FormLabel>
                      <FormControl>
                        <Slider
                          value={relevanceValue}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => {
                            setRelevanceValue(value);
                            field.onChange(value[0]);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low Relevance (1)</span>
                        <span>Current: {relevanceValue}</span>
                        <span>High Relevance (10)</span>
                      </div>
                      <FormDescription>
                        How well does this book fit your library's collection?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition (1-10)</FormLabel>
                      <FormControl>
                        <Slider
                          value={conditionValue}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => {
                            setConditionValue(value);
                            field.onChange(value[0]);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Poor (1)</span>
                        <span>Current: {conditionValue}</span>
                        <span>Excellent (10)</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="demand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reader Demand (1-10)</FormLabel>
                      <FormControl>
                        <Slider
                          value={demandValue}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(value) => {
                            setDemandValue(value);
                            field.onChange(value[0]);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low Demand (1)</span>
                        <span>Current: {demandValue}</span>
                        <span>High Demand (10)</span>
                      </div>
                      <FormDescription>
                        Expected popularity among readers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            Calculate Score
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookScoreForm;
