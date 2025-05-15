
import { useState } from 'react';
import { BookType } from '@/types/book';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Heart } from 'lucide-react';

type BookFavouritesProps = {
  books: BookType[];
  onSelectBook?: (book: BookType) => void;
  onRemoveFromFavourites?: (bookId: string) => void;
};

const BookFavourites = ({ books, onSelectBook, onRemoveFromFavourites }: BookFavouritesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-blue-100 text-blue-800";
    if (score >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleRowClick = (book: BookType) => {
    if (onSelectBook) {
      onSelectBook(book);
    }
  };
  
  const handleRemove = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (onRemoveFromFavourites) {
      onRemoveFromFavourites(bookId);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-medium text-gray-600">No favourite books</h3>
        <p className="text-gray-500 mt-2">Books you mark as favourites will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Search favourites by title or author..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="ml-auto text-sm text-muted-foreground">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} in favourites
        </p>
      </div>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <TableRow 
                    key={book.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(book)}
                  >
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{formatDateTime(book.date)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getScoreColor(book.totalScore)}>
                        {book.totalScore}/10
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleRemove(e, book.id)}
                      >
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No books found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default BookFavourites;
