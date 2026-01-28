from csv_data_loader import cameras, incidents

print("Cameras loaded:", len(cameras))
print("Incidents loaded:", len(incidents))

if incidents:
    print("First incident ID:", incidents[0].id)
    print("First incident severity:", incidents[0].severity)
