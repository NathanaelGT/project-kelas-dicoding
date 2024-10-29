import db from './db.js';
import Book from './models/Book.js';

export const books = {
  create: handler((response, request) => {
    try {
      const book = Book.new(
        typeof request.payload === 'string' ? JSON.parse(request.payload) : request.payload,
      );

      db.books.push(book);

      return response.success(
        {
          bookId: book.id,
        },
        'Buku berhasil ditambahkan',
        201,
      );
    } catch (error) {
      return response.fail(`Gagal menambahkan buku. ${error.message}`);
    }
  }),

  all: handler((response, request) => {
    const { name, reading, finished } = request.query;
    let { books } = db;

    if (typeof name === 'string' && name) {
      const lcName = name.toLowerCase();
      books = books.filter((book) => {
        return book.name.toLowerCase().includes(lcName);
      });
    }

    if (['0', '1'].includes(reading)) {
      books = books.filter((book) => book.reading === (reading === '1'));
    }

    if (['0', '1'].includes(finished)) {
      books = books.filter((book) => book.finished === (finished === '1'));
    }

    return response.success({
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    });
  }),

  find: handler((response, request) => {
    const id = request.params.bookId;
    const book = db.books.find((book) => book.id === id);

    if (!book) {
      return response.fail('Buku tidak ditemukan', 404);
    }

    return response.success({ book });
  }),

  update: handler((response, request) => {
    const id = request.params.bookId;
    const book = db.books.find((book) => book.id === id);

    if (!book) {
      return response.fail('Gagal memperbarui buku. Id tidak ditemukan', 404);
    }

    try {
      const validatedData = Book.validate(
        typeof request.payload === 'string' ? JSON.parse(request.payload) : request.payload,
      );

      for (const property in validatedData) {
        book[property] = validatedData[property];
      }

      book.touch();

      return response.success('Buku berhasil diperbarui');
    } catch (error) {
      return response.fail(`Gagal memperbarui buku. ${error.message}`);
    }
  }),

  delete: handler((response, request) => {
    const id = request.params.bookId;
    const bookIndex = db.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return response.fail('Buku gagal dihapus. Id tidak ditemukan', 404);
    }

    db.books.splice(bookIndex, 1);

    return response.success('Buku berhasil dihapus');
  }),
};

/**
 * @callback Success
 * @param {string | Record<string, unknown>} dataOrMessage
 * @param {string | number} [messageOrCode]
 * @param {number} [code]
 * @returns {import('@hapi/hapi').ResponseObject}

 * @callback Fail
 * @param {string} message
 * @param {number} [code]
 * @returns {import('@hapi/hapi').ResponseObject}

 * @param {(
 *   response: { success: Success, fail: Fail },
 *   request: import('@hapi/hapi').Request
 * ) => import('./app.js').Handler} handler
 * @returns {import('./app.js').Handler}
 */
function handler(handler) {
  return (request, h) => {
    return handler(
      {
        success(dataOrMessage, messageOrCode, code) {
          const response = { status: 'success' };
          if (typeof dataOrMessage === 'string') {
            response.message = dataOrMessage;
          } else {
            response.data = dataOrMessage;
          }

          if (typeof messageOrCode === 'string') {
            response.message = messageOrCode;
          } else {
            code = messageOrCode;
          }

          return h.response(response).code(code ?? 200);
        },

        fail(message, code = 400) {
          return h
            .response({
              status: 'fail',
              message,
            })
            .code(code);
        },
      },
      request,
    );
  };
}
