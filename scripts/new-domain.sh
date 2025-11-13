#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="src"
SUBDIRS=("entities" "repositories" "schemas" "services")

if [ $# -lt 1 ]; then
  echo "Usage: $0 <singular-domain-name>"
  exit 1
fi

DOMAIN_NAME="$1"
DOMAIN_DIR="$SRC_DIR/$DOMAIN_NAME"

CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<< "${DOMAIN_NAME:0:1}")${DOMAIN_NAME:1}"
ENTITY_CLASS="${CLASS_NAME}Entity"
ENTITY_PREFIX="${DOMAIN_NAME,,}"

echo "📦 Creating domain: $DOMAIN_NAME"

# Create directories if they don't exist
mkdir -p "$DOMAIN_DIR"
for dir in "${SUBDIRS[@]}"; do
  mkdir -p "$DOMAIN_DIR/$dir"
done

# Generate Entity file
ENTITY_FILE="$DOMAIN_DIR/entities/${DOMAIN_NAME}.entity.ts"
TEMPLATE_FILE="./scripts/templates/entity-template.txt"
TEMPLATE_CONTENT=$(<"$TEMPLATE_FILE")

# Replace placeholders in the entity template
REPLACED_CONTENT="${TEMPLATE_CONTENT//<ENTITY_CLASS>/${ENTITY_CLASS}}"
REPLACED_CONTENT="${REPLACED_CONTENT//<DOMAIN_NAME>/${DOMAIN_NAME}}"
REPLACED_CONTENT="${REPLACED_CONTENT//<ENTITY_PREFIX>/${ENTITY_PREFIX}}"
echo "$REPLACED_CONTENT" > "$ENTITY_FILE"

# Generate Repository file
REPO_FILE="$DOMAIN_DIR/repositories/${DOMAIN_NAME}_repository.ts"
REPOSITORY_TEMPLATE_FILE="./scripts/templates/repository-template.txt"
REPOSITORY_TEMPLATE_CONTENT=$(<"$REPOSITORY_TEMPLATE_FILE")

# Replace placeholders in repository template
REPLACED_REPO_CONTENT="${REPOSITORY_TEMPLATE_CONTENT//<ENTITY_CLASS>/${ENTITY_CLASS}}"
REPLACED_REPO_CONTENT="${REPLACED_REPO_CONTENT//<DOMAIN_NAME>/${DOMAIN_NAME}}"
REPLACED_REPO_CONTENT="${REPLACED_REPO_CONTENT//<ENTITY_PREFIX>/${ENTITY_PREFIX}}"
REPLACED_REPO_CONTENT="${REPLACED_REPO_CONTENT//<DOMAIN_NAME^>/${DOMAIN_NAME^}}"
echo "$REPLACED_REPO_CONTENT" > "$REPO_FILE"

# Generate Schema file
SCHEMA_FILE="$DOMAIN_DIR/schemas/${DOMAIN_NAME}.ts"
SCHEMA_TEMPLATE_FILE="./scripts/templates/schema-template.txt"
SCHEMA_TEMPLATE_CONTENT=$(<"$SCHEMA_TEMPLATE_FILE")

# Replace placeholders in schema template
REPLACED_SCHEMA_CONTENT="${SCHEMA_TEMPLATE_CONTENT//<ENTITY_CLASS>/${ENTITY_CLASS}}"
REPLACED_SCHEMA_CONTENT="${REPLACED_SCHEMA_CONTENT//<DOMAIN_NAME>/${DOMAIN_NAME}}"
REPLACED_SCHEMA_CONTENT="${REPLACED_SCHEMA_CONTENT//<ENTITY_PREFIX>/${ENTITY_PREFIX}}"
echo "$REPLACED_SCHEMA_CONTENT" > "$SCHEMA_FILE"

# Generate Service file
SERVICE_FILE="$DOMAIN_DIR/services/manage_${DOMAIN_NAME}.ts"
SERVICE_TEMPLATE_FILE="./scripts/templates/service-template.txt"
SERVICE_TEMPLATE_CONTENT=$(<"$SERVICE_TEMPLATE_FILE")

# Replace placeholders in service template
REPLACED_SERVICE_CONTENT="${SERVICE_TEMPLATE_CONTENT//<ENTITY_CLASS>/${ENTITY_CLASS}}"
REPLACED_SERVICE_CONTENT="${REPLACED_SERVICE_CONTENT//<DOMAIN_NAME>/${DOMAIN_NAME}}"
REPLACED_SERVICE_CONTENT="${REPLACED_SERVICE_CONTENT//<ENTITY_PREFIX>/${ENTITY_PREFIX}}"
echo "$REPLACED_SERVICE_CONTENT" > "$SERVICE_FILE"

# Generate Router file
ROUTER_FILE="$DOMAIN_DIR/routers.ts"
ROUTER_TEMPLATE_FILE="./scripts/templates/router-template.txt"
ROUTER_TEMPLATE_CONTENT=$(<"$ROUTER_TEMPLATE_FILE")

# Replace placeholders in router template
REPLACED_ROUTER_CONTENT="${ROUTER_TEMPLATE_CONTENT//<ENTITY_CLASS>/${ENTITY_CLASS}}"
REPLACED_ROUTER_CONTENT="${REPLACED_ROUTER_CONTENT//<DOMAIN_NAME>/${DOMAIN_NAME}}"
REPLACED_ROUTER_CONTENT="${REPLACED_ROUTER_CONTENT//<ENTITY_PREFIX>/${ENTITY_PREFIX}}"
echo "$REPLACED_ROUTER_CONTENT" > "$ROUTER_FILE"

# Create other files
touch "$DOMAIN_DIR/routers.ts"

echo "✅ Domain '$DOMAIN_NAME' created successfully under '$DOMAIN_DIR'"
echo "🧱 Entity created at: $ENTITY_FILE"
echo "🧱 Repository created at: $REPO_FILE"
echo "🧱 Schema created at: $SCHEMA_FILE"
echo "🧱 Service created at: $SERVICE_FILE"
echo "🧱 Router created at: $ROUTER_FILE"

