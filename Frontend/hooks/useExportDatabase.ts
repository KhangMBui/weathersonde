import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const dbName = "weathersonde.db";
const dbPath = FileSystem.documentDirectory + "SQLite/" + dbName;

export async function useExportDatabase() {
  // Check if file exists
  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  if (!fileInfo.exists) {
    alert("Database file not found!");
    return;
  }
  // Share the file (this will open the share dialog on device)
  await Sharing.shareAsync(dbPath);
}
