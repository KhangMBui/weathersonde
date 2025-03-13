from fastapi import FastAPI
import json

app = FastAPI()


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