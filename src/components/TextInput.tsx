import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const recognitionRef = useState<any>(null)[0];

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast.error("Please upload a text file (.txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onChange(text);
      toast.success("File uploaded successfully!");
    };
    reader.readAsText(file);
  };

  // Handle voice input with silence detection
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in your browser");
      return;
    }

    // If already listening, stop
    if (isListening && recognitionRef) {
      recognitionRef.stop();
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
      toast.success("Voice input stopped");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    Object.assign(recognitionRef, recognition);

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Start speaking now...");
    };

    recognition.onresult = (event: any) => {
      // Clear existing silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }

      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        onChange(value + finalTranscript);
      }

      // Set new silence timer (2 seconds)
      const timer = setTimeout(() => {
        if (recognition && isListening) {
          recognition.stop();
          toast.info("Stopped due to silence");
        }
      }, 2000);
      
      setSilenceTimer(timer);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Voice input error: " + event.error);
      setIsListening(false);
      if (silenceTimer) clearTimeout(silenceTimer);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimer) clearTimeout(silenceTimer);
    };

    recognition.start();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Text File
        </Button>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={handleVoiceInput}
          className="flex-1"
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Voice Input
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Voice Input
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your text here or use voice input / upload a file..."
        className="min-h-[300px] font-medium resize-none"
      />
    </div>
  );
};
