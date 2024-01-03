use actix_web::{get, post, web::Json, web::Path, HttpRequest, HttpResponse, Responder};
use log::{info, warn};
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::Pool;

#[derive(Deserialize, Serialize)]
pub struct ChallengeIdentifier {
    challenge_id: String,
}

#[derive(Deserialize, Serialize)]
pub struct ChallengeResponse {
    message: String,
}

#[derive(Deserialize, Serialize)]
pub struct ChallengeSubmission {
    challenge_id: i16,
    user_id: i32,
    user_keystrokes: Vec<String>,
}

#[get("/challenge")]
pub async fn get_challenge() -> Json<ChallengeResponse> {
    info!("Requesting to get a challenge.");
    let response = ChallengeResponse {
        message: "received challenge: lorem ipsum dolor... ".to_string(),
    };
    Json(response)
}

#[get("/challenge/{challenge_id}")]
pub async fn get_specific_challenge(
    challenge_id: Path<ChallengeIdentifier>,
) -> Json<ChallengeResponse> {
    warn!("Database is not setup yet.");
    let response = ChallengeResponse {
        message: format!(
            "User requested to get a challenge and got {}",
            challenge_id.into_inner().challenge_id
        ),
    };
    Json(response)
}

#[post("/challenge/{challenge_id}/submit")]
pub async fn submit_challenge(
    submission: Json<ChallengeSubmission>,
    challenge_id: Path<ChallengeIdentifier>,
) -> impl Responder {
    println!("Received Challenge Submission!");
    println!("{:?}", submission.user_keystrokes);
    HttpResponse::Ok().body("ok")
}
