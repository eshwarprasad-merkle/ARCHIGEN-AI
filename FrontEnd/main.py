import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai


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

# Gemini API Config




def get_db_connection():
    return pyodbc.connect(DB_CONFIG)

#==================================================== Helper Function ====================================================#

# def fetch_config_values(key):
#     """Fetches a value from the app_config table by its key."""
#     try:
#         with get_db_connection() as conn:
#             print("✅ Connection established successfully")

#             # 🔎 Test the connection
#             with conn.cursor() as cursor:
#                 cursor.execute("SELECT 1")
#                 print("✅ Connection test query executed")

#                 query = "SELECT [value] FROM app_config WHERE [key] = ?"
#                 cursor.execute(query, (key,))
#                 row = cursor.fetchone()

#                 if row and row[0] is not None:
#                     return str(row[0])
#                 return None

#     except Exception as e:
#         print(f"❌ Error fetching config key '{key}': {e}")
#         return None


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
GEMINI_API_KEY = fetch_config_values("GEMINI_API_KEY")  # or store separate GEMINI key
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-pro")

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

    
@app.route("/api/technologies/filter", methods=["GET"])
def get_filtered_technologies():
    cloud = request.args.get("cloud")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Logic: Fetch tools matching the selected cloud OR where cloud is NULL
                # This covers agnostic tools like Python, Docker, Spark, etc.
                query = """
                   SELECT DISTINCT tool 
                    FROM tech_stack 
                    WHERE cloud = ? OR cloud IS NULL
                    ORDER BY tool
                    SELECT DISTINCT tool
                    FROM tech_stack
                    WHERE cloud = ? OR cloud IS NULL
                    ORDER BY tool
                """
                cursor.execute(query, (cloud,))
                tech_list = [row[0] for row in cursor.fetchall()]
                return jsonify(tech_list)
    except Exception as e:
        print(f"❌ Database Error: {e}")
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/techstack", methods=["GET","POST"])
def get_techstack():


    data = request.get_json()

    cloud = data.get('cloud_context')
    storage_solution = data.get('storage_solution') 
    source_details = data.get('source_details_history')
    tech_stack = data.get('selected_technologies')


    # print(cloud)
    # print("DataStorage is :", storage_solution)
    print("TECH STACK :" ,tech_stack)



    # SETTING FLAG CONDITION FOR STORAGE_SOLUTION

    if(storage_solution == "Data Warehouse"):
        flag =1
    else:
        flag = 0


    # values_rows = []

    # for item in source_details:
    #     source_type = item['source_types'][0]
    #     mode = item['modes'][0]

    #     values_rows.append(f"('{source_type}', '{mode}')")

    # values_clause = ",\n".join(values_rows)

    values_rows = []

    for item in source_details:
        source_type = item['source_types'][0].replace("'", "''")
        mode = item['modes'][0].replace("'", "''")

        values_rows.append(f"('{source_type}', '{mode}')")

    inline_view = ",\n".join(values_rows)



    if not cloud:
        return jsonify({"error": "Cloud input is required"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # This fetches the full rows for the table display
                query = f"""
                    WITH SRC_DET AS 
                    (
                        SELECT DISTINCT
                             source_type
                           , mode
                         , DENSE_RANK() OVER (ORDER BY source_type, mode) feed_no
                        FROM
                        (
                            VALUES
                            {inline_view}
                        ) AS source_details(source_type, mode)
                    ),
                    SRC_DET_TECH_STACK AS (
                        SELECT b.cloud, a.source_type, a.mode, a.feed_no, b.ingestion_tool, b.orchestration_tool, b.transformation_tool, b.data_warehouse, b.data_lakehouse
                      FROM SRC_DET a
                         , end_to_end_pipeline_stacks b
                     WHERE a.source_type = ISNULL(b.source_type, a.source_type)
                       AND a.mode = ISNULL(b.mode, a.mode)
                    )
                    SELECT DISTINCT a.cloud
                    , CONCAT(a.source_type, ',', b.source_type, ',', c.source_type, ',', d.source_type, ',', e.source_type, ',', f.source_type, ',', g.source_type, ',', h.source_type, ',', i.source_type, ',', j.source_type) source_type
                    , CONCAT(a.mode, ',', b.mode, ',', c.mode, ',', d.mode, ',', e.mode, ',', f.mode, ',', g.mode, ',', h.mode, ',', i.mode, ',', j.mode) mode
                    , CONCAT(a.ingestion_tool, ',', b.ingestion_tool, ',', c.ingestion_tool, ',', d.ingestion_tool, ',', e.ingestion_tool, ',', f.ingestion_tool, ',', g.ingestion_tool, ',', h.ingestion_tool, ',', i.ingestion_tool, ',', j.ingestion_tool) ingestion_tool
                    , a.orchestration_tool
                    , a.transformation_tool
                    , CASE WHEN ? = 1 THEN a.data_warehouse ELSE a.data_lakehouse END data_storage
                    FROM SRC_DET_TECH_STACK a
                    LEFT OUTER JOIN SRC_DET_TECH_STACK b ON (b.cloud = a.cloud  and b.feed_no = 2  and b.orchestration_tool = a.orchestration_tool and b.transformation_tool = a.transformation_tool and b.data_warehouse = a.data_warehouse and b.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK c ON (c.cloud = a.cloud  and c.feed_no = 3  and c.orchestration_tool = a.orchestration_tool and c.transformation_tool = a.transformation_tool and c.data_warehouse = a.data_warehouse and c.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK d ON (d.cloud = a.cloud  and d.feed_no = 4  and d.orchestration_tool = a.orchestration_tool and d.transformation_tool = a.transformation_tool and d.data_warehouse = a.data_warehouse and d.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK e ON (e.cloud = a.cloud  and e.feed_no = 5  and e.orchestration_tool = a.orchestration_tool and e.transformation_tool = a.transformation_tool and e.data_warehouse = a.data_warehouse and e.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK f ON (f.cloud = a.cloud  and f.feed_no = 6  and f.orchestration_tool = a.orchestration_tool and f.transformation_tool = a.transformation_tool and f.data_warehouse = a.data_warehouse and f.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK g ON (g.cloud = a.cloud  and g.feed_no = 7  and g.orchestration_tool = a.orchestration_tool and g.transformation_tool = a.transformation_tool and g.data_warehouse = a.data_warehouse and g.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK h ON (h.cloud = a.cloud  and h.feed_no = 8  and h.orchestration_tool = a.orchestration_tool and h.transformation_tool = a.transformation_tool and h.data_warehouse = a.data_warehouse and h.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK i ON (i.cloud = a.cloud  and i.feed_no = 9  and i.orchestration_tool = a.orchestration_tool and i.transformation_tool = a.transformation_tool and i.data_warehouse = a.data_warehouse and i.data_lakehouse = a.data_lakehouse)
                    LEFT OUTER JOIN SRC_DET_TECH_STACK j ON (j.cloud = a.cloud  and j.feed_no = 10 and j.orchestration_tool = a.orchestration_tool and j.transformation_tool = a.transformation_tool and j.data_warehouse = a.data_warehouse and j.data_lakehouse = a.data_lakehouse)
                    WHERE a.feed_no = 1
                    AND a.cloud = ?
                    ORDER BY 1,2,3,4,5,6,7
                """
                # print(query)

                cursor.execute(query, (flag,cloud))

                columns = [col[0] for col in cursor.description]
                result = [dict(zip(columns, row)) for row in cursor.fetchall()]
                # print(result)
                return jsonify(result)
    except Exception as e:
        print(f"❌ Database Error in /api/techstack: {e}")
        return jsonify({"error": str(e)}), 500
    

def build_payload(data):
    return f"""
Cloud Platform: {data.get('cloud')}
Source Type: {data.get('source_type')}
Data Processing Mode: {data.get('mode')}
Data Ingestion Method: {data.get('data_ingestion')}
Workflow Orchestration: {data.get('workflow_orchestration')}
Data Transformation Tool: {data.get('data_transformation')}
Data Lake/Warehouse: {data.get('datalake_warehouse')}
Involves Machine Learning: {data.get('involves_ml')}
Well-Defined Use Case: {data.get('well_defined')}
Architecture Confidence Score: {float(data.get('score',0)):.2f}
Recommended Rank: #{data.get('rank')}
"""


def build_prompt(payload_text):
    return f"""
You are a Senior Data Architect.

Configuration:
{payload_text}

Please provide a comprehensive, step-by-step architecture explanation for this specific configuration. Include:

1. Data ingestion layer details
2. Storage architecture
3. Processing and transformation workflows
4. Analytics and consumption layer
5. Security and governance considerations
6. Monitoring and observability setup

Explain with enterprise-level detail and real-world examples.
"""

@app.route("/api/expand_architecture", methods=["POST"])
def expand_architecture():
    try:
        data = request.get_json()

        # Build structured payload
        payload_text = build_payload(data)

        # Build Gemini prompt
        prompt = build_prompt(payload_text)

        # Call Gemini
        response = gemini_model.generate_content(prompt)

        if not response.text:
         return jsonify({"error": "Gemini returned empty response"}), 500

        return jsonify({
            "payload_sent": payload_text,
            "architecture_explanation": response.text
        })

    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"error": str(e)}), 500
    
def init_gemini():
    global gemini_model
    api_key = fetch_config_values("GEMINI_API_KEY")
    if not api_key:
        raise Exception("❌ GEMINI_API_KEY not found in DB")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel("gemini-1.5-pro")



if __name__ == "__main__":
    # Pre-load settings from DB
    load_environment_variables()
    init_gemini()
    app.run(debug=True, port=5000)