# Women Safety Route Recommender

A comprehensive safety application that utilizes CCTV networks and historical incident data to recommend secure routes for women travelers in Mumbai.

## Features

- Real-time route safety analysis using CCTV network data
- Historical incident data analysis
- Interactive map interface
- Incident reporting system
- Safety score calculation
- Real-time monitoring and alerts

## Technology Stack

- Backend: Flask (Python)
- Database: SQLite with SQLAlchemy
- Frontend: HTML5, CSS3, JavaScript
- Mapping: Leaflet.js
- UI Framework: Bootstrap 5
- Data Analysis: Pandas, NumPy, Scikit-learn

## Setup Instructions

1. Clone the repository
**Create a virtual environment**:
    ```bash
    python -m venv myenv312
    ```

2.  **Activate the virtual environment**:
    - Windows:
      ```bash
      .\myenv312\Scripts\activate
      ```
    - Mac/Linux:
      ```bash
      source myenv312/bin/activate
      ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the following variables:
   ```
   SECRET_KEY=your_secret_key
   ```
5. Run the application:
   ```
   python app.py
   ```
6. Access the application at `http://localhost:5000`

## Project Structure

```
women-safety-route/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   └── css/           # CSS styles
├── templates/
│   └── index.html     # Main template
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License
currently fetching data from mocak_data