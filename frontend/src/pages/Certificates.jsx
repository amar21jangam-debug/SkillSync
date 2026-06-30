import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { TID } from "../constants/testIds";
import { Award, Download, Lock, Sparkles, Users, User } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "../lib/auth";
import jsPDF from "jspdf";

export default function Certificates() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const groupRef = useRef(null);
  const indivRef = useRef(null);

  useEffect(() => { api.get("/certificates").then((r) => setData(r.data)); }, [user?.level]);

  useEffect(() => {
    if (!data) return;
    [groupRef, indivRef].forEach((r) => {
      if (r.current) {
        gsap.fromTo(r.current.querySelectorAll("[data-cert]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" });
      }
    });
  }, [data]);

  const download = (cert) => generateCertificatePdf(cert);
  if (!data) return <div className="text-[#888] mono">Loading certificates...</div>;

  const groupCount = data.earned_group.length;
  const indivCount = data.earned_individual.length;
  const totalEarned = groupCount + indivCount;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-2">Certificates</div>
        <h1 className="text-3xl lg:text-4xl tracking-tight">Proof of the grind.</h1>
        <p className="text-[#CCCCCC] mt-2 text-sm">Earned by solving problems, completing group projects, and reaching milestones.</p>
      </div>

      {totalEarned === 0 && (
        <div className="surface-card p-10 text-center text-[#888] text-sm mb-10">
          No certificates yet — solve a couple of problems or complete a group project to earn your first.
        </div>
      )}

      {/* Group Project Certificates */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#CBFF3D]" />
          <h2 className="text-xl">Group Project Certificates</h2>
          <span className="text-xs mono text-[#888]">· {groupCount} earned</span>
        </div>
        {groupCount === 0 ? (
          <div className="surface-card p-6 text-sm text-[#888]">
            No group project certificates yet. Complete all tasks in a squad project to earn one — your <span className="text-[#CBFF3D]">effort percentage</span> will be recorded.
          </div>
        ) : (
          <div ref={groupRef} className="grid md:grid-cols-2 gap-5">
            {data.earned_group.map((c) => (
              <CertificateCard key={c.id} cert={c} onDownload={() => download(c)} />
            ))}
          </div>
        )}
      </section>

      {/* Individual Certificates */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-[#CBFF3D]" />
          <h2 className="text-xl">Individual Certificates</h2>
          <span className="text-xs mono text-[#888]">· {indivCount} earned</span>
        </div>
        {indivCount === 0 ? (
          <div className="surface-card p-6 text-sm text-[#888]">
            Solve practice problems and hit level milestones (L5, L7, L10) to earn solo certificates.
          </div>
        ) : (
          <div ref={indivRef} className="grid md:grid-cols-2 gap-5">
            {data.earned_individual.map((c) => (
              <CertificateCard key={c.id} cert={c} onDownload={() => download(c)} />
            ))}
          </div>
        )}
      </section>

      {data.locked.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-[#888]" />
            <h2 className="text-xl text-[#CCCCCC]">Locked</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </section>
      )}
    </div>
  );
}

function CertificateCard({ cert, onDownload }) {
  const isGroup = cert.kind === "group";
  return (
    <div data-cert data-testid={TID.certificateCard(cert.id)} className="surface-card surface-card-hover overflow-hidden">
      <div className="relative p-6 bg-gradient-to-br from-[#CBFF3D]/15 via-[#1F1F1F] to-[#0A0A0B] border-b border-[#CBFF3D]/25">
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="glass-pill !text-[10px]">
            {isGroup ? <><Users size={10}/> Group</> : <><User size={10}/> Individual</>}
          </span>
        </div>
        <div className="text-[10px] mono uppercase tracking-[0.25em] text-[#CBFF3D] mb-1">SkillSync · Certificate</div>
        <div className="font-semibold text-lg">{cert.title}</div>
        <div className="text-xs text-[#CCCCCC] mt-1">Issued to <span className="text-white">{cert.issued_to}</span></div>
        <div className="text-xs text-[#888] mono mt-1">{cert.issued_on}</div>
      </div>

      <div className="p-5">
        {cert.project && (
          <div className="text-xs text-[#CCCCCC] mb-3">
            <span className="text-[#888] mono uppercase tracking-widest text-[10px]">{isGroup ? "Project" : "Note"}</span>
            <div className="mt-1 text-white">{cert.project}</div>
          </div>
        )}

        {isGroup && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-[#CCCCCC] mb-1">
              <span className="mono uppercase tracking-widest text-[10px] text-[#888]">Your Effort</span>
              <span className="mono text-[#CBFF3D] font-semibold">{cert.effort_percent}%</span>
            </div>
            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full progress-fill rounded-full" style={{ width: `${cert.effort_percent}%` }} />
            </div>
            {cert.team_members && (
              <div className="text-[10px] mono text-[#888] mt-2 truncate">
                Team: {cert.team_members.join(" · ")}
              </div>
            )}
          </div>
        )}

        {!isGroup && cert.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {cert.skills.map((s) => (
              <span key={s} className="text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/8 text-[#CCCCCC]">{s}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-[#888]">
            {isGroup ? "Squad cert" : "Solo cert"}
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

export function generateCertificatePdf(cert) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const isGroup = cert.kind === "group";

  // Background
  pdf.setFillColor(10, 10, 11);
  pdf.rect(0, 0, W, H, "F");

  // Lime border
  pdf.setDrawColor(203, 255, 61);
  pdf.setLineWidth(6);
  pdf.rect(20, 20, W - 40, H - 40);
  pdf.setLineWidth(1);
  pdf.rect(34, 34, W - 68, H - 68);

  // Title
  pdf.setTextColor(203, 255, 61);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(`SKILLSYNC · ${isGroup ? "TEAM" : "INDIVIDUAL"} CERTIFICATE`, W / 2, 86, { align: "center" });

  pdf.setTextColor(242, 237, 228);
  pdf.setFontSize(32);
  pdf.text(cert.title, W / 2, 152, { align: "center", maxWidth: W - 120 });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(13);
  pdf.setTextColor(200, 195, 188);
  pdf.text("This certifies that", W / 2, 200, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(242, 237, 228);
  pdf.text(cert.issued_to, W / 2, 248, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(200, 195, 188);
  const body = cert.project
    ? `${isGroup ? "contributed to the team project: " : ""}${cert.project}`
    : "has demonstrated proficiency on the SkillSync platform.";
  pdf.text(body, W / 2, 290, { align: "center", maxWidth: W - 140 });

  if (isGroup) {
    // Effort gauge
    const gaugeY = 340;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(203, 255, 61);
    pdf.text(`INDIVIDUAL EFFORT: ${cert.effort_percent}%`, W / 2, gaugeY, { align: "center" });

    // Effort bar
    const barW = 280;
    const barX = (W - barW) / 2;
    pdf.setFillColor(40, 40, 42);
    pdf.roundedRect(barX, gaugeY + 10, barW, 10, 5, 5, "F");
    pdf.setFillColor(203, 255, 61);
    pdf.roundedRect(barX, gaugeY + 10, (barW * cert.effort_percent) / 100, 10, 5, 5, "F");

    if (cert.team_members?.length) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(170, 165, 158);
      pdf.text(`Team: ${cert.team_members.join("  ·  ")}`, W / 2, gaugeY + 42, { align: "center" });
    }
  } else if (cert.skills?.length) {
    pdf.setFontSize(11);
    pdf.setTextColor(203, 255, 61);
    pdf.text(`Skills: ${cert.skills.join(" · ")}`, W / 2, 332, { align: "center" });
  }

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(150, 145, 138);
  pdf.text(`Issued ${cert.issued_on}`, 60, H - 60);
  pdf.text(`ID: ${cert.id}`, W - 60, H - 60, { align: "right" });

  // signature line
  pdf.setDrawColor(203, 255, 61);
  pdf.setLineWidth(1.2);
  pdf.line(W / 2 - 90, H - 90, W / 2 + 90, H - 90);
  pdf.setFontSize(10);
  pdf.setTextColor(200, 195, 188);
  pdf.text("SkillSync Authority", W / 2, H - 72, { align: "center" });

  pdf.save(`${cert.id}.pdf`);
}
