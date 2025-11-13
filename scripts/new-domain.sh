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
ENTITY_PREFIX="${DOMAIN_NAME,,}" # lowercase

echo "📦 Creating domain: $DOMAIN_NAME"

mkdir -p "$DOMAIN_DIR"
for dir in "${SUBDIRS[@]}"; do
  mkdir -p "$DOMAIN_DIR/$dir"
done

ENTITY_FILE="$DOMAIN_DIR/entities/${DOMAIN_NAME}.entity.ts"

cat > "$ENTITY_FILE" <<EOF
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class ${ENTITY_CLASS} {
  @PrimaryKey()
  ${ENTITY_PREFIX}_id!: number;

  @Property()
  ${ENTITY_PREFIX}_name!: string;

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();
}
EOF

touch "$DOMAIN_DIR/routers.ts"
touch "$DOMAIN_DIR/repositories/${DOMAIN_NAME}_repository.ts"
touch "$DOMAIN_DIR/schemas/${DOMAIN_NAME}.ts"
touch "$DOMAIN_DIR/services/manage_${DOMAIN_NAME}.ts"

echo "✅ Domain '$DOMAIN_NAME' created successfully under '$DOMAIN_DIR'"
echo "🧱 Entity created at: $ENTITY_FILE"

