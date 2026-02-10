import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# ✅ SQL Server Connection
conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=IN-2TJSYP3;"
    "DATABASE=archigenai;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

# # ✅ Home Route (Fixes 404)
# @app.route("/")
# def home():
#     return "Flask is running successfully! Go to /techstack"

# # ✅ Tech Stack Route
# @app.route("/techstack", methods=["GET"])
# def get_tech_stack():
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM tech_stack")

#     rows = cursor.fetchall()
#     columns = [col[0] for col in cursor.description]

#     result = [dict(zip(columns, row)) for row in rows]

#     return jsonify(result)


@app.route("/")
def home():
    return "Flask Backend Running Successfully!"

# ✅ API Route: Get tech stack filtered by cloud
@app.route("/api/techstack", methods=["GET"])
def get_techstack():

    # Get cloud input from frontend
    cloud = request.args.get("cloud")

    if not cloud:
        return jsonify({"error": "Cloud input is required"}), 400

    query = """
        SELECT *
        FROM tech_stack
        WHERE cloud = ?
    """

    cursor = conn.cursor()
    cursor.execute(query, (cloud,))
    rows = cursor.fetchall()

    columns = [col[0] for col in cursor.description]

    result = [dict(zip(columns, row)) for row in rows]

    return jsonify(result)


# ✅ API Route: Get available technologies for autocomplete
@app.route("/api/technologies", methods=["GET"])
def get_technologies():
    """
    Fetch all available technology names from database
    Returns: Simple list of technology names
    """
    try:
        query = """
            SELECT DISTINCT tool 
            FROM tech_stack 
            ORDER BY tool
        """
        
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        
        # Return simple list of tech names
        result = [row[0] for row in rows]

        # console.log(result)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/cloud", methods=["GET"])
def get_cloud():
    """
    Fetch all cloud stack names from database
    Returns: Simple list of cloud names
    """
    try:
        query = """
            SELECT DISTINCT cloud 
            FROM tech_stack 
            WHERE cloud IS NOT NULL
            ORDER BY cloud
        """
        
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        
        # Return simple list of tech names
        result = [row[0] for row in rows]
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/country", methods=["GET"])
def get_country():
    """
    Fetch all country names from database
    Returns: Simple list of country
    """
    try:
        query = """
            SELECT country_name
            FROM country
        """
        
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        
        # Return simple list of tech names
        result = [row[0] for row in rows]
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/source-combinations", methods=["GET"])
def get_source_combinations():
    """
    Return valid Mode and Variety combinations for each Source Type
    Based on business rules
    """
    try:
        # Define the valid combinations based on your requirements
        combinations = {
            'File': {
                'modes': ['Batch', 'Real-time'],
                'varieties': ['Semi-Structured', 'Unstructured']
            },
            'Database': {
                'modes': ['Batch', 'Real-time'],
                'varieties': ['Structured', 'Semi-Structured']
            },
            'API call': {
                'modes': ['Batch'],
                'varieties': ['Semi-Structured']
            },
            'API Publisher': {
                'modes': ['Real-time'],
                'varieties': ['Semi-Structured']
            },
            'IOT': {
                'modes': ['Real-time'],
                'varieties': ['Semi-Structured', 'Unstructured']
            }
        }
        
        return jsonify(combinations)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
