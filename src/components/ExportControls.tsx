import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ExportControlsProps {
  previewElementId: string;
}

export const ExportControls = ({ previewElementId }: ExportControlsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(previewElementId);
      if (!element) {
        toast.error("Preview not found");
        return;
      }

      toast.info("Generating PDF...");

      // Capture the preview as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("handwritten-text.pdf");

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "Check out my handwritten text! Created with Text to Handwriting app."
    );
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleHandwritingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newImages.push(result);
        processedCount++;

        if (processedCount === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          toast.success(`${newImages.length} handwriting sample(s) uploaded!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="w-full"
        size="lg"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? "Generating PDF..." : "Export to PDF"}
      </Button>

      <Button
        onClick={handleShareWhatsApp}
        variant="outline"
        className="w-full"
        size="lg"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share on WhatsApp
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full" size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Upload Your Handwriting
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Your Handwriting Samples</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Upload 3-5 samples of your handwriting. The AI will analyze your style
                and generate text that matches your unique handwriting!
              </p>
              
              <div className="space-y-3">
                <Label htmlFor="handwriting-upload" className="text-sm font-medium">
                  Select Images (JPG, PNG)
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("handwriting-upload")?.click()}
                    className="flex-1"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                  <input
                    id="handwriting-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHandwritingUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Uploaded Samples ({uploadedImages.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative border rounded-lg overflow-hidden">
                        <img src={img} alt={`Sample ${idx + 1}`} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">How it works:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Upload 3-5 clear samples of your handwriting</li>
                  <li>AI analyzes stroke patterns, spacing, and style</li>
                  <li>Generates new text in your personal handwriting</li>
                  <li>Perfect consistency for any text length</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Full AI-powered handwriting generation requires a backend
                  ML service with models like GANs or Transformers. Images are stored locally
                  in this demo. For production, integrate with a Python/Flask backend running
                  handwriting synthesis models.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
