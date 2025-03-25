from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

import uvicorn

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Remember to change to frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('WeatherSonde.txt', 'r') as file:
    data = json.load(file)

@app.get('/')
def root():
    return data

@app.get("/ws_node")
def get_ws_node():
    return data["WS_Node"]

@app.get("/ws_data")
def get_ws_data():
    return data["WS_Data"]

@app.get("/ws_data/weather")
def get_weather():
    return data["WS_Data"]["Weather"]

# Testing route:
@app.get("/test")
def test():
    return {"message": "FastAPI and React Native are connected!"}

# Automatically run the server with uvicorn when running this python file.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)