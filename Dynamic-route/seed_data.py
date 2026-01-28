from app import app, db, Incident, Camera
from datetime import datetime

def seed_database():
    with app.app_context():
        # Create all database tables
        db.create_all()
        
        # Clear existing data
        Incident.query.delete()
        Camera.query.delete()

        # Add CCTV cameras in Mumbai
        cameras = [
            # Railway Stations - Western Line
            Camera(latitude=18.9322, longitude=72.8264, status='active'),  # Churchgate Station
            Camera(latitude=18.9431, longitude=72.8309, status='active'),  # Marine Lines
            Camera(latitude=18.9588, longitude=72.8294, status='active'),  # Charni Road
            Camera(latitude=18.9685, longitude=72.8195, status='active'),  # Mumbai Central
            Camera(latitude=19.0176, longitude=72.8433, status='active'),  # Dadar Western
            Camera(latitude=19.0544, longitude=72.8406, status='active'),  # Bandra Station
            Camera(latitude=19.1058, longitude=72.8358, status='active'),  # Santacruz
            Camera(latitude=19.1197, longitude=72.8464, status='active'),  # Andheri Station
            Camera(latitude=19.1738, longitude=72.8493, status='active'),  # Goregaon
            Camera(latitude=19.2183, longitude=72.8429, status='active'),  # Borivali
            
            # Railway Stations - Central Line
            Camera(latitude=18.9398, longitude=72.8355, status='active'),  # CST (Chhatrapati Shivaji Terminus)
            Camera(latitude=18.9528, longitude=72.8321, status='active'),  # Masjid
            Camera(latitude=19.0176, longitude=72.8489, status='active'),  # Dadar Central
            Camera(latitude=19.0433, longitude=72.8609, status='active'),  # Matunga
            Camera(latitude=19.0728, longitude=72.8826, status='active'),  # Kurla
            Camera(latitude=19.1066, longitude=72.8903, status='active'),  # Ghatkopar
            
            # Commercial Areas - South Mumbai
            Camera(latitude=18.9220, longitude=72.8347, status='active'),  # Gateway of India
            Camera(latitude=18.9067, longitude=72.8147, status='active'),  # Colaba Causeway
            Camera(latitude=18.9254, longitude=72.8242, status='active'),  # Nariman Point
            Camera(latitude=18.9322, longitude=72.8264, status='active'),  # Fort
            Camera(latitude=18.9481, longitude=72.8258, status='active'),  # Kala Ghoda
            Camera(latitude=18.9432, longitude=72.8236, status='active'),  # Marine Drive
            
            # Shopping & Markets
            Camera(latitude=19.0521, longitude=72.8306, status='active'),  # Linking Road Bandra
            Camera(latitude=19.0570, longitude=72.8328, status='active'),  # Hill Road Bandra
            Camera(latitude=19.1075, longitude=72.8263, status='active'),  # S.V. Road Andheri
            Camera(latitude=19.0896, longitude=72.8656, status='active'),  # Phoenix Mall Kurla
            Camera(latitude=19.1136, longitude=72.8697, status='active'),  # Dadar Market
            Camera(latitude=18.9520, longitude=72.8095, status='active'),  # Crawford Market
            Camera(latitude=19.0330, longitude=72.8477, status='active'),  # Colaba Market
            
            # Major Intersections
            Camera(latitude=19.0596, longitude=72.8295, status='active'),  # Worli Sea Face
            Camera(latitude=19.0176, longitude=72.8561, status='active'),  # Parel
            Camera(latitude=19.0895, longitude=72.8634, status='active'),  # Sion Circle
            Camera(latitude=19.1470, longitude=72.8564, status='active'),  # Jogeshwari
            Camera(latitude=19.2092, longitude=72.8481, status='active'),  # Kandivali
            
            # Residential Areas
            Camera(latitude=19.1197, longitude=72.9057, status='active'),  # Powai
            Camera(latitude=19.1287, longitude=72.9194, status='active'),  # Vikhroli
            Camera(latitude=19.0469, longitude=72.8570, status='active'),  # Mahim
            Camera(latitude=19.1897, longitude=72.9726, status='active'),  # Mulund
            Camera(latitude=19.2403, longitude=72.8508, status='active'),  # Dahisar
            
            # Business Districts
            Camera(latitude=19.1076, longitude=72.8263, status='active'),  # Andheri East SEEPZ
            Camera(latitude=19.1136, longitude=72.8697, status='active'),  # BKC (Bandra Kurla Complex)
            Camera(latitude=19.1206, longitude=72.8481, status='active'),  # Western Express Highway
            
            # Tourist Spots
            Camera(latitude=18.9220, longitude=72.8347, status='active'),  # Taj Hotel
            Camera(latitude=18.9756, longitude=72.8143, status='active'),  # Haji Ali
            Camera(latitude=19.0330, longitude=72.8477, status='active'),  # Hanging Gardens
            Camera(latitude=18.9398, longitude=72.8355, status='active'),  # Victoria Terminus
            
            # Suburban Areas
            Camera(latitude=19.2467, longitude=72.8540, status='active'),  # Mira Road
            Camera(latitude=19.0423, longitude=72.9001, status='active'),  # Chembur
            Camera(latitude=19.1825, longitude=72.9717, status='active'),  # Thane Station
            Camera(latitude=19.1136, longitude=72.9083, status='active'),  # Kanjurmarg
            
            # Additional Coverage
            Camera(latitude=18.9990, longitude=73.1172, status='active'),  # Navi Mumbai
            Camera(latitude=19.0759, longitude=72.8776, status='active'),  # Mumbai Central Junction
            Camera(latitude=19.0544, longitude=72.8401, status='active'),  # Bandra West
            Camera(latitude=19.0895, longitude=72.8324, status='active'),  # Vile Parle
        ]

        # Add incidents in Mumbai
        incidents = [
            # Railway Station Areas
            Incident(latitude=18.9398, longitude=72.8360, severity=2),  # Near CST
            Incident(latitude=19.0176, longitude=72.8445, severity=1),  # Dadar area
            Incident(latitude=19.0544, longitude=72.8410, severity=2),  # Bandra Station
            
            # Commercial Areas
            Incident(latitude=18.9254, longitude=72.8245, severity=1),  # Nariman Point
            Incident(latitude=19.0521, longitude=72.8310, severity=2),  # Linking Road
            Incident(latitude=19.1136, longitude=72.8700, severity=1),  # BKC area
            
            # High-Risk Areas - Isolated spots
            Incident(latitude=18.9067, longitude=72.8150, severity=3),  # Dark spot Colaba
            Incident(latitude=19.0330, longitude=72.8480, severity=3),  # Poorly lit area
            Incident(latitude=19.0895, longitude=72.8638, severity=3),  # Isolated area Sion
            
            # Station Back Entrances
            Incident(latitude=18.9320, longitude=72.8270, severity=3),  # Churchgate back exit
            Incident(latitude=19.1197, longitude=72.8470, severity=3),  # Andheri isolated spot
            Incident(latitude=19.0728, longitude=72.8830, severity=3),  # Kurla area
            
            # Additional High-Risk Areas
            Incident(latitude=19.0596, longitude=72.8300, severity=3),  # Worli isolated spot
            Incident(latitude=19.1470, longitude=72.8570, severity=3),  # Dark area Jogeshwari
            Incident(latitude=19.2092, longitude=72.8485, severity=3),  # Poorly lit zone Kandivali
            Incident(latitude=19.1287, longitude=72.9200, severity=2),  # Vikhroli area
            Incident(latitude=18.9756, longitude=72.8150, severity=2),  # Near Haji Ali
        ]

        # Add all cameras and incidents to database
        for camera in cameras:
            db.session.add(camera)
        
        for incident in incidents:
            incident.timestamp = datetime.utcnow()  # Set current timestamp
            db.session.add(incident)

        # Commit all changes
        db.session.commit()
        print(f"Added {len(cameras)} cameras and {len(incidents)} incidents to the database")

if __name__ == '__main__':
    seed_database()
