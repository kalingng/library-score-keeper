
import { useState } from 'react';
import BookScoreResults from '@/components/BookScoreResults';
import BookHistory from '@/components/BookHistory';
import BookSearch from '@/components/BookSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookType } from '@/types/book';

const Index = () => {
  const [scoredBooks, setScoredBooks] = useState<BookType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("search");

  const handleBookScored = (book: BookType) => {
    setScoredBooks(prev => [...prev, book]);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Book Acquisition Scoring Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Evaluate books based on multiple criteria to make informed acquisition decisions for your library.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Books</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="p-6 bg-white rounded-lg shadow-md">
            <BookSearch />
          </TabsContent>

          <TabsContent value="results" className="p-6 bg-white rounded-lg shadow-md">
            <BookScoreResults 
              book={scoredBooks.length > 0 ? scoredBooks[scoredBooks.length - 1] : null}
            />
          </TabsContent>

          <TabsContent value="history" className="p-6 bg-white rounded-lg shadow-md">
            <BookHistory books={scoredBooks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
