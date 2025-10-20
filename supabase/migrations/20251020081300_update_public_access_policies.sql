/*
  # Update RLS Policies for Public Access

  ## 1. Changes
    - Drop existing policies that require authentication
    - Create new policies to allow public (unauthenticated) read access to:
      - departments
      - services
      - doctors

  ## 2. Security
    - Maintains RLS on all tables
    - Only allows SELECT (read) operations for public users
    - Write operations still require authentication
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view departments" ON departments;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;

-- Create new public read policies
CREATE POLICY "Public can view departments"
  ON departments FOR SELECT
  USING (true);

CREATE POLICY "Public can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Public can view doctors"
  ON doctors FOR SELECT
  USING (true);
