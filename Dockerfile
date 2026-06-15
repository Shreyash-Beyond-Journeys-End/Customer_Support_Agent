# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set up a non-root user (Hugging Face Spaces requirement)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory
WORKDIR $HOME/app

# Copy the current directory contents into the container at $HOME/app
COPY --chown=user . $HOME/app

# Install Python dependencies
RUN pip install --no-cache-dir -r Backend/requirements.txt

# Install Node.js dependencies and build Next.js frontend
WORKDIR $HOME/app/Frontend
# We set NEXT_PUBLIC_API_URL to /api so the frontend routes backend requests via Next.js rewrites
RUN echo "NEXT_PUBLIC_API_URL=/api" > .env.local
RUN npm install
RUN npm run build

# Return to app root
WORKDIR $HOME/app

# Create a startup script that runs both FastAPI and Next.js
RUN echo '#!/bin/bash\n\
# Start the FastAPI backend in the background on port 8000\n\
cd Backend\n\
uvicorn main:app --host 127.0.0.1 --port 8000 &\n\
\n\
# Start the Next.js frontend on port 7860\n\
cd ../Frontend\n\
PORT=7860 npm start\n\
' > start.sh

RUN chmod +x start.sh

# Expose port 7860 to the outside world
EXPOSE 7860

# Run the startup script
CMD ["./start.sh"]
