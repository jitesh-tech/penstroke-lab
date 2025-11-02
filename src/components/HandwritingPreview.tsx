import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { PenColor, PageType, FontStyle } from "./SettingsPanel";

interface HandwritingPreviewProps {
  text: string;
  fontSize: number;
  penColor: PenColor;
  pageType: PageType;
  fontStyle: FontStyle;
}

export const HandwritingPreview = ({
  text,
  fontSize,
  penColor,
  pageType,
  fontStyle,
}: HandwritingPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const getPenColorClass = () => {
    switch (penColor) {
      case "black":
        return "text-[hsl(var(--pen-black))]";
      case "blue":
        return "text-[hsl(var(--pen-blue))]";
      case "red":
        return "text-[hsl(var(--pen-red))]";
    }
  };

  const getPageClass = () => {
    switch (pageType) {
      case "plain":
        return "bg-[hsl(var(--paper-white))]";
      case "ruled":
        return "bg-[hsl(var(--paper-ruled))] ruled-lines";
      case "notebook":
        return "bg-[hsl(var(--paper-notebook))] paper-texture";
    }
  };

  const getFontClass = () => {
    switch (fontStyle) {
      case "cursive":
        return "font-handwriting-cursive";
      case "print":
        return "font-handwriting-print";
      case "elegant":
        return "font-handwriting-elegant";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-3 border-b">
        <h3 className="text-sm font-semibold">Live Preview</h3>
      </div>
      <div
        ref={previewRef}
        id="handwriting-preview"
        className={`min-h-[600px] p-12 overflow-auto ${getPageClass()}`}
        style={{
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className={`whitespace-pre-wrap leading-relaxed ${getPenColorClass()} ${getFontClass()}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: pageType === "ruled" ? "32px" : "1.6",
          }}
        >
          {text || "Your handwritten text will appear here..."}
        </div>
      </div>
    </Card>
  );
};
