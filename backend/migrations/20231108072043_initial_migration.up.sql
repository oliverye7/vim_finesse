-- Add up migration script here
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    avatar_url VARCHAR,
    username VARCHAR NOT NULL,
    github_username VARCHAR NOT NULL
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY,
    challenge_name VARCHAR NOT NULL,
    start_state TEXT NOT NULL,
    target_state TEXT NOT NULL,
    start_line_offset INT NOT NULL,
    start_char_offset INT NOT NULL
);

CREATE TABLE attempts (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    solution TEXT[] NOT NULL,
    challenge_id UUID REFERENCES challenges(id),
    user_id UUID REFERENCES users(id)
);
