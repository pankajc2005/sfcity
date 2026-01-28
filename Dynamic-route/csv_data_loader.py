import csv
from datetime import datetime
import os

class Camera:
    def __init__(self, latitude, longitude, status='active'):
        self.latitude = latitude
        self.longitude = longitude
        self.status = status

class Incident:
    def __init__(self, latitude, longitude, severity, timestamp=None):
        self.id = None  # Will be assigned when added
        self.latitude = latitude
        self.longitude = longitude
        self.severity = severity
        self.timestamp = timestamp or datetime.utcnow()

def load_data_from_csv(csv_file_path='db/mumbai_fir_dummy_land_only.csv'):
    """
    Load incident data from CSV file and convert to Camera and Incident objects.
    
    The CSV contains FIR records with the following columns:
    - id, crimeType, date, time, latitude, longitude, area, zone, policeStation, 
      description, isAccident, isSensitiveZone
    """
    cameras = []
    incidents = []
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, csv_file_path)
    
    print(f"Loading data from: {csv_path}")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            # Track unique locations for camera placement
            camera_locations = set()
            
            for row in csv_reader:
                try:
                    # Parse coordinates
                    latitude = float(row['latitude'])
                    longitude = float(row['longitude'])
                    
                    # Parse date and time
                    date_str = row['date']
                    time_str = row['time']
                    datetime_str = f"{date_str} {time_str}"
                    timestamp = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
                    
                    # Map crime type to severity (1-5 scale)
                    crime_type = row['crimeType']
                    severity_mapping = {
                        'Theft': 1,
                        'Burglary': 2,
                        'Robbery': 2,
                        'Assault': 3,
                        'Fraud': 2,
                        'Cyber Crime': 1,
                        'Kidnapping': 4,
                        'Murder': 5
                    }
                    severity = severity_mapping.get(crime_type, 2)  # Default to 2 if unknown
                    
                    # Increase severity for sensitive zones
                    is_sensitive = row['isSensitiveZone'].lower() == 'true'
                    if is_sensitive and severity < 5:
                        severity = min(severity + 1, 5)  # Increase by 1, max 5
                    
                    # Create incident
                    incident = Incident(
                        latitude=latitude,
                        longitude=longitude,
                        severity=severity,
                        timestamp=timestamp
                    )
                    incident.id = row['id']
                    incidents.append(incident)
                    
                    # Add camera at police station locations (unique locations)
                    # We'll place cameras at each unique police station area
                    location_key = (round(latitude, 3), round(longitude, 3))  # Round to ~100m precision
                    if location_key not in camera_locations:
                        camera_locations.add(location_key)
                        camera = Camera(
                            latitude=latitude,
                            longitude=longitude,
                            status='active'
                        )
                        cameras.append(camera)
                    
                except (ValueError, KeyError) as e:
                    print(f"Error parsing row: {e}")
                    continue
        
        print(f"Loaded {len(incidents)} incidents and {len(cameras)} cameras from CSV")
        
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_path}")
        print("Using empty data lists")
    except Exception as e:
        print(f"Error loading CSV data: {e}")
        print("Using empty data lists")
    
    return cameras, incidents

# Load data when module is imported
cameras, incidents = load_data_from_csv()
