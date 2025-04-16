-- First, check if the guest user exists and create if not
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES 
  ('guest', 'guest@asu.edu', 'Guest User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Drop existing RLS policies for books table if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."books";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."books";
DROP POLICY IF EXISTS "Enable update for users based on seller_id" ON "public"."books";
DROP POLICY IF EXISTS "Enable delete for users based on seller_id" ON "public"."books";

-- Create new policies that allow the guest user to perform operations
CREATE POLICY "Enable read access for all users" 
ON "public"."books" 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for guest and authenticated users" 
ON "public"."books" 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for guest and authenticated users" 
ON "public"."books" 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for guest and authenticated users" 
ON "public"."books" 
FOR DELETE 
USING (true);

-- Drop existing RLS policies for profiles table if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable update for users based on id" ON "public"."profiles";

-- Create new policies that allow the guest user to perform operations
CREATE POLICY "Enable read access for all users" 
ON "public"."profiles" 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for guest and authenticated users" 
ON "public"."profiles" 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for guest and authenticated users" 
ON "public"."profiles" 
FOR UPDATE 
USING (true);
