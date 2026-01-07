CREATE TABLE blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER DEFAULT 0);
INSERT INTO blogs (author, url, title) VALUES ('Don Boron Bon Bom', 'www.donbon.com', 'How to do the Boron Bom');
INSERT INTO blogs (author, url, title) VALUES ('Jose Josepe', 'www.drinkmate.com', 'Why we love Mate');