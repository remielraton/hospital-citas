# Usa la imagen base de Python 3.9
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo el archivo de requisitos al contenedor primero
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del contenido de la aplicación al contenedor
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["python3", "app/app.py"]
