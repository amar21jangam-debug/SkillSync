import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Award, Download, Lock, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "../lib/auth";
import jsPDF from "jspdf";

export default function Certificates() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => { api.get("/certificates").then((r) => setData(r.data)); }, [user?.level]);

  useEffect(() => {
    if (gridRef.current && data) {
      gsap.fromTo(
        gridRef.current.querySelectorAll("[data-cert]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [data]);

  const download = (cert) => generateCertificatePdf(cert);

  if (!data) return <div className="text-[#888] mono">Loading certificates...</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#FF6200] mb-2">Certificates</div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Proof of the grind.</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">Earned by solving problems, completing group projects, and reaching level milestones.</p>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-[#FF6200]" />
          <div className="font-semibold">Earned ({data.earned.length})</div>
        </div>
        {data.earned.length === 0 ? (
          <div className="surface-card p-8 text-center text-[#888] text-sm">
            No certificates yet — solve a couple of problems or complete a group project to earn your first.
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 gap-5">
            {data.earned.map((c) => (
              <CertificateCard key={c.id} cert={c} onDownload={() => download(c)} />
            ))}
          </div>
        )}
      </div>

      {data.locked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-[#888]" />
            <div className="font-semibold text-[#CCCCCC]">Locked</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.locked.map((l) => (
              <div key={l.id} className="surface-card p-5 opacity-70">
                <div className="flex items-center gap-2 mb-2 text-[#888]">
                  <Lock size={14}/> <span className="text-[10px] mono uppercase tracking-widest">Locked</span>
                </div>
                <div className="font-semibold">{l.title}</div>
                <div className="text-xs text-[#888] mt-1">Unlocks at Level {l.level_required}</div>
                <div className="text-xs text-[#CCCCCC] mt-2">{l.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CertificateCard({ cert, onDownload }) {
  return (
    <div data-cert data-testid={TID.certificateCard(cert.id)} className="surface-card surface-card-hover overflow-hidden">
      <div className="relative p-6 bg-gradient-to-br from-[#FF6200]/15 via-[#1F1F1F] to-[#0A0A0A] border-b border-[#FF6200]/30">
        <div className="absolute top-3 right-3">
          <Sparkles size={16} className="text-[#FF6200]" />
        </div>
        <div className="text-[10px] mono uppercase tracking-[0.25em] text-[#FF6200] mb-1">SkillSync · Certificate</div>
        <div className="font-semibold text-lg">{cert.title}</div>
        <div className="text-xs text-[#CCCCCC] mt-1">Issued to <span className="text-white">{cert.issued_to}</span></div>
        <div className="text-xs text-[#888] mono mt-1">{cert.issued_on}</div>
      </div>
      <div className="p-5">
        {cert.project && (
          <div className="text-xs text-[#CCCCCC] mb-3">
            <span className="text-[#888] mono uppercase tracking-widest text-[10px]">Project / Note</span>
            <div className="mt-1 text-white">{cert.project}</div>
          </div>
        )}
        {cert.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {cert.skills.map((s) => (
              <span key={s} className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2A2A2A] text-[#CCCCCC]">{s}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#888]">
            Participation <span className="text-[#FF6200] mono font-semibold">{cert.participation}%</span>
          </div>
          <button
            data-testid={TID.certificateDownloadBtn(cert.id)}
            onClick={onDownload}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Download size={13} /> PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// Exported so other pages (e.g. GroupDetail) can reuse this generator.
export function generateCertificatePdf(cert) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, W, H, "F");

  // Orange border
  pdf.setDrawColor(255, 98, 0);
  pdf.setLineWidth(6);
  pdf.rect(20, 20, W - 40, H - 40);
  pdf.setLineWidth(1);
  pdf.rect(34, 34, W - 68, H - 68);

  // Title
  pdf.setTextColor(255, 98, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("SKILLSYNC · CERTIFICATE", W / 2, 90, { align: "center" });

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(34);
  pdf.text(cert.title, W / 2, 160, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(13);
  pdf.setTextColor(200, 200, 200);
  pdf.text("This certifies that", W / 2, 210, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(255, 255, 255);
  pdf.text(cert.issued_to, W / 2, 260, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(200, 200, 200);
  const body = cert.project
    ? `has successfully completed: ${cert.project}`
    : "has demonstrated proficiency on the SkillSync platform.";
  pdf.text(body, W / 2, 300, { align: "center", maxWidth: W - 120 });

  if (cert.skills?.length) {
    pdf.setFontSize(11);
    pdf.setTextColor(255, 98, 0);
    pdf.text(`Skills: ${cert.skills.join(" · ")}`, W / 2, 340, { align: "center" });
  }

  pdf.setFontSize(11);
  pdf.setTextColor(200, 200, 200);
  pdf.text(`Participation: ${cert.participation}%`, W / 2, 370, { align: "center" });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Issued ${cert.issued_on}`, 60, H - 60);
  pdf.text(`ID: ${cert.id}`, W - 60, H - 60, { align: "right" });

  // signature line
  pdf.setDrawColor(255, 98, 0);
  pdf.setLineWidth(1.2);
  pdf.line(W / 2 - 90, H - 90, W / 2 + 90, H - 90);
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text("SkillSync Authority", W / 2, H - 72, { align: "center" });

  pdf.save(`${cert.id}.pdf`);
}
