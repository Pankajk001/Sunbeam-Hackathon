create database movieReview;

use movieReview;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    mobile VARCHAR(255),
    birth Date
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    release_date Date
);

INSERT INTO movies (title, release_date) VALUES
('The Shawshank Redemption', '1994-09-23'),
('The Godfather', '1972-03-24'),
('The Dark Knight', '2008-07-18'),
('Pulp Fiction', '1994-10-14'),
('Fight Club', '1999-10-15');


CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    review VARCHAR(255),
    rating INT,
    user_id INT,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO reviews (movie_id, review, rating, user_id) VALUES
(1, 'Great movie', 5, 1),
(2, 'Awesome movie', 3, 1),
(3, 'Great movie', 4, 1),
(4, 'Nice movie', 2, 1),
(5, 'Bad movie', 5, 1);



CREATE TABLE movieReviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movieName VARCHAR(255) ,
    review VARCHAR(255) ,
    rating INT
);