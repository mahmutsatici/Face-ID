from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import face_recognition
import cv2
import os
import json

app = Flask(__name__)

# Bilinen yüzler ve kullanıcı bilgileri
FACE_DIR = "faces"
KNOWN_FACES = []  # Yüz encoding'leri
USER_DATA = []  # Kullanıcı bilgileri

# Kullanıcıları yükle
def load_users():
    try:
        with open('users.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Kullanıcıları kaydet
def save_users(users):
    with open('users.json', 'w') as file:
        json.dump(users, file, indent=4)



def load_known_faces_and_users():
    global KNOWN_FACES, USER_DATA

    # Kullanıcı bilgilerini JSON dosyasından yükle
    USER_DATA = load_users()

    # Bilinen yüzleri yükle
    for user in USER_DATA:
        filepath = os.path.join(FACE_DIR, user['face'])
        if os.path.exists(filepath):  # Dosya varsa işle
            image = face_recognition.load_image_file(filepath)
            encodings = face_recognition.face_encodings(image)
            if encodings:  # Eğer yüz encoding bulunursa
                KNOWN_FACES.append(encodings[0])

load_known_faces_and_users()  # Yüzleri ve kullanıcıları yükle

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/check_normal_login', methods=['POST'])
def check_normal_login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    for user in USER_DATA:
        if user['email'] == email and user['password'] == password:
            return jsonify({
                'success': True,
                'name': user['name']
            })
    
    return jsonify({'success': False})

@app.route('/recognize', methods=['POST'])
def recognize():
    file = request.files.get('image')
    if not file:
        return jsonify({'success': False, 'message': 'No image uploaded'})

    # Görüntüyü yükle ve OpenCV formatına dönüştür
    img = face_recognition.load_image_file(file)
    face_locations = face_recognition.face_locations(img)
    face_encodings = face_recognition.face_encodings(img, face_locations)

    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(KNOWN_FACES, face_encoding, tolerance=0.4)
        face_distances = face_recognition.face_distance(KNOWN_FACES, face_encoding)

        if True in matches:
            best_match_index = matches.index(True)
            if face_distances[best_match_index] < 0.4:
                recognized_user = USER_DATA[best_match_index]
                return jsonify({
                    'success': True,
                    'name': recognized_user['name'],
                    'email': recognized_user['email']
                })

    return jsonify({'success': False, 'message': 'Face not recognized'})

@app.route('/home/<name>')
def home(name):
    return render_template('home.html', name=name)

@app.route('/user_list/<name>')
def user_list(name):
    users = load_users()  # Load users from the JSON file
    return render_template('user_list.html', users=users, name=name)

# Fotoğrafları sunmak için özel rota
@app.route('/faces/<filename>')
def serve_face(filename):
    return send_from_directory('faces', filename)

@app.route('/add_user', methods=['GET', 'POST'])
def add_user():
    # 'name' parametresini URL'den almak
    name = request.args.get('name')

    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        file = request.files.get('image')

        if not name or not email or not password or not file:
            return jsonify({'success': False, 'message': 'Eksik bilgi'})

        # Görüntüyü kaydet
        face_filename = f"{name.lower().replace(' ', '_')}.jpg"
        filepath = os.path.join(FACE_DIR, face_filename)
        file.save(filepath)

        # Kullanıcı bilgilerini JSON'a ekle
        new_user = {
            "face": face_filename,
            "name": name,
            "email": email,
            "password": password
        }

        users = load_users()
        users.append(new_user)
        save_users(users)

        # Yüzü ve kullanıcıyı belleğe yükle
        image = face_recognition.load_image_file(filepath)
        encodings = face_recognition.face_encodings(image)
        if encodings:
            KNOWN_FACES.append(encodings[0])
            USER_DATA.append(new_user)

        return redirect(url_for('index'))

    # Eğer 'name' parametresi yoksa, boş değerle devam et
    return render_template('add_user.html', name=name)
@app.route('/delete_user/<name>', methods=['POST'])
def delete_user(name):
    users = load_users()

    user_index = None  # Kullanıcının indeksini saklamak için
    user_to_delete = None

    for index, user in enumerate(users):
        if user['name'] == name:
            user_index = index
            user_to_delete = user
            break  # Kullanıcıyı bulduk, döngüden çık

    if user_to_delete:
        users.pop(user_index) # kullanıcıyı users listesinden sil
        save_users(users)

        face_filename = user_to_delete['face']
        face_filepath = os.path.join(FACE_DIR, face_filename)
        if os.path.exists(face_filepath):
            os.remove(face_filepath)

        # ÖNEMLİ DÜZELTME: Doğru indeks kullanılarak silme
        for i, u in enumerate(USER_DATA):
            if u["name"] == name:
                KNOWN_FACES.pop(i)
                USER_DATA.pop(i)
                break
        return redirect(url_for('user_list', name=name))
    else:
        return f"User '{name}' not found."

if __name__ == '__main__':
    app.run(debug=True)
