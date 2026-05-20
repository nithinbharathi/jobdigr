#!/bin/bash

set -e

echo "Starting JobDigr Application..."
echo "================================"

PROJECT_ROOT="/Users/nithinbharathi/Projects/JobDigr"
VENV_PATH="$PROJECT_ROOT/venv/bin/activate"

# Activate virtual environment if not already active
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "Activating Python virtual environment..."
    source "$VENV_PATH"
fi

# Start backend
echo "Starting FastAPI backend..."
echo "Backend running at: http://localhost:8000"

cd "$PROJECT_ROOT"
python -m backend.main &
BACKEND_PID=$!

# Give backend time to start
until curl -s http://localhost:8000/health > /dev/null; do
  sleep 1
done

echo "Backend is up. Starting frontend..."

echo "Frontend running at: http://localhost:5173 (Vite default)"

cd "$PROJECT_ROOT/frontend"

# Use system npm (avoid hardcoded node path)
npm run dev &
FRONTEND_PID=$!

# Handle cleanup properly
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

wait