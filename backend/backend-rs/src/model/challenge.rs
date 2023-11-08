use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

/*
 * Defines a challenge by the starting piece of text (newlines, tabs, etc. included),
 * the starting line, and the location on the line.
 * The challenge is deemed complete when the string of the text is the end state.
*/
#[derive(Deserialize, Serialize)]
pub struct Challenge {
    pub id: String,
    pub user_id: String,
    pub start_state: String,
    pub end_state: String,
    pub start_line_offset: u32,
    pub start_char_offset: u32,
}

/*
 * Defines a challenge attempt by a user with a certain solution.
 * Holds a foreign key to challenge and user.
*/
#[derive(Deserialize, Serialize)]
pub struct Attempt {
    pub id: String,
    pub date: NaiveDate,
    pub solution: Vec<String>,
    pub challenge_id: String,
    pub user_id: String,
}
