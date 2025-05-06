from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import serial
import json
import uvicorn
import time
from threading import Lock
from typing import Dict, List, Optional
import serial.tools.list_ports
 
app = FastAPI()
 
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Thread-safe data access
data_lock = Lock()
 
# Initialize data structure
latest_data = {
    "WS_Node": {
        "WS_ID": "",
        "SNR": "",
        "Bat_Volt": "",
        "Bat_SOC": "",
        "DC_CHG": ""
    },
    "WS_Data": {
        "Date": "",
        "Time": "",
        "latitude": 0.0,
        "longitude": 0.0,
        "altitude": "",
        "Internal_Temp": "",
        "Internal_RH": "",
        "Internal_Pres": "",
        "Weather": {
            "Air_Temperature": "",
            "RH": ""
        }
    }
}

 
# Historical tracking
historical_records: List[Dict] = []
grouped_records: List[Dict] = [] #new one
highest_record: Optional[Dict] = None
lowest_record: Optional[Dict] = None
 
def clean_sensor_value(val):
    """Convert string values to appropriate types when possible"""
    if isinstance(val, str):
        if '°C' in val:
            return float(val.replace(' °C', ''))
        elif '%' in val:
            return float(val.replace('%', ''))
        elif ' m' in val:
            return float(val.replace(' m', ''))
        elif ' kPa' in val:
            return float(val.replace(' kPa', ''))
        elif 'V' in val:
            return float(val.replace('V', ''))
    return val

def find_usb_port():
    """
    Dynamically find the USB port connected to the device.
    Returns the port name if found, otherwise None.
    """
    ports = serial.tools.list_ports.comports()
    for port in ports:
        # Check for specific criteria to identify the correct port
        if "USB" in port.description or "Serial" in port.description:
            print(f"Found USB device: {port.device} ({port.description})")
            return port.device  # Return the port name (e.g., 'COM5' or '/dev/ttyUSB0')
    return None  # No matching port found 
 
def read_usb_data():
    global latest_data, historical_records, highest_record, lowest_record
    try:
        
        # Dynamically find the USB port
        usb_port = find_usb_port()
        if not usb_port:
            print("No USB device found. Please connect the device.")
            return
        
        ser = serial.Serial(usb_port, baudrate=57600, timeout=1)
        ser.flushInput()
       
        while True:
            if ser.in_waiting > 0:
                try:
                    raw_line = ser.readline()
                    line = raw_line.decode('utf-8').strip()
                    print(f"Raw sensor data: {line}")
                   
                    parsed = json.loads(line)
                   
                    with data_lock:
                        # Update latest data
                        if "WS_Node" in parsed:
                            for key, value in parsed["WS_Node"].items():
                                if key in latest_data["WS_Node"]:
                                    latest_data["WS_Node"][key] = clean_sensor_value(value)
                       
                        if "WS_Data" in parsed:
                            for key, value in parsed["WS_Data"].items():
                                if key in latest_data["WS_Data"]:
                                    if key == "Weather":
                                        for weather_key, weather_value in value.items():
                                            if weather_key in latest_data["WS_Data"]["Weather"]:
                                                latest_data["WS_Data"]["Weather"][weather_key] = clean_sensor_value(weather_value)
                                    else:
                                        latest_data["WS_Data"][key] = clean_sensor_value(value)
                           
                            # Create a new record for external temperature only
                            current_temp = latest_data["WS_Data"]["Weather"]["Air_Temperature"]
                            current_alt = latest_data["WS_Data"]["altitude"]
                            current_time = f"{latest_data['WS_Data']['Date']} {latest_data['WS_Data']['Time']}"
                            current_humidity = latest_data["WS_Data"]["Weather"]["RH"]
                            if isinstance(current_temp, (int, float)) and isinstance(current_alt, (int, float)):
                                record = {
                                    "timestamp": current_time,
                                    "temperature": current_temp,
                                    "altitude": current_alt,
                                    "humidity": current_humidity
                                }
                               
                                # Add to historical records
                                historical_records.append(record)
                               
                                # Update highest/lowest records
                                if highest_record is None or current_temp > highest_record["temperature"]:
                                    highest_record = record
                                if lowest_record is None or current_temp < lowest_record["temperature"]:
                                    lowest_record = record
                   
                except json.JSONDecodeError:
                    print("Invalid JSON received")
                except Exception as e:
                    print(f"Error processing data: {str(e)}")
           
            time.sleep(0.1)
           
    except serial.SerialException as e:
        print(f"Serial error: {str(e)}")
    except Exception as e:
        print(f"Fatal error in serial thread: {str(e)}")
 
def process_records_by_height():
    """
    Groups historical records by altitude and computes the average temperature for each altitude.
    """
    global grouped_records
    with data_lock:
        height_map = {}
       
        # Group records by altitude
        for record in historical_records:
            altitude = record["altitude"]
            if altitude not in height_map:
                height_map[altitude] = {"altitude": altitude, "temperatures": [], "count": 0}
            height_map[altitude]["temperatures"].append(record["temperature"])
            height_map[altitude]["count"] += 1
       
        # Compute averages and create a grouped list
        grouped_records = [
            {
                "altitude": altitude,
                "average_temperature": sum(details["temperatures"]) / details["count"],
                "count": details["count"]
            }
            for altitude, details in sorted(height_map.items())
        ]
 
# Start USB reading thread
usb_thread = threading.Thread(target=read_usb_data, daemon=True)
usb_thread.start()
 
# API endpoints
@app.get('/')
def root():
    with data_lock:
        return latest_data
 
@app.get("/ws_node")
def get_ws_node():
    with data_lock:
        return latest_data["WS_Node"]
 
@app.get("/ws_data")
def get_ws_data():
    with data_lock:
        return latest_data["WS_Data"]
 
@app.get("/ws_data/time")
def get_time():
    with data_lock:
        return latest_data["WS_Data"]["Time"]
 
@app.get("/ws_data/geojson")
def get_geojson():
    with data_lock:
        return {
            "type": "Point",
            "coordinates": [
                latest_data["WS_Data"]["longitude"],
                latest_data["WS_Data"]["latitude"]
            ]
        }
 
@app.get("/ws_data/location")
def get_location():
    with data_lock:
        return {
            "latitude": latest_data["WS_Data"]["latitude"],
            "longitude": latest_data["WS_Data"]["longitude"]
        }
 
@app.get("/ws_data/height")
def get_height():
    with data_lock:
        return latest_data["WS_Data"]["altitude"]
 
@app.get("/ws_data/internal")
def get_internal():
    with data_lock:
        return {
            "Temperature": latest_data["WS_Data"]["Internal_Temp"],
            "Humidity": latest_data["WS_Data"]["Internal_RH"],
            "Pressure": latest_data["WS_Data"]["Internal_Pres"]
        }
 
@app.get("/ws_data/temperature")
def get_temperature():
    with data_lock:
        return latest_data["WS_Data"]["Weather"]["Air_Temperature"]
 
@app.get("/ws_data/humidity")
def get_humidity():
    with data_lock:
        return latest_data["WS_Data"]["Weather"]["RH"]
 
@app.get("/inversion", response_model=Dict)
def get_inversion():
    """
    Returns the highest and lowest external temperatures recorded
    along with their altitudes and timestamps
    """
    with data_lock:
        if not historical_records:
            return {"message": "No temperature records available yet"}
        elif highest_record["altitude"]>lowest_record["altitude"]:
            inversion_intensity=highest_record["temperature"]-lowest_record["temperature"]
            inversion_height=highest_record["altitude"]-lowest_record["altitude"]
            inversion_rate=inversion_intensity/inversion_height
            return {
                "highest_temperature": highest_record["temperature"],
                "highest_altitude": highest_record["altitude"],
                "highest_timestamp": highest_record["timestamp"],
                "lowest_temperature": lowest_record["temperature"],
                "lowest_altitude": lowest_record["altitude"],
                "lowest_timestamp": lowest_record["timestamp"],
                "total_samples": len(historical_records),
                "inversion_intensity":inversion_intensity,
                "inversion_height":inversion_height,
                "inversion_rate":inversion_rate
                }
        else:
            return {
                "highest_temperature": highest_record["temperature"],
                "highest_altitude": highest_record["altitude"],
                "highest_timestamp": highest_record["timestamp"],
                "lowest_temperature": lowest_record["temperature"],
                "lowest_altitude": lowest_record["altitude"],
                "lowest_timestamp": lowest_record["timestamp"],
                "total_samples": len(historical_records),
                "inversion_intensity":0,
                "inversion_height":0,
                "inversion_rate":0
            }

@app.get("/records/grouped_by_height")
def get_grouped_records():
    """
    Endpoint to retrieve grouped records by altitude with average temperatures.
    """
    with data_lock:
        if not grouped_records:
            process_records_by_height()  # Process records if not already grouped
        return {"grouped_records": grouped_records}
 
import random
@app.get("/records/height_and_temperature")
def get_height_and_temperature(bin_size: int = 1):
    """
    Endpoint to retrieve altitude bins with average Air_Temperature and RH.
    """
    with data_lock:
        # Generate random data for testing
        # random_records = [
        #     {
        #         "altitude": random.uniform(0, 100),  # Altitude between 0 and 100 meters
        #         "temperature": random.uniform(15, 35),  # Temperature between 15°C and 35°C
        #         "humidity": random.uniform(30, 70),  # Humidity between 30% and 70%
        #     }
        #     for _ in range(100)  # Generate 100 random records
        # ]
        # Dictionary to store altitude bins
        # predefined_records = [
        #     {"altitude": 0.5, "temperature": 24.3, "humidity": 45},
        #     {"altitude": 1.5, "temperature": 24.6, "humidity": 46},
        #     {"altitude": 2.5, "temperature": 24.4, "humidity": 47},
        #     {"altitude": 3.5, "temperature": 24.9, "humidity": 48},
        #     {"altitude": 4.5, "temperature": 25.1, "humidity": 49},
        #     {"altitude": 5.5, "temperature": 24.8, "humidity": 50},
        #     {"altitude": 6.5, "temperature": 25.2, "humidity": 51},
        #     {"altitude": 7.5, "temperature": 24.7, "humidity": 52},
        # # ]
        # predefined_records = [
        #     {"altitude": 0.5, "temperature": 17.3, "humidity": 85},
        #     {"altitude": 1.5, "temperature": 17.6, "humidity": 83},
        #     {"altitude": 2.5, "temperature": 17.4, "humidity": 81},
        #     {"altitude": 3.5, "temperature": 17.9, "humidity": 79},
        #     {"altitude": 4.5, "temperature": 18.1, "humidity": 77},
        #     {"altitude": 5.5, "temperature": 18.8, "humidity": 75},
        #     {"altitude": 6.5, "temperature": 18.2, "humidity": 73},
        #     {"altitude": 7.5, "temperature": 18.7, "humidity": 71},
        #     {"altitude": 9.5, "temperature": 19.3, "humidity": 69},
        #     {"altitude": 10.5, "temperature": 19.6, "humidity": 67},
        #     {"altitude": 11.5, "temperature": 19.4, "humidity": 65},
        #     {"altitude": 12.5, "temperature": 19.9, "humidity": 63},
        #     {"altitude": 14.5, "temperature": 20.1, "humidity": 61},
        #     {"altitude": 15.5, "temperature": 20.8, "humidity": 59},
        #     {"altitude": 16.5, "temperature": 21.2, "humidity": 57},
        #     {"altitude": 17.5, "temperature": 21.7, "humidity": 55},
        #     {"altitude": 18.5, "temperature": 21.6, "humidity": 53},
        #     {"altitude": 19.5, "temperature": 22.4, "humidity": 51},
        #     {"altitude": 20.5, "temperature": 22.9, "humidity": 49},
        #     {"altitude": 21.5, "temperature": 23.1, "humidity": 47},
        #     {"altitude": 22.5, "temperature": 23.8, "humidity": 45},
        #     {"altitude": 23.5, "temperature": 23.2, "humidity": 43},
        #     {"altitude": 24.5, "temperature": 23.7, "humidity": 41},
        #     {"altitude": 25.5, "temperature": 24.5, "humidity": 39},
        #     {"altitude": 26.5, "temperature": 24.7, "humidity": 37},
        #     {"altitude": 27.5, "temperature": 25.0, "humidity": 35},
        #     {"altitude": 28.5, "temperature": 25.2, "humidity": 33},
        #     {"altitude": 29.5, "temperature": 25.7, "humidity": 31},
        # ]
        altitude_bins = {}

        for record in historical_records:
            altitude = record.get("altitude")
            temperature = record.get("temperature")
            # humidity = latest_data["WS_Data"]["Weather"].get("RH")
            humidity = record.get("humidity")

            if altitude is not None and temperature is not None and humidity is not None:
                # Determine the bin for the current altitude
                bin_start = (altitude // bin_size) * bin_size
                bin_end = bin_start + bin_size
                bin_label = f"{bin_start}-{bin_end}m"

                # Initialize bin if not already present
                if bin_label not in altitude_bins:
                    altitude_bins[bin_label] = {"temperatures": [], "humidities": []}

                # Add data to the bin
                altitude_bins[bin_label]["temperatures"].append(temperature)
                altitude_bins[bin_label]["humidities"].append(humidity)

        # Compute averages for each bin
        height_and_temperature = [
            {
                "altitude_bin": bin_label,
                "average_temperature": sum(bin_data["temperatures"]) / len(bin_data["temperatures"]),
                "average_humidity": sum(bin_data["humidities"]) / len(bin_data["humidities"])
            }
            for bin_label, bin_data in sorted(altitude_bins.items())
        ]

        return height_and_temperature
 

# # Test data changing:
# import random

# def simulate_data_updates():
#     """Simulate constant updates to the latest_data structure."""
#     global latest_data
#     while True:
#         with data_lock:
#             # Update WS_Data with random or incremented values
#             latest_data["WS_Data"]["Date"] = time.strftime("%m/%d/%Y")
#             latest_data["WS_Data"]["Time"] = time.strftime("%H:%M:%S")
#             latest_data["WS_Data"]["latitude"] += random.uniform(-0.001, 0.001)
#             latest_data["WS_Data"]["longitude"] += random.uniform(-0.001, 0.001)
#             latest_data["WS_Data"]["altitude"] = f"{random.uniform(10, 20):.1f} m"
#             latest_data["WS_Data"]["Internal_Temp"] = f"{random.uniform(20, 30):.1f} °C"
#             latest_data["WS_Data"]["Internal_RH"] = f"{random.uniform(30, 50):.1f}%"
#             latest_data["WS_Data"]["Internal_Pres"] = f"{random.uniform(5, 10):.1f} kPa"
#             latest_data["WS_Data"]["Weather"]["Air_Temperature"] = f"{random.uniform(20, 30):.1f} °C"
#             latest_data["WS_Data"]["Weather"]["RH"] = f"{random.uniform(40, 60):.1f}%"
        
#         # Wait for a short interval before updating again
#         time.sleep(10)

# Start the simulation in a separate thread
# simulation_thread = threading.Thread(target=simulate_data_updates, daemon=True)
# simulation_thread.start()

 
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)