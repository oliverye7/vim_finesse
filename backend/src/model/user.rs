use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct User {
    id: String,
    email: String,
    token: String,
}

#[derive(Deserialize, Serialize)]
pub struct RegisterRequest {
    pub id: String,
    pub username: String,
    pub email: String,
    pub token: String,
}
