import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Upload, FileCheck } from "lucide-react";
import SubmissionForm from "@/components/SubmissionForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FormFlow
          </h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Simple & Efficient Workflow
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Submit, Upload, Done
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A streamlined process to capture your information and files in just a few clicks. Fast, secure, and hassle-free.
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-lg px-8 py-6 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Form</h3>
            <p className="text-muted-foreground">
              Enter your name and number in seconds with our intuitive form interface.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-muted-foreground">
              Upload any file type - PDFs, images, documents - with a simple drag and drop.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">View Results</h3>
            <p className="text-muted-foreground">
              See your submission instantly with all your information clearly displayed.
            </p>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && <SubmissionForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Index;