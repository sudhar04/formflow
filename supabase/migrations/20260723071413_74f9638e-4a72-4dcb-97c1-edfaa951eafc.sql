
-- Remove GraphQL discoverability for authenticated/anon roles (app uses PostgREST, not GraphQL)
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql FROM anon, authenticated;

-- Add owner-scoped DELETE policy for the submissions storage bucket
CREATE POLICY "Users can delete their own submission files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'submissions'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
