import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const embeddedToolSchemaFields = ["input_schema", "output_schema", "error_schema"];

export function embeddedToolSchemaErrors(tool, label = "tool contract") {
  const errors = [];

  for (const field of embeddedToolSchemaFields) {
    if (tool?.[field] === undefined) continue;

    const ajv = new Ajv2020({ allErrors: true, strict: true });
    addFormats(ajv);
    try {
      ajv.compile(tool[field]);
    } catch (error) {
      errors.push(`${label} ${field} schema compilation failed: ${error.message}`);
    }
  }

  return errors;
}

export function ontologyIdentityErrors(ontology, label = "operational ontology") {
  const errors = [];

  for (const entity of ontology?.entities ?? []) {
    const attributeNames = new Set();
    for (const attribute of entity.attributes ?? []) {
      if (attributeNames.has(attribute.name)) {
        errors.push(`${label} entity ${entity.entity_id} duplicates attribute ${attribute.name}`);
      }
      attributeNames.add(attribute.name);
    }

    for (const identityKey of entity.identity_keys ?? []) {
      if (!attributeNames.has(identityKey)) {
        errors.push(`${label} entity ${entity.entity_id} identity key ${identityKey} is not declared as an attribute`);
      }
    }
  }

  return errors;
}

export function patternCatalogErrors(catalog, evidenceIds, label = "pattern catalog", today = new Date()) {
  const errors = [];
  const patternIds = new Set();
  const todayIso = today.toISOString().slice(0, 10);

  for (const pattern of catalog?.patterns ?? []) {
    if (patternIds.has(pattern.id)) errors.push(`${label} duplicates pattern ID ${pattern.id}`);
    patternIds.add(pattern.id);

    for (const evidenceId of pattern.evidence ?? []) {
      if (evidenceId.startsWith("internal-")) continue;
      if (!evidenceIds.has(evidenceId.toUpperCase())) {
        errors.push(`${label} pattern ${pattern.id} references missing evidence ${evidenceId}`);
      }
    }

    if (pattern.reviewed_at && pattern.review_due && pattern.reviewed_at > pattern.review_due) {
      errors.push(`${label} pattern ${pattern.id} review_due precedes reviewed_at`);
    }
    if (pattern.reviewed_at && pattern.reviewed_at > todayIso) {
      errors.push(`${label} pattern ${pattern.id} reviewed_at is in the future`);
    }
    if (pattern.review_due && pattern.review_due < todayIso) {
      errors.push(`${label} pattern ${pattern.id} review is overdue`);
    }
  }

  return errors;
}
