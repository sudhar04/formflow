
-- Add user_id and scope submissions to owners
ALTER TABLE public.submissions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Clear any pre-existing rows without an owner so we can enforce NOT NULL
DELETE FROM public.submissions WHERE user_id IS NULL;

ALTER TABLE public.submissions ALTER COLUMN user_id SET NOT NULL;

-- Drop overly-permissive policies
DROP POLICY IF EXISTS "Anyone can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.submissions;

-- Ensure grants (no anon; auth-only)
REVOKE ALL ON public.submissions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

-- Owner-scoped RLS policies
CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage: replace public policies with owner-scoped ones (files stored under {user_id}/...)
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

CREATE POLICY "Users can view their own submission files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own submission files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
