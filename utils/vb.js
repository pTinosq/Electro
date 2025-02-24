/*
VB = Version Bump
USAGE: `npm run vb`

Script that propagates version changes to the package.json and tauri.conf.json files.
*/

import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const askVersion = () => {
  return new Promise((resolve) => {
    rl.question("Enter new version (e.g. 0.4.2): ", (version) => {
      resolve(version.trim());
    });
  });
};

const updateJsonFile = (filePath, updater) => {
  try {
    const json = JSON.parse(readFileSync(filePath, "utf8"));
    updater(json);
    writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
};

const updateTomlFile = (filePath, updater) => {
  try {
    const toml = readFileSync(filePath, "utf8");
    const updatedToml = updater(toml);
    writeFileSync(filePath, updatedToml, "utf8");
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

(async () => {
  const newVersion = await askVersion();
  rl.close();

  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error("Invalid version format.");
    process.exit(1);
  }

  updateJsonFile("./package.json", (json) => {
    json.version = newVersion
  });
  updateJsonFile("./src-tauri/tauri.conf.json", (json) => {
    json.version = newVersion
  });
  updateTomlFile("./src-tauri/Cargo.toml", (toml) => {
    return toml.replace(/version = "\d+\.\d+\.\d+"/, `version = "${newVersion
      }"`);
  });

  console.log(`Version updated to ${newVersion}`);
})();
