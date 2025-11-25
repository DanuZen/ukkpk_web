import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Palette, RefreshCw, Check } from "lucide-react";

const themePresets = [
  {
    name: "Default",
    description: "Tema default UKKPK dengan merah khas",
    primary: "#dc2626",
    secondary: "#64748b",
    accent: "#f59e0b",
  },
  {
    name: "Modern",
    description: "Tema modern dengan biru elegant",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
  },
  {
    name: "Classic",
    description: "Tema klasik dengan hijau natural",
    primary: "#059669",
    secondary: "#475569",
    accent: "#eab308",
  },
  {
    name: "Vibrant",
    description: "Tema vibrant dengan ungu energik",
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#f97316",
  },
];

export const ThemeManager = () => {
  const [primaryColor, setPrimaryColor] = useState("#dc2626");
  const [secondaryColor, setSecondaryColor] = useState("#64748b");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [selectedPreset, setSelectedPreset] = useState<string | null>("Default");

  useEffect(() => {
    // Load theme colors from localStorage or use defaults
    const savedPrimary = localStorage.getItem("theme-primary") || "#dc2626";
    const savedSecondary = localStorage.getItem("theme-secondary") || "#64748b";
    const savedAccent = localStorage.getItem("theme-accent") || "#f59e0b";
    
    setPrimaryColor(savedPrimary);
    setSecondaryColor(savedSecondary);
    setAccentColor(savedAccent);
  }, []);

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0% 0%";
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  const applyTheme = () => {
    const root = document.documentElement;
    
    root.style.setProperty("--primary", hexToHsl(primaryColor));
    root.style.setProperty("--secondary", hexToHsl(secondaryColor));
    root.style.setProperty("--accent", hexToHsl(accentColor));

    localStorage.setItem("theme-primary", primaryColor);
    localStorage.setItem("theme-secondary", secondaryColor);
    localStorage.setItem("theme-accent", accentColor);

    toast.success("Tema berhasil diperbarui");
  };

  const applyPreset = (preset: typeof themePresets[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setSelectedPreset(preset.name);

    const root = document.documentElement;
    root.style.setProperty("--primary", hexToHsl(preset.primary));
    root.style.setProperty("--secondary", hexToHsl(preset.secondary));
    root.style.setProperty("--accent", hexToHsl(preset.accent));

    localStorage.setItem("theme-primary", preset.primary);
    localStorage.setItem("theme-secondary", preset.secondary);
    localStorage.setItem("theme-accent", preset.accent);
    localStorage.setItem("theme-preset", preset.name);

    toast.success(`Tema ${preset.name} berhasil diterapkan`);
  };

  const resetTheme = () => {
    const defaultPreset = themePresets[0];
    applyPreset(defaultPreset);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Preset Tema</CardTitle>
              <CardDescription className="mt-1">
                Pilih preset tema yang sudah jadi atau kustomisasi sendiri
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {themePresets.map((preset) => (
              <Card 
                key={preset.name}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPreset === preset.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => applyPreset(preset)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{preset.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {preset.description}
                      </CardDescription>
                    </div>
                    {selectedPreset === preset.name && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex gap-2">
                    <div 
                      className="h-12 flex-1 rounded border border-border"
                      style={{ backgroundColor: preset.primary }}
                      title="Primary"
                    />
                    <div 
                      className="h-12 flex-1 rounded border border-border"
                      style={{ backgroundColor: preset.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="h-12 flex-1 rounded border border-border"
                      style={{ backgroundColor: preset.accent }}
                      title="Accent"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Kustomisasi Warna</CardTitle>
              <CardDescription className="mt-1">
                Sesuaikan warna tema secara manual sesuai preferensi Anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Warna Primer</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                  placeholder="#dc2626"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Warna utama untuk brand UKKPK
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Warna Sekunder</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                  placeholder="#64748b"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Warna pendukung untuk UI
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Warna Aksen</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1"
                  placeholder="#f59e0b"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Warna highlight dan CTA
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => {
                applyTheme();
                setSelectedPreset(null); // Clear preset selection when manually applying
              }} 
              className="flex-1"
            >
              Terapkan Warna Manual
            </Button>
            <Button onClick={resetTheme} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset Default
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview Warna</CardTitle>
          <CardDescription>
            Pratinjau warna tema yang akan diterapkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div 
                className="h-24 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Warna Primer
              </div>
            </div>
            <div className="space-y-2">
              <div 
                className="h-24 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: secondaryColor }}
              >
                Warna Sekunder
              </div>
            </div>
            <div className="space-y-2">
              <div 
                className="h-24 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: accentColor }}
              >
                Warna Aksen
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
