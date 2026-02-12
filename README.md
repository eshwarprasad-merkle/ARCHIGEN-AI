# ARCHIGEN-AI

ARCHIGEN-AI is a Flask backend application connected to Microsoft SQL Server.

---

## Setup Guide

### 1️⃣ Install Requirements

Make sure you have:

- Python 3.8+
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- ODBC Driver 17 for SQL Server

Install required Python packages:

```bash
pip install flask flask-cors pyodbc
```

---

### 2️⃣ Configure Database Connection

Open the main Python file and update the `DB_CONFIG`:

```python
DB_CONFIG = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=YOUR_SERVER_NAME;"
    "DATABASE=YOUR_DATABASE_NAME;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)
```

You must change:

- `SERVER`
- `DATABASE`

To find your server name, run this in SSMS:

```sql
SELECT @@SERVERNAME AS 'MyFullServerName'
```

Create or use a database, and ensure the name matches what you set in `DB_CONFIG`.

---

### 3️⃣ Load Database Script

Open `ARCHGENAI_SQL_SCRIPT.sql` in SSMS and execute it on your selected database to create tables and load data.

---

### 4️⃣ Run the Application

From the project directory:

```bash
python main.py
```

---


