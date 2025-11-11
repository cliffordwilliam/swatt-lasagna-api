#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="src"
SUBDIRS=("entities" "repositories" "schemas" "services")

if [ $# -lt 1 ]; then
  echo "Usage: $0 <domain-name>"
  exit 1
fi

DOMAIN_NAME="$1"
DOMAIN_DIR="$SRC_DIR/$DOMAIN_NAME"

echo "📦 Creating domain: $DOMAIN_NAME"

mkdir -p "$DOMAIN_DIR"
for dir in "${SUBDIRS[@]}"; do
  mkdir -p "$DOMAIN_DIR/$dir"
done

touch "$DOMAIN_DIR/routers.ts"
touch "$DOMAIN_DIR/entities/${DOMAIN_NAME}.entity.ts"
touch "$DOMAIN_DIR/repositories/${DOMAIN_NAME}_repository.ts"
touch "$DOMAIN_DIR/schemas/${DOMAIN_NAME}.ts"
touch "$DOMAIN_DIR/services/manage_${DOMAIN_NAME}.ts"

echo "✅ Domain '$DOMAIN_NAME' created successfully under '$DOMAIN_DIR'"

