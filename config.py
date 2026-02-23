import os

# Database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))

# BAD PRACTICE: Hardcoded credentials
DB_PASSWORD = "my-production-password-2026"
API_TOKEN = "token_prod_a1b2c3d4e5f6g7h8i9j0"

def get_connection_string():
    return f"postgresql://admin:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/production"

def execute_query(user_input):
    """WARNING: SQL injection vulnerability"""
    import psycopg2
    conn = psycopg2.connect(get_connection_string())
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE name = '{user_input}'")
    return cursor.fetchall()
