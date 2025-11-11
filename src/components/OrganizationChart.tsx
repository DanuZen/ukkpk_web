import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";

interface OrgMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  category: string | null;
  level: number | null;
  order_index: number | null;
}

export const OrganizationChart = () => {
  const [members, setMembers] = useState<OrgMember[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("organization")
      .select("*")
      .order("level", { ascending: true })
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }
    setMembers(data || []);
  };

  const getMembersByCategory = (category: string) => {
    return members.filter((m) => m.category === category);
  };

  const MemberCard = ({ member, className = "" }: { member: OrgMember; className?: string }) => (
    <Card
      className={`relative bg-card border-2 border-border hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out p-4 min-w-[200px] animate-fade-up ${className}`}
    >
      {member.photo_url && (
        <div className="flex justify-center mb-3">
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
        </div>
      )}
      <div className="text-center">
        <h4 className="font-bold text-sm text-foreground mb-1">{member.name}</h4>
        <p className="text-xs text-muted-foreground">{member.position}</p>
      </div>
    </Card>
  );

  const mubes = getMembersByCategory("mubes");
  const pembina = getMembersByCategory("pembina");
  const penasehat = getMembersByCategory("penasehat");
  const ketuaUmum = getMembersByCategory("ketua_umum");
  const wakilKetuaUmum = getMembersByCategory("wakil_ketua_umum");
  const wakilSekretarisUmum = getMembersByCategory("wakil_sekretaris_umum");
  const sekretarisUmum = getMembersByCategory("sekretaris_umum");
  const bendaharaUmum = getMembersByCategory("bendahara_umum");
  const sekretarisII = getMembersByCategory("sekretaris_ii");
  const bendaharaII = getMembersByCategory("bendahara_ii");
  const koorBidangProgram = getMembersByCategory("koordinator_bidang_program");
  const koorBidangPublikasi = getMembersByCategory("koordinator_bidang_publikasi");
  const anggota = getMembersByCategory("anggota");

  return (
    <div className="w-full overflow-x-auto py-8">
      <div className="min-w-[1200px] mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Struktur Organisasi DPH dan Pengurus UKKPK 2025
        </h2>

        {/* Chart Container */}
        <div className="relative flex flex-col items-center gap-8">
          {/* MUBES */}
          {mubes.length > 0 && (
            <div className="flex flex-col items-center">
              {mubes.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
              {/* Vertical line down */}
              <div className="w-0.5 h-12 bg-primary" />
            </div>
          )}

          {/* Pembina & Penasehat */}
          {(pembina.length > 0 || penasehat.length > 0) && (
            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-16 items-start">
                {pembina.length > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="font-bold text-primary">Pembina</h3>
                    <div className="flex flex-col gap-3">
                      {pembina.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
                {penasehat.length > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="font-bold text-secondary">Penasehat</h3>
                    <div className="flex flex-col gap-3">
                      {penasehat.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Vertical line down */}
              <div className="w-0.5 h-12 bg-primary" />
            </div>
          )}

          {/* Ketua Umum */}
          {ketuaUmum.length > 0 && (
            <div className="flex flex-col items-center">
              {ketuaUmum.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
              {/* T-shaped connector */}
              <div className="w-0.5 h-8 bg-primary" />
              <div className="w-96 h-0.5 bg-primary" />
            </div>
          )}

          {/* Wakil Ketua & Wakil Sekretaris (side by side) */}
          <div className="flex gap-32 items-start relative">
            {/* Left branch */}
            <div className="flex flex-col items-center gap-8">
              {wakilKetuaUmum.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-primary" />
                  {wakilKetuaUmum.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
              {sekretarisUmum.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-primary" />
                  {sekretarisUmum.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
              {sekretarisII.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-primary" />
                  {sekretarisII.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
            </div>

            {/* Right branch */}
            <div className="flex flex-col items-center gap-8">
              {wakilSekretarisUmum.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-secondary" />
                  {wakilSekretarisUmum.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
              {bendaharaUmum.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-secondary" />
                  {bendaharaUmum.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
              {bendaharaII.length > 0 && (
                <>
                  <div className="w-0.5 h-8 bg-secondary" />
                  {bendaharaII.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Connector to Koordinator */}
          {(koorBidangProgram.length > 0 || koorBidangPublikasi.length > 0) && (
            <>
              <div className="w-0.5 h-12 bg-primary" />
              <div className="w-80 h-0.5 bg-primary" />
            </>
          )}

          {/* Koordinator Bidang */}
          {(koorBidangProgram.length > 0 || koorBidangPublikasi.length > 0) && (
            <div className="flex gap-16 items-start">
              {koorBidangProgram.length > 0 && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-0.5 h-8 bg-primary" />
                  {koorBidangProgram.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
              {koorBidangPublikasi.length > 0 && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-0.5 h-8 bg-secondary" />
                  {koorBidangPublikasi.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connector to Anggota */}
          {anggota.length > 0 && (
            <>
              <div className="w-0.5 h-12 bg-primary" />
            </>
          )}

          {/* Anggota */}
          {anggota.length > 0 && (
            <div className="flex flex-col items-center gap-6 w-full">
              <h3 className="font-bold text-xl text-primary">ANGGOTA</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                {anggota.map((member) => (
                  <MemberCard key={member.id} member={member} className="min-w-0" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
