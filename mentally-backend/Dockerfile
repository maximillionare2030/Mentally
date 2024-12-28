# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend project files
COPY ./mentally-backend /app

# Install dependencies for the backend
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port 8000 for FastAPI to run on
EXPOSE 8000

# Run FastAPI with uvicorn (adjusted for the path of main.py)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
