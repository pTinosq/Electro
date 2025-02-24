use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Emitter};
use tauri_plugin_cli::CliExt;
/*
This file should definitely be abstracted into separate modules but it works for now so I'm leaving it as is.
*/

#[tauri::command]
fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

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

#[tauri::command]
fn exit_app() {
    std::process::exit(0x0);
}

#[tauri::command]
fn get_cwd() -> String {
    match std::env::current_dir() {
        Ok(path) => {
            let path_str = path.to_string_lossy().to_string();
            let clean_path = if path_str.starts_with(r"\\?\") {
                path_str[4..].to_string() // Remove `\\?\` prefix
            } else {
                path_str
            };
            clean_path
        }
        Err(_) => "Failed to get current working directory".to_string(),
    }
}

#[tauri::command]
fn open_file_explorer(path: String) {
    if cfg!(target_os = "windows") {
        std::process::Command::new("explorer")
            .arg(path)
            .spawn()
            .expect("Failed to open explorer");
    } else {
        std::process::Command::new("xdg-open")
            .arg(path)
            .spawn()
            .expect("Failed to open file manager");
    }
}

#[tauri::command]
fn change_cwd(path: String) -> Result<String, String> {
    let new_path = if Path::new(&path).is_absolute() {
        PathBuf::from(path)
    } else {
        match env::current_dir() {
            Ok(cwd) => cwd.join(path),
            Err(_) => return Err("Failed to get current working directory".to_string()),
        }
    };

    // Normalize the path (convert to absolute and resolve "..", ".")
    let canonical_path = match new_path.canonicalize() {
        Ok(p) => p,
        Err(_) => return Err("Invalid directory".to_string()),
    };

    if canonical_path.is_dir() {
        if let Err(err) = env::set_current_dir(&canonical_path) {
            return Err(format!("Failed to change directory: {:?}", err));
        }

        // Convert to a normal string without Windows `\\?\` prefix
        let path_str = canonical_path.to_string_lossy().to_string();
        let clean_path = if path_str.starts_with(r"\\?\") {
            // Strip the "\\?\" prefix
            path_str[4..].to_string()
        } else {
            path_str
        };

        Ok(clean_path)
    } else {
        Err("Invalid directory".to_string())
    }
}

#[tauri::command]
fn list_directory(path: String) -> Result<Vec<String>, String> {
    let dir_path = Path::new(&path);

    // Ensure the path exists and is a directory
    if !dir_path.exists() {
        return Err("Path does not exist".to_string());
    }
    if !dir_path.is_dir() {
        return Err("Provided path is not a directory".to_string());
    }

    let entries = fs::read_dir(dir_path).map_err(|_| "Failed to read directory".to_string())?;

    let mut files_and_dirs = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            let file_name = entry.file_name();
            files_and_dirs.push(file_name.to_string_lossy().to_string());
        }
    }

    Ok(files_and_dirs)
}

// Main entry point
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_cli::init())
        .invoke_handler(tauri::generate_handler![
            on_image_source_listener_ready,
            exit_app,
            get_cwd,
            open_file_explorer,
            change_cwd,
            list_directory,
            get_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
