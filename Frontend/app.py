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
        response = requests.post(
            "http://35.94.15.81:3000/login",
            json={
                "username": username,
                "password": password
            }
        )

        data = response.json()

        if data["status"] == "success":
            return f"Welcome {username}!"
        else:
            return "Invalid username or password"

    except Exception as e:
        return f"Backend connection error: {e}"


# Register route
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':

        username = request.form['username']
        password = request.form['password']

        url = "http://35.94.15.81:3000/register"

        data = {
            "username": username,
            "password": password
        }

        response = requests.post(url, json=data)

        result = response.json()

        if result["status"] == "success":
            return "User registered successfully"
        else:
            return "Registration failed"

    return render_template('register.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)