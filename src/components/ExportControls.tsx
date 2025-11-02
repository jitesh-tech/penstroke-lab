import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Upload } from "lucide-react";
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

interface ExportControlsProps {
  previewElementId: string;
}

export const ExportControls = ({ previewElementId }: ExportControlsProps) => {
  const [isExporting, setIsExporting] = useState(false);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Your Handwriting (Coming Soon)</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                This feature will allow you to upload samples of your own handwriting,
                and our AI will learn to replicate your unique style!
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">How it will work:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Upload 3-5 samples of your handwriting</li>
                  <li>AI analyzes your writing style</li>
                  <li>Generates text in your personal handwriting</li>
                  <li>Perfect consistency every time</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                This requires a backend AI service. For now, enjoy our beautiful
                pre-designed handwriting fonts!
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
