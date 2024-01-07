use actix_web::{get, post, web::Json, web::Path, HttpResponse, Responder, web};
use log::{info, warn};
use serde::{Deserialize, Serialize};
use sqlx::Pool;
use uuid::{Uuid};
use std::collections::HashMap;


#[derive(Deserialize, Serialize)]
pub struct ChallengeIdentifier {
    challenge_id: String,
}

#[derive(Deserialize, Serialize)]
pub struct ChallengeName {
    challenge_name: String,
}

// HELP this is kind of redundant cuz i feel like it overlaps with the previous two structs?
#[derive(sqlx::FromRow, serde::Serialize)]
struct Challenge {
    id: Uuid,
    challenge_name: String,
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

#[derive(Deserialize, Serialize)]
pub struct ChallengeDescription {
    challenge_id: Option<Uuid>,
    challenge_name: String,
    start_state: String,
    target_state: String,
    start_line_offset: i32,
    start_char_offset: i32
}

/*
 * Fetch all <challenge name, challenge id> labels of all challenges 
 * TODO: implement pagination where the entire DB is not queried at the same time, you can query the first "page" of challenges that a user is meant to see
 * e.g. if the first page only displays 20 challenges, only fetch the first 40 challenges
*/
#[get("/allChallenges")]
pub async fn get_challenge_identifiers(
    pool: web::Data<Pool<sqlx::Postgres>>,
) -> impl Responder {
    let mut txn = pool.get_ref().begin().await.unwrap();
    let challenges: Vec<Challenge> = sqlx::query_as!(
        Challenge,
        "SELECT id, challenge_name FROM challenges;"
    )
    .fetch_all(&mut *txn)
    .await
    .unwrap();

    txn.commit().await.unwrap();

    let challenge_map: HashMap<Uuid, String> = challenges
        .into_iter()
        .map(|c| (c.id, c.challenge_name))
        .collect();

    HttpResponse::Ok().json(challenge_map)
}

#[get("/challenge")]
pub async fn get_challenge(
    challenge_id: Json<ChallengeIdentifier>,
    pool: web::Data<Pool<sqlx::Postgres>>,
) -> impl Responder {
    let id_str = &challenge_id.challenge_id;
    let id = Uuid::parse_str(&id_str).expect("Invalid UUID format");

    let mut txn = pool.get_ref().begin().await.unwrap();
    match sqlx::query!(
        "SELECT * FROM challenges WHERE id = $1;",
        id
    )
    .fetch_optional(&mut *txn)
    .await
    {
        Ok(record) => {
            txn.commit().await.unwrap();
            match record {
                Some(record) => {
                    let description = ChallengeDescription {
                        challenge_id: Some(record.id),
                        challenge_name: record.challenge_name,
                        start_state: record.start_state,
                        target_state: record.target_state,
                        start_line_offset: record.start_line_offset,
                        start_char_offset: record.start_char_offset
                    };

                    return HttpResponse::Ok().json(description);
                }
                None => {
                    return HttpResponse::NotFound().body("Record not found");
                }
            }
        }
        Err(e) => {
            txn.rollback().await.unwrap();
            return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
        }
    }
}

/*
 * Adds a challenge to database
*/
#[post("/add_challenge")]
pub async fn add_challenge(
    challenge: Json<ChallengeDescription>,
    pool: web::Data<Pool<sqlx::Postgres>>,
) -> impl Responder {
    let mut txn = pool.get_ref().begin().await.unwrap();
    // TODO: add verification for no duplicate challenges

    let id = Uuid::new_v4();
    match sqlx::query!(
        "INSERT INTO challenges (id, challenge_name, start_state, target_state, start_line_offset, start_char_offset) VALUES ($1, $2, $3, $4, $5, $6) returning id;",
        id,
        challenge.challenge_name,
        challenge.start_state,
        challenge.target_state,
        challenge.start_line_offset,
        challenge.start_char_offset
    )
    .fetch_one(&mut *txn)
    .await
    {
        Ok(_record) => {
            txn.commit().await.unwrap();
            return HttpResponse::Ok().body("successfully added challenge");
        }
        Err(e) => {
            txn.rollback().await.unwrap();
            return HttpResponse::InternalServerError().body(format!("Server Error: {}", e));
        }
    }
}

/*
 * Prints out a user's submission for a challenge
*/
#[post("/challenge/{challenge_id}/submit")]
pub async fn submit_challenge_attempt(
    submission: Json<ChallengeSubmission>,
    challenge_id: Path<ChallengeIdentifier>,
) -> impl Responder {
    println!("Received Challenge Submission!");
    println!("{:?}", submission.user_keystrokes);
    HttpResponse::Ok().body("ok")
}
