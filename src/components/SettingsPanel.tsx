import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export type PenColor = "black" | "blue" | "red";
export type PageType = "plain" | "ruled" | "notebook";
export type FontStyle = "cursive" | "print" | "elegant";

interface SettingsPanelProps {
  fontSize: number;
  penColor: PenColor;
  pageType: PageType;
  fontStyle: FontStyle;
  onFontSizeChange: (size: number) => void;
  onPenColorChange: (color: PenColor) => void;
  onPageTypeChange: (type: PageType) => void;
  onFontStyleChange: (style: FontStyle) => void;
}

export const SettingsPanel = ({
  fontSize,
  penColor,
  pageType,
  fontStyle,
  onFontSizeChange,
  onPenColorChange,
  onPageTypeChange,
  onFontStyleChange,
}: SettingsPanelProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Handwriting Settings</h2>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Font Size: {fontSize}px</Label>
        <Slider
          value={[fontSize]}
          onValueChange={(values) => onFontSizeChange(values[0])}
          min={12}
          max={48}
          step={2}
          className="w-full"
        />
      </div>

      {/* Pen Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pen Color</Label>
        <RadioGroup value={penColor} onValueChange={(value) => onPenColorChange(value as PenColor)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="black" id="black" />
            <Label htmlFor="black" className="flex items-center gap-2 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--pen-black))] border-2" />
              Black
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <Label htmlFor="blue" className="flex items-center gap-2 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--pen-blue))] border-2" />
              Blue
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red" id="red" />
            <Label htmlFor="red" className="flex items-center gap-2 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--pen-red))] border-2" />
              Red
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Page Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Page Style</Label>
        <RadioGroup value={pageType} onValueChange={(value) => onPageTypeChange(value as PageType)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="plain" id="plain" />
            <Label htmlFor="plain" className="cursor-pointer">Plain White</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ruled" id="ruled" />
            <Label htmlFor="ruled" className="cursor-pointer">Ruled Lines</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notebook" id="notebook" />
            <Label htmlFor="notebook" className="cursor-pointer">Notebook</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Font Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Handwriting Style</Label>
        <RadioGroup value={fontStyle} onValueChange={(value) => onFontStyleChange(value as FontStyle)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cursive" id="cursive" />
            <Label htmlFor="cursive" className="cursor-pointer font-handwriting-cursive text-lg">
              Cursive Style
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="print" id="print" />
            <Label htmlFor="print" className="cursor-pointer font-handwriting-print text-lg">
              Print Style
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="elegant" id="elegant" />
            <Label htmlFor="elegant" className="cursor-pointer font-handwriting-elegant text-lg">
              Elegant Script
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};
