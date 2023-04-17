// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Response {
    response: String,
    items: Vec<Items>
}

#[derive(Serialize, Deserialize)]
pub struct Items {
    name: String,
    image: String,
    search_name: String
}

#[tauri::command]
async fn search(name: String) -> Response {
    reqwest::get(format!("http://127.0.0.1:3030/vizer/v1/search/{}", name))
            .await
            .unwrap()
            .json::<Response>()
            .await
            .unwrap()
}

#[tauri::command]
async fn request_items() -> Response {
    reqwest::get("http://127.0.0.1:3030/vizer/v1/home")
            .await
            .unwrap()
            .json::<Response>()
            .await
            .unwrap()
}

#[tauri::command]
async fn seasons(name: String) -> Response {
    reqwest::get(format!("http://127.0.0.1:3030/vizer/v1/parse/{}", name))
            .await
            .unwrap()
            .json::<Response>()
            .await
            .unwrap()
}

#[tauri::command]
async fn episodes(name: String) -> Response {
    reqwest::get(format!("http://127.0.0.1:3030/vizer/v1/serie/episodes/{}", name))
            .await
            .unwrap()
            .json::<Response>()
            .await
            .unwrap()
}

#[tauri::command]
async fn stream(name: String) -> Response {
    reqwest::get(format!("http://127.0.0.1:3030/vizer/v1/serie/stream/{}", name))
            .await
            .unwrap()
            .json::<Response>()
            .await
            .unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search, request_items, seasons, episodes, stream])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
