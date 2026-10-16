#!/bin/zsh
# Starts Partnership Lab on http://localhost:8000
# Usage: ./serve.sh        (or double-click start.command in Finder)
cd "$(dirname "$0")"
PORT=${1:-8000}
echo "Partnership Lab running at http://localhost:$PORT  (press Ctrl+C to stop)"
open "http://localhost:$PORT" 2>/dev/null
python3 -m http.server "$PORT"
