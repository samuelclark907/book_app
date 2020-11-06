DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  author VARCHAR(255),
  image VARCHAR(255),
  isbn VARCHAR(255)
);

INSERT INTO books(title, description, author, image, isbn)
VALUES ('Thanos', 'test', 'test', 'test', 'test' );