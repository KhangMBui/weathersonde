from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import serial
import json
import uvicorn
import time
 
app = FastAPI()
 
# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Shared variable to store the latest sensor data
latest_data = {
    "WS_Node": "Default_Node",
    "WS_Data": {
        "Date": "10/31/2024",
        "Time": "14:40:49",
        "latitude": 50,
        "longitude": -119,
        "altitude": "15.3 m",
        "Internal_Temp": "25 °C",
        "Internal_RH": "34%",
        "Internal_Pres": "7 kPa",
        "Weather": {
        "Air_Temperature": "25 °C",
        "RH": "45%"
        }
    }
}
 
def read_usb_data():
    global latest_data
    try:
        ser = serial.Serial('COM8', baudrate=57600, timeout=1)
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                print("Sensor Data:", line)
 
                # Example parsing: customize this to match your actual data format
                try:
                    parsed = json.loads(line)  # If your USB sends JSON
                    latest_data["WS_Data"].update(parsed)
                except json.JSONDecodeError:
                    print("Invalid JSON from USB")
            time.sleep(0.1)
    except serial.SerialException as e:
        print(f"Serial connection error: {e}")
 
# Start USB reading in a background thread
usb_thread = threading.Thread(target=read_usb_data, daemon=True)
usb_thread.start()
 
@app.get('/')
def root():
    return latest_data
 
@app.get("/ws_node")
def get_ws_node():
    return latest_data["WS_Node"]
 
@app.get("/ws_data")
def get_ws_data():
    return latest_data["WS_Data"]
 
@app.get("/ws_data/time")
def get_time():
    return latest_data["WS_Data"]["Time"]
 
@app.get("/ws_data/geojson")
def get_geojson():
    return {
        "type": "Point",
        "coordinates": [latest_data["WS_Data"]["longitude"], latest_data["WS_Data"]["latitude"]]
    }
 
@app.get("/ws_data/location")
def get_location():
    return {
        "latitude": latest_data["WS_Data"]["latitude"],
        "longitude": latest_data["WS_Data"]["longitude"]
    }
 
@app.get("/ws_data/height")
def get_height():
    return latest_data["WS_Data"]["altitude"]
 
@app.get("/ws_data/internal")
def get_internal():
    return {
        "Temperature": latest_data["WS_Data"]["Internal_Temp"],
        "Humidity": latest_data["WS_Data"]["Internal_RH"],
        "Pressure": latest_data["WS_Data"]["Internal_Pres"]
    }
 
@app.get("/ws_data/temperature")
def get_temperature():
    return latest_data["WS_Data"]["Weather"]["Air_Temperature"]
 
@app.get("/ws_data/humidity")
def get_humidity():
    return latest_data["WS_Data"]["Weather"]["RH"]
 
@app.get("/global_inversion")
def global_inversion():
    return {
        "inversion_rate": 0,
        "lower_height": 0,
        "upper_height": 0,
        "inversion_intensity": 0,
        "inversion_height": 0
    }
 
@app.get("/local_inversion")
def local_inversion():
    return {
        "inversion_rate": 0,
        "lower_height": 0,
        "upper_height": 0,
        "inversion_intensity": 0,
        "inversion_height": 0
    }
 
@app.get("/test")
def test():
    return {"message": "FastAPI and USB real-time reading are connected!"}
 
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)