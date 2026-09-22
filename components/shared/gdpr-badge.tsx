import { Shield } from "lucide-react";

export function GdprBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl ${className}`}
      style={{ background: "#eef6f7", border: "1px solid #dbe9eb" }}>
      {/* EU stars ring */}
      <div className="relative h-8 w-8 shrink-0 rounded-sm flex items-center justify-center"
        style={{ background: "#003399" }}>
        <div className="relative h-5 w-5">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const r = 8;
            const x = 10 + r * Math.cos(angle);
            const y = 10 + r * Math.sin(angle);
            return (
              <div key={i} className="absolute"
                style={{
                  width: 2, height: 2, borderRadius: "50%",
                  background: "#FFCC00",
                  left: `${(x - 1).toFixed(2)}px`,
                  top: `${(y - 1).toFixed(2)}px`,
                  transform: "translate(-50%,-50%)",
                }} />
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: "#003399" }}>GDPR</p>
        <p className="text-[9px] font-medium leading-tight mt-0.5" style={{ color: "#5f7679" }}>Compliant · Data Protected</p>
      </div>
      <Shield size={13} style={{ color: "#003399", opacity: 0.6 }} />
    </div>
  );
}
