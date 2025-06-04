import sqlite3
from typing import List, Dict, Any

DB_PATH = "weathersonde.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        conn.execute("""
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
                inversionRate TEXT
            );
        """)
        conn.commit()

def insert_record(record: Dict[str, Any]):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO records (
                date, time, altitude, internalTemp, internalRH, internalPres,
                airTemp, weatherRH, inversionIntensity, inversionHeight, inversionRate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record["date"],
            record["time"],
            record["altitude"],
            record["internalTemp"],
            record["internalRH"],
            record["internalPres"],
            record["airTemp"],
            record["weatherRH"],
            record["inversionIntensity"],
            record["inversionHeight"],
            record["inversionRate"],
        ))
        conn.commit()

def fetch_records(limit: int = 20) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT * FROM records ORDER BY id DESC LIMIT ?", (limit,)
        )
        return [dict(row) for row in cursor.fetchall()]

def clear_records():
    with get_connection() as conn:
        conn.execute("DELETE FROM records")
        conn.commit()