# app/app.py
from flask import Flask, render_template, jsonify, request, redirect, url_for
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CITAS_JSON_PATH = os.path.join(BASE_DIR, 'citas.json')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro', methods=['POST'])
def registro():
    if request.method == 'POST':
        cita = {
            'especialidad': request.form['especialidad'],
            'nombre': request.form['nombre'],
            'dni': request.form['dni'],
            'direccion': request.form['direccion'],
            'seguro': request.form['seguro'],
            'fecha': request.form['fecha'],
            'hora': request.form['hora']
        }

        if not all(cita.values()):
            return 'Por favor, completa todos los campos antes de registrar.'

        guardar_cita(cita)

        return redirect(url_for('index'))

def guardar_cita(cita):
    try:
        with open(CITAS_JSON_PATH, 'r') as file:
            citas = json.load(file)
    except FileNotFoundError:
        citas = []

    citas.append(cita)

    with open(CITAS_JSON_PATH, 'w') as file:
        json.dump(citas, file, indent=2)

@app.route('/citas')
def citas():
    try:
        with open(CITAS_JSON_PATH, 'r') as file:
            citas = json.load(file)
    except FileNotFoundError:
        citas = []

    return render_template('citas.html', citas=citas)

@app.route('/eliminar/<dni>', methods=['DELETE'])
def eliminar_cita(dni):
    try:
        with open(CITAS_JSON_PATH, 'r') as file:
            citas = json.load(file)
    except FileNotFoundError:
        citas = []

    citas = [cita for cita in citas if cita['dni'] != dni]

    with open(CITAS_JSON_PATH, 'w') as file:
        json.dump(citas, file, indent=2)

    return jsonify({'message': 'Cita eliminada con éxito'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
