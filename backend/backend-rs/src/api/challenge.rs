use actix_web::{
    error::ResponseError,
    get,
    http::{header::ContentType, StatusCode},
    post, put,
    web::Data,
    web::Json,
    web::Path,
    HttpResponse,
};

use derive_more::Display;
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
    let response = ChallengeResponse {
        message: "User requested to get a challenge".to_string(),
    };
    Json(response)
}

#[get("/challenge/{challenge_id}")]
pub async fn get_specific_challenge(
    challenge_identifier: Path<ChallengeIdentifier>,
) -> Json<ChallengeResponse> {
    let response = ChallengeResponse {
        message: format!(
            "User requested to get a challenge and got {}",
            challenge_identifier.into_inner().challenge_id
        ),
    };
    Json(response)
}
