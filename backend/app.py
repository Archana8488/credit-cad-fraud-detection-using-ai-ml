from flask import Flask
from flask_cors import CORS

from database import create_table
from routes.fraud_routes import fraud_bp

app = Flask(__name__)

CORS(app)

create_table()

app.register_blueprint(fraud_bp)

@app.route("/")
def home():
    return {
        "message":"Credit Card Fraud Detection API Running"
    }

if __name__ == "__main__":
    app.run(debug=True)