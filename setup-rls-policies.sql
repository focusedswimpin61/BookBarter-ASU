-- First, ensure the guest user exists
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'guest@asu.edu', 'Guest User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the books table
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Enable insert for guest user" 
ON "public"."books" 
FOR INSERT 
WITH CHECK (seller_id = '00000000-0000-0000-0000-000000000000');

CREATE POLICY "Enable update for guest user" 
ON "public"."books" 
FOR UPDATE 
USING (seller_id = '00000000-0000-0000-0000-000000000000');

CREATE POLICY "Enable delete for guest user" 
ON "public"."books" 
FOR DELETE 
USING (seller_id = '00000000-0000-0000-0000-000000000000');

-- Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies for profiles table if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable update for users based on id" ON "public"."profiles";

-- Create new policies that allow the guest user to perform operations
CREATE POLICY "Enable read access for all users" 
ON "public"."profiles" 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for guest user" 
ON "public"."profiles" 
FOR INSERT 
WITH CHECK (id = '00000000-0000-0000-0000-000000000000');

CREATE POLICY "Enable update for guest user" 
ON "public"."profiles" 
FOR UPDATE 
USING (id = '00000000-0000-0000-0000-000000000000');

-- Add some sample books for the guest user
INSERT INTO public.books (
  title, 
  course_code, 
  price, 
  condition, 
  material_type, 
  genre, 
  description, 
  seller_id, 
  is_sold, 
  created_at, 
  updated_at
)
VALUES 
  (
    'Introduction to Computer Science', 
    'CSE 110', 
    45.99, 
    'Good', 
    'Textbook', 
    'STEM', 
    'Great introductory textbook for CS students', 
    '00000000-0000-0000-0000-000000000000', 
    false, 
    NOW(), 
    NOW()
  ),
  (
    'Calculus for Engineers', 
    'MAT 265', 
    55.00, 
    'Like New', 
    'Textbook', 
    'STEM', 
    'Barely used calculus textbook', 
    '00000000-0000-0000-0000-000000000000', 
    false, 
    NOW(), 
    NOW()
  ),
  (
    'Introduction to Psychology', 
    'PSY 101', 
    30.50, 
    'Fair', 
    'Textbook', 
    'Humanities', 
    'Psychology textbook with some highlighting', 
    '00000000-0000-0000-0000-000000000000', 
    false, 
    NOW(), 
    NOW()
  )
ON CONFLICT DO NOTHING;
