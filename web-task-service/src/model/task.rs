use serde::Serialize;
use strum_macros::{Display, EnumString};
use uuid::Uuid;

pub enum TaskState {
    NotStarted,
    InProgress,
    Completed,
    Paused,
    Failed,
}

#[derive(Serialize)]
pub struct Task {
    pub user_uuid: String,
    pub task_uuid: String,
    pub task_type: String,
    pub state: TaskState,
    pub source_file: String,
    pub result_file: Option<String>,
}

impl Task {
    pub fn new(user_uuid: String, task_type: String, source_file: String) -> Task {
        Task {
            user_uuid: user_uuid,
            task_uuid: Uuid::new_v4().to_string(),
            task_type: task_type,
            state: TaskState::NotStarted,
            source_file,
            result_file: None,
        }
    }

    pub fn get_global_id(&self) -> String {
        format!("{}_{}", self.user_uuid, self.task_uuid) // no semicolon = return this line
    }

    pub fn can_transition_to(&self, state: &TaskState) -> bool {
        self.state != *state
    }
}
