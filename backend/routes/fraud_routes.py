from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import sqlite3

from database import (
    save_transaction,
    get_recent_transactions
)

fraud_bp = Blueprint("fraud", __name__)

model = joblib.load("model/fraud_model.pkl")

df = pd.read_csv("dataset/creditcard.csv")


@fraud_bp.route("/predict", methods=["POST"])
def predict():

    data = request.json

    features = data["features"]

    prediction = model.predict([features])[0]

    probability = model.predict_proba([features])[0]

    fraud_probability = round(
        probability[1] * 100,
        2
    )

    if fraud_probability >= 80:
        risk_level = "High"
    elif fraud_probability >= 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    result = (
        "Fraud"
        if prediction == 1
        else "Legitimate"
    )

    amount = features[-1]

    save_transaction(
        amount,
        result,
        fraud_probability,
        risk_level
    )

    return jsonify({
        "prediction": result,
        "fraud_probability": fraud_probability,
        "risk_level": risk_level,
        "amount": amount
    })


@fraud_bp.route("/dashboard-stats")
def dashboard_stats():

    total_dataset = len(df)

    fraud_dataset = len(
        df[df["Class"] == 1]
    )

    legit_dataset = len(
        df[df["Class"] == 0]
    )

    conn = sqlite3.connect("fraud.db")

    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM transactions"
    )

    total_predictions = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*)
        FROM transactions
        WHERE prediction='Fraud'
    """)

    fraud_detected = cursor.fetchone()[0]

    conn.close()

    return jsonify({

        "dataset_transactions":
            total_dataset,

        "dataset_frauds":
            fraud_dataset,

        "dataset_legitimate":
            legit_dataset,

        "total_predictions":
            total_predictions,

        "fraud_detected":
            fraud_detected,

        "accuracy":
            98.4
    })


@fraud_bp.route("/transactions")
def transactions():

    rows = get_recent_transactions()

    result = []

    for row in rows:

        result.append({

            "id": row[0],
            "amount": row[1],
            "prediction": row[2],
            "fraud_probability": row[3],
            "risk_level": row[4],
            "created_at": row[5]

        })

    return jsonify(result)