-- Add up migration script here
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    token VARCHAR
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    start_state TEXT NOT NULL,
    end_state TEXT NOT NULL,
    start_line_offset INT NOT NULL,
    start_char_offset INT NOT NULL
);

CREATE TABLE attempts (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    solution TEXT[] NOT NULL,
    challenge_id UUID REFERENCES challenges(id),
    user_id UUID REFERENCES users(id)
);
