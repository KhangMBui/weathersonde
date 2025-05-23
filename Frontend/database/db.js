import * as SQLite from "expo-sqlite";

let dbPromise = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("weathersonde.db");
  }
  return dbPromise;
}

export async function initDB() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      time TEXT,
      altitude REAL,
      internalTemp REAL,
      internalRH TEXT,
      internalPres TEXT,
      airTemp REAL,
      weatherRH TEXT,
      inversionIntensity TEXT,
      inversionHeight TEXT,
      inversionRate TEXT,
      UNIQUE(date, time)
    );
  `);
}
export async function insertRecord(record) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO records (date, time, altitude, internalTemp, internalRH, internalPres, airTemp, weatherRH, inversionIntensity, inversionHeight, inversionRate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    record.date,
    record.time,
    record.altitude,
    record.internalTemp,
    record.internalRH,
    record.internalPres,
    record.airTemp,
    record.weatherRH,
    record.inversionIntensity,
    record.inversionHeight,
    record.inversionRate
  );
}

export async function fetchRecords() {
  const db = await getDb();
  return await db.getAllAsync(
    `SELECT * FROM records ORDER BY id DESC LIMIT 20`
  );
}

export async function clearRecords() {
  const db = await getDb();
  await db.runAsync(`DELETE FROM records`);
}
