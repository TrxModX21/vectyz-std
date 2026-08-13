import { User, Mail, Phone, MapPin, Globe, CreditCard } from "lucide-react";

export function TabPersonalKYC() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Contact & Demographics */}
      <div className="cyber-card clip-card flex flex-col p-6">
        <h3 className="text-base font-heading tracking-[1px] text-neon mb-4">
          Contact & Demographics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-cyber-body-subtle mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-cyber-body-subtle">Mobile</p>
              <p className="text-[14px] text-cyber-heading font-medium">+62 812 3456 7890</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Globe size={16} className="text-cyber-body-subtle mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-cyber-body-subtle">Country</p>
              <p className="text-[14px] text-cyber-heading font-medium">Indonesia</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-cyber-body-subtle mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-cyber-body-subtle">Full Address</p>
              <p className="text-[13px] text-cyber-body">
                Jl. Cyberpunk No. 77, Night City,
                <br />
                Jakarta Selatan, 12345
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Identity & Linked Accounts */}
      <div className="flex flex-col gap-6">
        <div className="cyber-card clip-card flex flex-col p-6">
          <h3 className="text-base font-heading tracking-[1px] text-neon mb-4">
            Identity & Profile
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-cyber-body-subtle mb-1">Bio</p>
              <p className="text-[13px] text-cyber-body p-3 bg-cyber-surface-active border border-cyber-border rounded-cyber">
                Digital artist and UI/UX designer focusing on futuristic interfaces. Loves creating vector assets for games and web apps.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-cyber-border rounded-cyber">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#00E676]" />
                <span className="text-[13px] text-cyber-heading">KYC Verification</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(0,230,118,0.1)] px-2.5 py-0.5 text-[11px] font-medium text-[#00E676]">
                Verified
              </span>
            </div>
          </div>
        </div>
        
        <div className="cyber-card clip-card flex flex-col p-6">
          <h3 className="text-base font-heading tracking-[1px] text-neon mb-4">
            Linked Accounts
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-cyber-body">Google</span>
              <span className="text-[13px] text-cyber-heading font-medium">alex.doe@gmail.com</span>
            </div>
            <div className="h-px w-full bg-cyber-border-subtle" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-cyber-body">Github</span>
              <span className="text-[13px] text-cyber-heading font-medium">@alexdoe_tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
