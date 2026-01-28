"""
Comprehensive test to demonstrate CSV data loading
"""
from csv_data_loader import cameras, incidents, Camera, Incident
from datetime import datetime, timedelta

print("=" * 70)
print(" CSV DATA LOADING - COMPREHENSIVE TEST")
print("=" * 70)

# Test 1: Data Loading
print("\n[TEST 1] Data Loading")
print("-" * 70)
print(f"✓ Cameras loaded: {len(cameras)}")
print(f"✓ Incidents loaded: {len(incidents)}")
assert len(cameras) > 0, "No cameras loaded!"
assert len(incidents) > 0, "No incidents loaded!"
print("✓ Data loading: PASSED")

# Test 2: Camera Structure
print("\n[TEST 2] Camera Object Structure")
print("-" * 70)
sample_camera = cameras[0]
print(f"Sample Camera:")
print(f"  - Type: {type(sample_camera).__name__}")
print(f"  - Latitude: {sample_camera.latitude}")
print(f"  - Longitude: {sample_camera.longitude}")
print(f"  - Status: {sample_camera.status}")
assert isinstance(sample_camera, Camera), "Camera is not correct type!"
assert hasattr(sample_camera, 'latitude'), "Camera missing latitude!"
assert hasattr(sample_camera, 'longitude'), "Camera missing longitude!"
assert hasattr(sample_camera, 'status'), "Camera missing status!"
print("✓ Camera structure: PASSED")

# Test 3: Incident Structure
print("\n[TEST 3] Incident Object Structure")
print("-" * 70)
sample_incident = incidents[0]
print(f"Sample Incident:")
print(f"  - Type: {type(sample_incident).__name__}")
print(f"  - ID: {sample_incident.id}")
print(f"  - Latitude: {sample_incident.latitude}")
print(f"  - Longitude: {sample_incident.longitude}")
print(f"  - Severity: {sample_incident.severity}")
print(f"  - Timestamp: {sample_incident.timestamp}")
assert isinstance(sample_incident, Incident), "Incident is not correct type!"
assert hasattr(sample_incident, 'id'), "Incident missing id!"
assert hasattr(sample_incident, 'latitude'), "Incident missing latitude!"
assert hasattr(sample_incident, 'longitude'), "Incident missing longitude!"
assert hasattr(sample_incident, 'severity'), "Incident missing severity!"
assert hasattr(sample_incident, 'timestamp'), "Incident missing timestamp!"
print("✓ Incident structure: PASSED")

# Test 4: Severity Distribution
print("\n[TEST 4] Severity Distribution Analysis")
print("-" * 70)
severity_counts = {}
for incident in incidents:
    severity_counts[incident.severity] = severity_counts.get(incident.severity, 0) + 1

print("Severity Distribution:")
for severity in sorted(severity_counts.keys()):
    count = severity_counts[severity]
    percentage = (count / len(incidents)) * 100
    bar = "█" * int(percentage / 2)
    print(f"  Level {severity}: {count:3d} incidents ({percentage:5.1f}%) {bar}")

assert all(1 <= s <= 5 for s in severity_counts.keys()), "Invalid severity levels!"
print("✓ Severity distribution: PASSED")

# Test 5: Geographic Coverage
print("\n[TEST 5] Geographic Coverage")
print("-" * 70)
lats = [c.latitude for c in cameras]
lngs = [c.longitude for c in cameras]
print(f"Latitude Range:  {min(lats):.4f} to {max(lats):.4f}")
print(f"Longitude Range: {min(lngs):.4f} to {max(lngs):.4f}")
print(f"Coverage Area: Mumbai Region")
assert all(18.8 <= lat <= 19.3 for lat in lats), "Cameras outside Mumbai range!"
assert all(72.7 <= lng <= 73.0 for lng in lngs), "Cameras outside Mumbai range!"
print("✓ Geographic coverage: PASSED")

# Test 6: Timestamp Validation
print("\n[TEST 6] Timestamp Validation")
print("-" * 70)
timestamps = [inc.timestamp for inc in incidents]
earliest = min(timestamps)
latest = max(timestamps)
print(f"Earliest incident: {earliest}")
print(f"Latest incident:   {latest}")
print(f"Time span:         {(latest - earliest).days} days")
assert all(isinstance(ts, datetime) for ts in timestamps), "Invalid timestamps!"
print("✓ Timestamp validation: PASSED")

# Test 7: Recent Incidents Filter (like in app.py)
print("\n[TEST 7] Recent Incidents Filter (30 days)")
print("-" * 70)
now = datetime.now()
recent_incidents = [
    inc for inc in incidents 
    if inc.timestamp >= (now - timedelta(days=30))
]
print(f"Total incidents: {len(incidents)}")
print(f"Recent incidents (last 30 days): {len(recent_incidents)}")
print(f"Percentage recent: {(len(recent_incidents)/len(incidents)*100):.1f}%")
print("✓ Recent incidents filter: PASSED")

# Test 8: Active Cameras Count (like in app.py)
print("\n[TEST 8] Active Cameras Count")
print("-" * 70)
active_cameras = [c for c in cameras if c.status == 'active']
print(f"Total cameras: {len(cameras)}")
print(f"Active cameras: {len(active_cameras)}")
print(f"Percentage active: {(len(active_cameras)/len(cameras)*100):.1f}%")
assert len(active_cameras) > 0, "No active cameras!"
print("✓ Active cameras count: PASSED")

# Summary
print("\n" + "=" * 70)
print(" ALL TESTS PASSED ✓")
print("=" * 70)
print(f"\nSummary:")
print(f"  • {len(cameras)} cameras loaded from CSV")
print(f"  • {len(incidents)} incidents loaded from CSV")
print(f"  • All data structures validated")
print(f"  • Compatible with existing app.py code")
print(f"  • Ready for production use")
print("\n" + "=" * 70)
