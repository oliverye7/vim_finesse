use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct User {
    id: String,
    email: String,
    token: String,
}
