-- Create table for storing user submissions
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  file_name TEXT,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert submissions
CREATE POLICY "Anyone can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to view submissions
CREATE POLICY "Anyone can view submissions"
ON public.submissions
FOR SELECT
USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true);

-- Create policy for file uploads
CREATE POLICY "Anyone can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submissions');

-- Create policy for viewing files
CREATE POLICY "Anyone can view files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'submissions');