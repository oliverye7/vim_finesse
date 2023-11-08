use actix_web::{
    get,
    web::Json,
    web::Path,
};

use serde::{Deserialize, Serialize};
use log::{warn, info};

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
        message: "User requested to get a challenge".to_string(),
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
