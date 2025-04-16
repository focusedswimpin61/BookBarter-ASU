-- First, ensure the guest user exists
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'guest@asu.edu', 'Guest User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for the books table to simplify things
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the profiles table to simplify things
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Add some sample books for the guest user
INSERT INTO public.books (
  id,
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
    gen_random_uuid(),
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
    gen_random_uuid(),
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
    gen_random_uuid(),
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
