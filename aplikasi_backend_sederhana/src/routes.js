import { app } from './app.js';
import { books } from './handlers.js';

export default app
  .post('/books', books.create)
  .get('/books', books.all)
  .get('/books/{bookId}', books.find)
  .put('/books/{bookId}', books.update)
  .delete('/books/{bookId}', books.delete);
