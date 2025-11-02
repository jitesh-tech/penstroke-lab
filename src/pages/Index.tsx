import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { SettingsPanel, PenColor, PageType, FontStyle } from "@/components/SettingsPanel";
import { HandwritingPreview } from "@/components/HandwritingPreview";
import { ExportControls } from "@/components/ExportControls";
import { PenTool } from "lucide-react";

const Index = () => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [penColor, setPenColor] = useState<PenColor>("blue");
  const [pageType, setPageType] = useState<PageType>("ruled");
  const [fontStyle, setFontStyle] = useState<FontStyle>("cursive");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Text to Handwriting</h1>
              <p className="text-sm text-muted-foreground">
                Transform your text into beautiful handwriting
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Enter Your Text</h2>
              <TextInput value={text} onChange={setText} />
            </div>

            <SettingsPanel
              fontSize={fontSize}
              penColor={penColor}
              pageType={pageType}
              fontStyle={fontStyle}
              onFontSizeChange={setFontSize}
              onPenColorChange={setPenColor}
              onPageTypeChange={setPageType}
              onFontStyleChange={setFontStyle}
            />

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Export & Share</h2>
              <ExportControls previewElementId="handwriting-preview" />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <HandwritingPreview
              text={text}
              fontSize={fontSize}
              penColor={penColor}
              pageType={pageType}
              fontStyle={fontStyle}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with React, TailwindCSS, and beautiful handwriting fonts
          </p>
          <p className="mt-2">
            For ML-based custom handwriting generation, connect a Python/Flask backend
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
