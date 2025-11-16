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

echo "Waiting for PostgreSQL to be ready..."
RETRY_COUNT=0
MAX_RETRIES=30
until docker exec postgres pg_isready -U postgres > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: PostgreSQL failed to become ready after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "PostgreSQL is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 1
done
echo "PostgreSQL is ready!"

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

