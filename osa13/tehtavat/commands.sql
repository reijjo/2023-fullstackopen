CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author TEXT,
	url TEXT NOT NULL,
	title TEXT NOT NULL,
	likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Dan Abramov', 'dan.com', 'On let vs const');
INSERT INTO blogs (author, url, title) VALUES ('Laurenz Albe', 'laurenz.com', 'Gaps in sequences in PostgreSQL');

-- INVALID COMMANDS
INSERT INTO BLOGS (author) VALUES ('Repe');
INSERT INTO BLOGS (author, url) VALUES ('Repe', 'error testii.fi');