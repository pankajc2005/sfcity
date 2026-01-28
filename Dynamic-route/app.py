from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
import os
import math
import requests
import time
from datetime import timedelta
import traceback
import json

load_dotenv()

from csv_data_loader import cameras, incidents, Incident

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safety.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models (Commented out for mock data usage)
# class Incident(db.Model):
#     __tablename__ = 'incidents'
#     id = db.Column(db.Integer, primary_key=True)
#     latitude = db.Column(db.Float, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     severity = db.Column(db.Integer, nullable=False)  # 1-5 scale
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# class Camera(db.Model):
#     __tablename__ = 'cameras'  # Changed from cctv_cameras
#     id = db.Column(db.Integer, primary_key=True)
#     latitude = db.Column(db.Float, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     status = db.Column(db.String(20), default='active')

# Initialize database
def init_db():
    print("Initializing database...")
    try:
        db.create_all()
        print("Database tables created successfully")
        
        # Add test cameras if none exist
        if Camera.query.count() == 0:
            print("Adding test cameras...")
            test_cameras = [
                Camera(latitude=19.0760, longitude=72.8777, status='active'),  # Mumbai Central
                Camera(latitude=19.0330, longitude=72.8477, status='active'),  # Colaba
                Camera(latitude=19.1136, longitude=72.8697, status='active'),  # Dadar
                Camera(latitude=19.0596, longitude=72.8295, status='active'),  # Churchgate
            ]
            for camera in test_cameras:
                db.session.add(camera)
            
            # Add test incidents
            test_incidents = [
                Incident(latitude=19.0700, longitude=72.8700, severity=3, 
                        timestamp=datetime.now()),
                Incident(latitude=19.0400, longitude=72.8500, severity=1, 
                        timestamp=datetime.now()),
            ]
            for incident in test_incidents:
                db.session.add(incident)
            
            db.session.commit()
            print("Test data added successfully")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        traceback.print_exc()

# Database initialization skipped for mock data usage
# with app.app_context():
#     init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/safe-route', methods=['POST'])
def find_safe_route():
    try:
        data = request.get_json()
        print(f"Received route request: {data}")

        if not data or 'start' not in data or 'end' not in data:
            return jsonify({"error": "Missing start or end coordinates"}), 400
            
        start = data['start']
        end = data['end']
        
        # Validate coordinates
        if not all(key in start for key in ['lat', 'lng']) or not all(key in end for key in ['lat', 'lng']):
            return jsonify({"error": "Invalid coordinate format"}), 400
            
        try:
            # Convert coordinates to float and validate ranges
            start_lat = float(start['lat'])
            start_lng = float(start['lng'])
            end_lat = float(end['lat'])
            end_lng = float(end['lng'])
            
            if not (-90 <= start_lat <= 90) or not (-180 <= start_lng <= 180) or \
               not (-90 <= end_lat <= 90) or not (-180 <= end_lng <= 180):
                return jsonify({"error": "Coordinates out of valid range"}), 400
                
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid coordinate values"}), 400

        print(f"Using coordinates - Start: {start}, End: {end}")

        # Filter recent incidents (mock logic)
        recent_incidents = [
            inc for inc in incidents 
            if inc.timestamp >= (datetime.now() - timedelta(days=30))
        ]

        print(f"Found {len(cameras)} cameras and {len(recent_incidents)} recent incidents")

        # Get the route
        route_data = calculate_safe_route(start, end, cameras, recent_incidents)
        if 'error' in route_data:
            return jsonify({"error": route_data['error']}), 500

        # Add incidents to the response
        incident_data = [{
            'latitude': incident.latitude,
            'longitude': incident.longitude,
            'severity': incident.severity,
            'timestamp': incident.timestamp.isoformat()
        } for incident in recent_incidents]

        # Add incidents to the response
        route_data['incidents'] = incident_data

        return jsonify(route_data)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/report-incident', methods=['POST'])
def report_incident():
    """Report a safety incident at a location"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['latitude', 'longitude', 'severity']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
            
        # Validate coordinates
        try:
            lat = float(data['latitude'])
            lng = float(data['longitude'])
            if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid coordinates"}), 400
            
        # Validate severity (1-5)
        try:
            severity = int(data['severity'])
            if not (1 <= severity <= 5):
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({"error": "Severity must be an integer between 1 and 5"}), 400
        
        # Create and save the incident
        new_incident = Incident(
            latitude=lat,
            longitude=lng,
            severity=severity,
            timestamp=datetime.utcnow()
        )
        
        # Add to in-memory list
        new_incident.id = len(incidents) + 1
        incidents.append(new_incident)
        
        return jsonify({
            "message": "Incident reported successfully",
            "incident_id": new_incident.id
        })
        
    except Exception as e:
        print(f"Error reporting incident: {str(e)}")
        traceback.print_exc()
        # db.session.rollback()
        return jsonify({"error": "Failed to report incident"}), 500

def get_osrm_route(start, end):
    """Get a single route from OSRM"""
    try:
        print(f"Requesting OSRM route from {start} to {end}")
        
        # Construct OSRM URL with coordinates
        url = f"http://router.project-osrm.org/route/v1/driving/{start['lng']},{start['lat']};{end['lng']},{end['lat']}?steps=true&geometries=geojson&overview=full"
        print(f"OSRM URL: {url}")
        
        # Make request to OSRM
        response = requests.get(url, timeout=10)
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if not response.ok:
            print(f"OSRM request failed with status {response.status_code}")
            print(f"Response content: {response.text[:500]}")  # Print first 500 chars to avoid flooding logs
            raise Exception(f"Failed to get response from OSRM. Status: {response.status_code}")

        # Try to parse JSON and catch specific JSON decode errors
        try:
            data = response.json()
        except json.JSONDecodeError as je:
            print(f"JSON decode error: {str(je)}")
            print(f"Response content (first 500 chars): {response.text[:500]}")
            raise Exception(f"Failed to parse OSRM response as JSON: {str(je)}")

        print(f"OSRM response parsed successfully")
        print(f"OSRM response: {data}")  # Debug log
        
        if data.get('code') != 'Ok':
            print(f"OSRM error response: {data}")
            raise Exception(f"OSRM error: {data.get('message', 'Unknown error')}")

        if 'routes' not in data or not data['routes']:
            raise Exception("No routes found in OSRM response")

        # Get the first route
        route = data['routes'][0]
        
        # Extract coordinates from the GeoJSON geometry
        if 'geometry' not in route or 'coordinates' not in route['geometry']:
            raise Exception("Invalid route geometry from OSRM")
            
        # Convert coordinates from [lon, lat] to [lat, lon] format
        coordinates = [[point[1], point[0]] for point in route['geometry']['coordinates']]
        
        # Format duration
        duration_mins = int(route['duration'] / 60)
        duration_text = f"{duration_mins} min" if duration_mins < 60 else f"{duration_mins // 60} hr {duration_mins % 60} min"
        
        route_data = {
            "coordinates": coordinates,
            "distance": round(route['distance'] / 1000, 1),  # Convert to km and round
            "duration": duration_text
        }
        
        print(f"Route processed successfully with {len(coordinates)} points")
        return route_data
        
    except Exception as e:
        print(f"Error getting OSRM route: {str(e)}")
        traceback.print_exc()
        return None

def calculate_safe_route(start, end, cameras, incidents):
    try:
        print("Starting route calculation")
        
        # Get single route from OSRM
        route = get_osrm_route(start, end)
        if not route:
            raise Exception("Could not get route from OSRM")
        
        # Calculate safety scores
        print("Calculating safety scores")
        waypoints = [{"lat": coord[0], "lng": coord[1]} for coord in route['coordinates']]
        
        try:
            cctv_score = calculate_cctv_coverage(waypoints, cameras)
            incident_score = calculate_incident_risk(waypoints, incidents)
            print(f"Safety scores calculated - CCTV: {cctv_score}, Incident: {incident_score}")
        except Exception as e:
            print(f"Error calculating safety scores: {str(e)}")
            traceback.print_exc()
            raise Exception(f"Failed to calculate safety scores: {str(e)}")
        
        # Base safety score (minimum 23%)
        base_score = 23
        
        # Calculate weighted scores with higher penalty for high-risk areas
        cctv_weight = 0.6
        incident_weight = 0.4  # Increased weight for incidents
        
        # Calculate total score with base score
        weighted_cctv = cctv_score * cctv_weight
        weighted_incident = incident_score * incident_weight
        total_score = base_score + weighted_cctv - (weighted_incident * 1.5)  # Increased penalty for incidents
        
        # Ensure minimum 23% and maximum 100%
        safety_percentage = max(23, min(100, total_score))
        
        # Format route for response
        formatted_route = {
            "name": "Recommended Route",
            "description": get_route_description(safety_percentage, cctv_score, incident_score),
            "route": route['coordinates'],
            "safety_score": round(safety_percentage),
            "safety_percentage": safety_percentage,
            "cctv_coverage": f"{round(cctv_score)}%",
            "distance": route['distance'],
            "duration": route['duration'],
            "color": get_safety_color(safety_percentage)
        }
        
        print(f"Route calculation complete. Safety score: {round(safety_percentage)}%")
        return {
            "routes": [formatted_route],
            "nearby_cameras": len([c for c in cameras if c.status == 'active']),
            "recent_incidents": len(incidents)
        }
        
    except Exception as e:
        print(f"Error in calculate_safe_route: {str(e)}")
        traceback.print_exc()
        return {
            "error": str(e),
            "routes": [],
            "nearby_cameras": 0,
            "recent_incidents": 0
        }

def get_route_description(safety_score, cctv_score, incident_score):
    """Generate a descriptive message about the route's safety"""
    if safety_score >= 80:
        return f"Very safe route with {round(cctv_score)}% CCTV coverage"
    elif safety_score >= 50:
        return f"Moderately safe route, {round(cctv_score)}% CCTV coverage"
    else:
        return f"Exercise caution on this route, {round(cctv_score)}% CCTV coverage"

def get_safety_color(safety_score):
    """Return color based on safety score"""
    if safety_score >= 80:
        return "#28a745"  # Green for high safety
    elif safety_score >= 50:
        return "#ffc107"  # Yellow for medium safety
    else:
        return "#dc3545"  # Red for lower safety

def calculate_cctv_coverage(waypoints, cameras):
    """Calculate CCTV coverage percentage for a route"""
    try:
        if not waypoints or not cameras:
            print("No waypoints or cameras provided for CCTV coverage calculation")
            return 0
            
        total_points = len(waypoints)
        covered_points = 0
        camera_range = 0.1  # 100 meters in degrees (approximately)
        
        print(f"Calculating CCTV coverage for {total_points} waypoints and {len(cameras)} cameras")
        
        for point in waypoints:
            for camera in cameras:
                if camera.status != 'active':
                    continue
                    
                distance = calculate_distance(
                    point['lat'], point['lng'],
                    camera.latitude, camera.longitude
                )
                
                if distance <= camera_range:
                    covered_points += 1
                    break  # Point is covered, move to next point
        
        coverage = (covered_points / total_points) * 100 if total_points > 0 else 0
        print(f"CCTV Coverage: {coverage}% ({covered_points}/{total_points} points covered)")
        return coverage
        
    except Exception as e:
        print(f"Error calculating CCTV coverage: {str(e)}")
        traceback.print_exc()
        return 0

def calculate_incident_risk(waypoints, incidents):
    """Calculate safety score based on reported incidents near the route"""
    try:
        if not waypoints or not incidents:
            print("No waypoints or incidents provided for risk calculation")
            return 0  # Changed to 0 to indicate no risk data
            
        total_points = len(waypoints)
        risk_points = 0
        incident_range = 0.2  # Increased range to 200 meters
        high_risk_range = 0.1  # 100 meters for high-risk areas
        
        print(f"Calculating incident risk for {total_points} waypoints and {len(incidents)} incidents")
        
        for point in waypoints:
            point_risk = 0
            for incident in incidents:
                distance = calculate_distance(
                    point['lat'], point['lng'],
                    incident.latitude, incident.longitude
                )
                
                # Calculate risk based on distance and severity
                if distance <= high_risk_range:
                    point_risk = max(point_risk, incident.severity * 2)  # Double risk for very close incidents
                elif distance <= incident_range:
                    point_risk = max(point_risk, incident.severity)
            
            risk_points += point_risk
        
        # Calculate average risk and convert to safety score
        avg_risk = (risk_points / total_points) if total_points > 0 else 0
        safety_score = max(0, 100 - (avg_risk * 20))  # Convert risk to safety score
        
        print(f"Incident Safety Score: {safety_score}% (risk points: {risk_points}/{total_points})")
        return safety_score
        
    except Exception as e:
        print(f"Error calculating incident risk: {str(e)}")
        traceback.print_exc()
        return 0  # Return 0 risk if calculation fails

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in kilometers using Haversine formula"""
    try:
        R = 6371  # Earth's radius in kilometers
        
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        distance = R * c
        
        return distance
    except Exception as e:
        print(f"Error calculating distance: {str(e)}")
        return float('inf')  # Return infinite distance on error to avoid false positives

if __name__ == '__main__':
    app.run(debug=True)
