import { AlertTriangle, Fingerprint, Laptop, LogOut, ShieldAlert, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy sessions data
const sessions = [
  {
    id: "SES-001",
    device: "Windows - Chrome",
    ip: "192.168.1.15",
    location: "Jakarta, ID",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "SES-002",
    device: "iPhone 14 - Safari",
    ip: "114.122.10.2",
    location: "Bandung, ID",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

// Dummy audit logs
const auditLogs = [
  {
    id: "AUD-001",
    action: "UPDATE_PROFILE",
    details: "Changed bio and website",
    ip: "192.168.1.15",
    date: "Aug 15, 2026, 14:30",
  },
  {
    id: "AUD-002",
    action: "LOGIN_SUCCESS",
    details: "Logged in via Google",
    ip: "192.168.1.15",
    date: "Aug 15, 2026, 09:00",
  },
  {
    id: "AUD-003",
    action: "DOWNLOAD_ASSET",
    details: "Downloaded asset STK-082 (Premium)",
    ip: "114.122.10.2",
    date: "Aug 14, 2026, 19:45",
  },
];

export function TabSecurityAudit() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Left Column: Sessions & Audit */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Active Sessions */}
        <div className="cyber-card clip-card flex flex-col w-full relative z-0">
          <div className="p-5 border-b border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop size={16} className="text-neon" />
              <h3 className="text-base font-heading tracking-[1px] text-neon">
                Active Sessions
              </h3>
            </div>
            <button className="text-[12px] font-medium text-[#FF3366] hover:text-[#FF3366]/70 transition-colors flex items-center gap-1">
              <LogOut size={14} /> Revoke All
            </button>
          </div>
          
          <div className="p-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border-b border-cyber-border/50 last:border-0 hover:bg-cyber-surface-hover/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-cyber bg-cyber-surface-active border border-cyber-border mt-1">
                    <Laptop size={16} className="text-cyber-body-subtle" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-cyber-heading">{session.device}</span>
                      {session.isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-[rgba(0,230,118,0.1)] px-2 py-0.5 text-[10px] font-medium text-[#00E676] uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-cyber-body-subtle mt-0.5">
                      {session.ip} • {session.location}
                    </span>
                    <span className="text-[11px] text-cyber-body mt-1">{session.lastActive}</span>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button className="text-[12px] text-[#FF3366] border border-[#FF3366]/30 px-3 py-1.5 rounded-cyber hover:bg-[#FF3366]/10 transition-colors">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="cyber-card clip-card flex flex-col w-full relative z-0">
          <div className="p-5 border-b border-cyber-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint size={16} className="text-neon" />
              <h3 className="text-base font-heading tracking-[1px] text-neon">
                Audit Logs
              </h3>
            </div>
            <button className="text-[12px] font-medium text-cyber-body hover:text-neon transition-colors">
              View All Logs
            </button>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-cyber-surface-active text-cyber-body">
                <tr>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Details</th>
                  <th className="px-5 py-3 font-medium text-right">Date & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cyber-surface-hover/50 transition-colors">
                    <td className="px-5 py-3 text-cyber-heading font-medium">
                      <span className="inline-flex items-center rounded-sm bg-cyber-surface-active border border-cyber-border px-2 py-0.5 text-[10px] font-mono text-neon">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-cyber-body">
                      {log.details}
                    </td>
                    <td className="px-5 py-3 text-right flex flex-col items-end">
                      <span className="text-cyber-heading">{log.date}</span>
                      <span className="text-[11px] text-cyber-body-subtle font-mono">{log.ip}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Danger Zone */}
      <div className="lg:col-span-1">
        <div className="cyber-card clip-card flex flex-col w-full relative z-0 border-[#FF3366]/40 shadow-[0_0_15px_rgba(255,51,102,0.1)]">
          <div className="p-5 border-b border-[#FF3366]/20 flex items-center gap-2 bg-[rgba(255,51,102,0.05)]">
            <ShieldAlert size={18} className="text-[#FF3366]" />
            <h3 className="text-base font-heading tracking-[1px] text-[#FF3366]">
              Danger Zone
            </h3>
          </div>
          
          <div className="p-5 flex flex-col gap-6">
            
            {/* Ban User */}
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-[14px] font-medium text-cyber-heading mb-1">Ban User</h4>
                <p className="text-[12px] text-cyber-body-subtle">
                  Prevent this user from logging in and accessing the platform. You can set an expiration date.
                </p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-cyber border border-[#FF3366]/50 bg-transparent px-4 py-2.5 text-[13px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors">
                <AlertTriangle size={14} />
                Ban This User
              </button>
            </div>

            <div className="h-px w-full bg-cyber-border-subtle" />

            {/* Delete Account */}
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-[14px] font-medium text-cyber-heading mb-1">Delete Account</h4>
                <p className="text-[12px] text-cyber-body-subtle">
                  Permanently remove this user and all associated data. This action cannot be undone.
                </p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-cyber border-none bg-[#FF3366] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#FF3366]/80 shadow-[0_0_10px_rgba(255,51,102,0.5)] transition-all">
                <XCircle size={14} />
                Delete Account
              </button>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}
