use actix_web::{get, web::Json, web::Path};

use log::{info, warn};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct ChallengeIdentifier {
    challenge_id: String,
}

#[derive(Deserialize, Serialize)]
pub struct ChallengeResponse {
    message: String,
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
