import { db } from '../db';

export async function audit(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown> = {},
  ipAddress?: string
): Promise<void> {
  await db
    .query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, entityType, entityId, JSON.stringify(details), ipAddress ?? null]
    )
    .catch(() => {});
}
