
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  averageRating: z.coerce.number().min(0).max(5).optional(),
  goodreadsReviews: z.coerce.number().int().min(0).optional(),
  hasPrize: z.boolean().default(false),
  prizeDetails: z.string().optional(),
  hasJEDI: z.boolean().default(false),
  notInOtherLibraries: z.boolean().default(false),
});

type BookScoreFormProps = {
  onBookScored: (book: BookType) => void;
};

const BookScoreForm = ({ onBookScored }: BookScoreFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      publishYear: new Date().getFullYear(),
      price: 19.99,
      averageRating: 4.0,
      goodreadsReviews: 1000,
      hasPrize: false,
      prizeDetails: "",
      hasJEDI: false,
      notInOtherLibraries: false,
    },
  });
  
  // Watch for hasPrize value to conditionally show prizeDetails field
  const watchHasPrize = form.watch("hasPrize");
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Create a properly typed object with all required fields
      const bookData: Omit<BookType, 'id' | 'scores' | 'totalScore' | 'date'> = {
        title: values.title,
        author: values.author,
        publishYear: values.publishYear,
        price: values.price,
        averageRating: values.averageRating,
        goodreadsReviews: values.goodreadsReviews,
        hasPrize: values.hasPrize,
        prizeDetails: values.prizeDetails,
        hasJEDI: values.hasJEDI,
        notInOtherLibraries: values.notInOtherLibraries,
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
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-blue-800 mb-4">Book Details</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Book Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter book title" className="border-blue-200 focus:border-blue-400" {...field} />
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
                      <FormLabel className="text-blue-700">Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" className="border-blue-200 focus:border-blue-400" {...field} />
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
                      <FormLabel className="text-blue-700">Publication Year</FormLabel>
                      <FormControl>
                        <Input type="number" className="border-blue-200 focus:border-blue-400" {...field} />
                      </FormControl>
                      <FormDescription className="text-blue-600">
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
                      <FormLabel className="text-blue-700">Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" className="border-blue-200 focus:border-blue-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="averageRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Amazon Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="5" step="0.1" className="border-blue-200 focus:border-blue-400" {...field} />
                      </FormControl>
                      <FormDescription className="text-blue-600">
                        Average rating on Amazon (0-5 stars)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goodreadsReviews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700">Goodreads Reviews Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" className="border-blue-200 focus:border-blue-400" {...field} />
                      </FormControl>
                      <FormDescription className="text-blue-600">
                        Number of reviews on Goodreads
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-purple-800 mb-4">Additional Criteria</h3>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="hasPrize"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-200">
                      <div className="space-y-0.5">
                        <FormLabel className="text-purple-700">Got any prize?</FormLabel>
                        <FormDescription className="text-purple-600">
                          Has this book received any award or prize?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {watchHasPrize && (
                  <FormField
                    control={form.control}
                    name="prizeDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700">Prize Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide prize name and year (e.g., Pulitzer Prize 2022)" 
                            className="border-purple-200 focus:border-purple-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="hasJEDI"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-200">
                      <div className="space-y-0.5">
                        <FormLabel className="text-purple-700">Include JEDI?</FormLabel>
                        <FormDescription className="text-purple-600">
                          Does this book promote justice, equity, diversity, and inclusion?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notInOtherLibraries"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-purple-200">
                      <div className="space-y-0.5">
                        <FormLabel className="text-purple-700">Not in other libraries?</FormLabel>
                        <FormDescription className="text-purple-600">
                          Is this book not available in other libraries?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Calculate Score
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookScoreForm;
