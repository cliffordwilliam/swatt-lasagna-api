#!/usr/bin/env bash
set -euo pipefail

APP_PID=""

cleanup() {
    if [[ -n "$APP_PID" ]]; then
        kill "$APP_PID" 2>/dev/null || true
    fi

    docker compose down -v
}
trap cleanup EXIT

docker compose up -d

echo "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker exec postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "PostgreSQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "ERROR: PostgreSQL failed to become ready after 30 attempts"
        exit 1
    fi
    echo "PostgreSQL is unavailable - sleeping (attempt $i/30)"
    sleep 1
done

echo "Running schema.sql..."
if docker exec -i postgres psql -U postgres -d swatt_lasagna_api -q < db/migrations/sql/schema.sql; then
    echo "Schema migration completed successfully"
else
    echo "Schema migration failed"
    exit 1
fi

echo "Running seed.sql..."
if docker exec -i postgres psql -U postgres -d swatt_lasagna_api -q < db/migrations/sql/seed.sql; then
    echo "Seed data loaded successfully"
else
    echo "Seed data loading failed"
    exit 1
fi

npm run dev &
APP_PID=$!

wait $APP_PID

