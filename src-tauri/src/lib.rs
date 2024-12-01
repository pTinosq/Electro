use tauri::{AppHandle, Emitter};
use tauri_plugin_cli::CliExt;

// This function will be called by the `tauri` runtime when the application is ready
// Here we will parse the CLI arguments and emit them to the frontend
#[tauri::command]
fn on_image_source_listener_ready(app: AppHandle) {
    match app.cli().matches() {
        Ok(matches) => {
            app.emit("image-source", &matches.args)
                .unwrap_or_else(|err| eprintln!("Emit error: {:?}", err));
        }

        Err(_) => {
            eprintln!("Error while parsing CLI arguments");
        }
    }
}

// Main entry point
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_cli::init())
        .invoke_handler(tauri::generate_handler![on_image_source_listener_ready])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
