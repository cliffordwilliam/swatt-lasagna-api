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
npm run build
npm start &
APP_PID=$!

echo "Adminer: http://localhost:8080/?pgsql=postgres&username=postgres&db=be_waffle_shop&password=postgres"

wait $APP_PID

