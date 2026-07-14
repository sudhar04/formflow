import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, User, Hash, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  name: string;
  number: string;
  file_name: string | null;
  file_path: string | null;
}

const Result = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get("id");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) {
        toast.error("No submission ID provided");
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("id", submissionId)
          .maybeSingle();

        if (error) throw error;
        setSubmission(data);
      } catch (error) {
        console.error("Error fetching submission:", error);
        toast.error("Failed to load submission data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Submission Not Found</CardTitle>
            <CardDescription>The requested submission could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All Steps Completed Successfully!
            </CardTitle>
            <CardDescription className="text-lg">
              Your submission has been processed and stored securely.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold text-lg">{submission.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Number</p>
                  <p className="font-semibold text-lg">{submission.number}</p>
                </div>
              </div>

              {submission.file_name && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Uploaded File</p>
                    <p className="font-semibold text-lg break-all">{submission.file_name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Result;