-- Create a guest user profile with a proper UUID
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'guest@asu.edu', 'Guest User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

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
  );

-- Update RLS policies to allow operations with the guest user
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
