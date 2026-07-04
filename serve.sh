#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Student Portal running at http://localhost:8765/dashboard.html"
echo "Press Ctrl+C to stop."
python3 -m http.server 8765
