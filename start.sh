#!/bin/bash
python app.py &
FLASK_PID=$!
npm run dev
kill $FLASK_PID
