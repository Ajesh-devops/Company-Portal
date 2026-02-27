from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# Home page
@app.route("/")
def home():
    return render_template("index.html")

# Login route
@app.route("/login", methods=["POST"])
def login():

    username = request.form["username"]
    password = request.form["password"]

    try:
        # Call backend API running on EC2
        response = requests.post(
            "http://44.252.33.8:3000/login",
            json={
                "username": username,
                "password": password
            }
        )

        data = response.json()

        # Check backend response
        if data["status"] == "success":
            return f"Welcome {username}!"
        else:
            return "Invalid username or password"

    except Exception as e:
        return f"Backend connection error: {e}"


if __name__ == "__main__":
    app.run(debug=True)