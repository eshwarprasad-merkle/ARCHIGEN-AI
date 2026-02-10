import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ SQL Server Connection Configuration
# Note: In a production environment, consider using environment variables for these strings
DB_CONFIG = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=IN-2TJSYP3;"
    "DATABASE=ArchiGenAI_new;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

def get_db_connection():
    return pyodbc.connect(DB_CONFIG)

#==================================================== Helper Function ====================================================#

def fetch_config_values(key):
    """Fetches a value from the app_config table by its key."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                query = "SELECT [value] FROM app_config WHERE [key] = ?"
                cursor.execute(query, (key,))
                row = cursor.fetchone()
                
                if row and row[0] is not None:
                    return str(row[0])
                return None
    except Exception as e:
        print(f"❌ Error fetching config key '{key}': {e}")
        return None

#==================================================== Configuration Loading ================================================#

# Dictionary to hold the global config state
app_settings = {}

def load_environment_variables():
    """
    Load all configuration keys defined in your SQL script into a global dictionary.
    """
    print("📋 Loading configuration from app_config...")
    
    # List of keys based on your SQL INSERT statement
    keys_to_load = [
        "END_POINT", "SERVICE_LINE", "BRAND", "PROJECT", "OPENAI_API_VERSION", "OPENAI_API_KEY",
        "CLOUD", "DATA_REF", "WORK_TYPE", "SOURCE_TYPE", "SOURCE_MODE", "SOURCE_VARIETY",
        "COMPLEXITY","COUNTRIES", "SERVICE_TYPE", "WORK_TYPE_NEW", "WORK_TYPE_MODIFY", "WORK_TYPE_REUSE",
        "NON_PII_SIMPLE", "NON_PII_MODERATE", "NON_PII_COMPLEX",
        "PII_SIMPLE", "PII_MODERATE", "PII_COMPLEX",
        "INIT_SIMPLE", "INIT_MODERATE", "INIT_COMPLEX",
        "MIGRATE_ROW_SIMPLE", "MIGRATE_ROW_MODERATE",
        "INGEST_COLUMN_SIMPLE", "INGEST_COLUMN_MODERATE"
    ]

    for key in keys_to_load:
        val = fetch_config_values(key)
        app_settings[key] = val
        if val:
            print(f" ✅ Loaded: {key}")
        else:
            print(f" ⚠️ Warning: Key '{key}' not found in database.")

    print("🚀 All environment variables processed.")

#==================================================== API Routes ====================================================#

@app.route("/")
def home():
    return "Flask Backend Running Successfully!"

@app.route("/api/config", methods=["GET"])
def get_config():
    """
    Generic endpoint to fetch config.
    Example: /api/config?key=SOURCE_TYPE&split=true
    """
    key = request.args.get("key")
    split = request.args.get("split", "false").lower() == "true"
    
    if not key:
        return jsonify({"error": "Missing 'key' parameter"}), 400
    
    # Check the loaded settings first, fallback to DB if not found
    value = app_settings.get(key) or fetch_config_values(key)
    
    if value is None:
        return jsonify({"error": f"No value found for key '{key}'"}), 404
    
    if split and ',' in value:
        return jsonify([item.strip() for item in value.split(',')])
    
    return jsonify(value)

# @app.route("/api/techstack", methods=["GET"])
# def get_techstack():
#     cloud = request.args.get("cloud")
#     if not cloud:
#         return jsonify({"error": "Cloud input is required"}), 400

#     try:
#         with get_db_connection() as conn:
#             with conn.cursor() as cursor:
#                 cursor.execute("SELECT * FROM tech_stack WHERE cloud = ?", (cloud,))
#                 columns = [col[0] for col in cursor.description]
#                 result = [dict(zip(columns, row)) for row in cursor.fetchall()]
#                 return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Additional specific routes for UI dropdowns
# @app.route("/api/technologies", methods=["GET"])
# def get_technologies():
#     try:
#         with get_db_connection() as conn:
#             with conn.cursor() as cursor:
#                 cursor.execute("SELECT DISTINCT tool FROM tech_stack WHERE tool IS NOT NULL ORDER BY tool")
#                 return jsonify([row[0] for row in cursor.fetchall()])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/country", methods=["GET"])
# def get_country():
#     try:
#         with get_db_connection() as conn:
#             with conn.cursor() as cursor:
#                 cursor.execute("SELECT country_name FROM country ORDER BY country_name")
#                 return jsonify([row[0] for row in cursor.fetchall()])
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#==================================================== Execution ====================================================#

if __name__ == "__main__":
    # Pre-load settings from DB
    load_environment_variables()
    app.run(debug=True, port=5000)