from flask import Flask, render_template, request, redirect, url_for, session
import os
import cv2
import pytesseract
import speech_recognition as sr

app = Flask(__name__)
app.secret_key = "random_secret_key_123"  # Required for session handling
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Tesseract Path
pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return redirect(url_for('home'))  # Redirect to home after login
    return render_template("login.html")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        return redirect(url_for('login'))  # Redirect to login after signup
    return render_template("signup.html")

@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/about_us')
def about_us():
    return render_template("about_us.html")

@app.route('/terms_conditions')
def terms_conditions():
    return render_template("terms_conditions.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/speech-to-text', methods=['GET', 'POST'])
def speech_to_text():
    text = ""
    if request.method == 'POST':
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            audio = recognizer.listen(source)
            try:
                text = recognizer.recognize_google(audio, language='ta-IN')
            except:
                text = "⚠ Error recognizing speech!"
    return render_template("speech-to-text.html", text=text)

@app.route('/text-to-speech', methods=['POST', 'GET'])
def text_to_speech():
    return render_template("text-to-speech.html")

def extract_text(image_path):
    try:
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray, lang='tam')
        return text.strip() if text.strip() else "⚠ No text found!"
    except Exception as e:
        return "⚠ Error extracting text!"

@app.route('/image-to-text', methods=['POST', 'GET'])
def upload_file():
    extracted_text = ""
    if request.method == "POST":
        if "file" not in request.files:
            return "No file part"
        
        file = request.files["file"]
        if file.filename == "":
            return "No selected file"
        
        if file:
            file_path = os.path.join("uploads", file.filename)
            os.makedirs("uploads", exist_ok=True)  # Create folder if not exists
            file.save(file_path)
            
            extracted_text = extract_text(file_path)

    return render_template("image_to_text.html", extracted_text=extracted_text)

if __name__ == '__main__':
    app.run()
