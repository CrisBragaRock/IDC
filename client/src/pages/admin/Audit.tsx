import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { AuditLog } from '../../types';

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.audit.list().then(setLogs).catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Auditoria</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2">Ação</th>
              <th>Entidade</th>
              <th>Usuário</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-800">
                <td className="py-2 font-mono">{log.action}</td>
                <td>{log.entity_type}</td>
                <td className="font-mono text-xs">{log.user_id ?? '-'}</td>
                <td>{new Date(log.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-gray-500 mt-4">Nenhum registro.</p>}
      </div>
    </div>
  );
}
