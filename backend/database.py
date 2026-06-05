import sqlite3

DATABASE = "fraud.db"

def create_table():

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL,
            prediction TEXT,
            fraud_probability REAL,
            risk_level TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def save_transaction(
    amount,
    prediction,
    fraud_probability,
    risk_level
):

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO transactions(
            amount,
            prediction,
            fraud_probability,
            risk_level
        )
        VALUES (?,?,?,?)
    """,
    (
        amount,
        prediction,
        fraud_probability,
        risk_level
    ))

    conn.commit()
    conn.close()


def get_recent_transactions():

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM transactions
        ORDER BY id DESC
        LIMIT 20
    """)

    rows = cursor.fetchall()

    conn.close()

    return rows