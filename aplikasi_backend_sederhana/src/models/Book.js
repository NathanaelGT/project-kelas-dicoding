import * as validate from './validator.js';

/**
 * @property {number} id
 * @property {string} name
 * @property {number} year
 * @property {string} author
 * @property {string} summary
 * @property {string} publisher
 * @property {number} pageCount
 * @property {number} readPage
 * @property {boolean} finished
 * @property {boolean} reading
 * @property {string} insertedAt
 * @property {string} updatedAt
 */
class Book {
  /**
   * @param {Object} book
   * @param {number} book.id
   * @param {string} book.name
   * @param {number} book.year
   * @param {string} book.author
   * @param {string} book.summary
   * @param {string} book.publisher
   * @param {number} book.pageCount
   * @param {number} book.readPage
   * @param {boolean} book.finished
   * @param {boolean} book.reading
   * @param {Date} [book.insertedAt]
   * @param {Date} [book.updatedAt]
   */
  constructor({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt = new Date(),
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;

    this.finished = readPage === pageCount;
    this.reading = reading;
    this.insertedAt = insertedAt.toISOString();
    this.updatedAt = updatedAt?.toISOString() ?? this.insertedAt;
  }

  static validate({ name, year, author, summary, publisher, pageCount, readPage, reading }) {
    try {
      return {
        name: validate.string(name, 'nama buku'),
        year: validate.number(year, 'tahun buku'),
        author: validate.string(author, 'penulis buku'),
        summary: validate.string(summary, 'ringkasan buku'),
        publisher: validate.string(publisher, 'penerbit buku'),
        pageCount: validate.number(pageCount, 'jumlah halaman buku'),
        readPage: validate.number(readPage, 'halaman buku yang sudah dibaca'),
        reading: validate.boolean(reading, 'status buku yang sedang dibaca'),
      };
    } finally {
      validate.range(readPage, pageCount);
    }
  }

  static new(payload) {
    const book = Book.validate(payload);
    book.id = `_${Math.random().toString(36).slice(2, 9)}`;

    return new Book(book);
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

export default Book;
