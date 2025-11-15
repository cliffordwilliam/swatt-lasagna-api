#!/usr/bin/env bash
set -euo pipefail

APP_PID=""

cleanup() {
    if [[ -n "$APP_PID" ]]; then
        kill "$APP_PID" 2>/dev/null || true
    fi

    docker compose down
}
trap cleanup EXIT

docker compose up -d
npm run dev &
APP_PID=$!

wait $APP_PID

