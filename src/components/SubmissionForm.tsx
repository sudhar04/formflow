import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Send, X } from "lucide-react";
import { toast } from "sonner";

interface SubmissionFormProps {
  onClose: () => void;
}

type Step = "form" | "upload";

const SubmissionForm = ({ onClose }: SubmissionFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !number.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("submissions")
        .insert([{ name, number }])
        .select()
        .single();

      if (error) throw error;

      setSubmissionId(data.id);
      setStep("upload");
      toast.success("Information saved successfully!");
    } catch (error) {
      console.error("Error saving submission:", error);
      toast.error("Failed to save information");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !submissionId) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${submissionId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("submissions")
        .update({ file_name: file.name, file_path: filePath })
        .eq("id", submissionId);

      if (updateError) throw updateError;

      toast.success("File uploaded successfully!");
      
      setTimeout(() => {
        navigate(`/result?id=${submissionId}`);
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl animate-scale-in relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {step === "form" ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>Enter your information to begin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="Enter your number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Upload File</CardTitle>
              <CardDescription>Upload any document, image, or PDF file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary font-medium hover:underline">
                      Click to upload
                    </span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, DOC, Images up to 10MB
                  </p>
                </div>
                {uploading && (
                  <div className="text-center text-sm text-muted-foreground">
                    Uploading file...
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default SubmissionForm;