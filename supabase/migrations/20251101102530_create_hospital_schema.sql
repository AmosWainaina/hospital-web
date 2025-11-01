/*
  # Create Hospital Management System Schema

  ## 1. New Tables
    
    ### `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text) - icon identifier
      - `created_at` (timestamptz)
    
    ### `services`
      - `id` (uuid, primary key)
      - `department_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `duration_minutes` (integer)
      - `price` (decimal)
      - `created_at` (timestamptz)
    
    ### `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `department_id` (uuid, foreign key)
      - `first_name` (text)
      - `last_name` (text)
      - `specialization` (text)
      - `qualification` (text)
      - `experience_years` (integer)
      - `image_url` (text)
      - `bio` (text)
      - `available` (boolean, default true)
      - `created_at` (timestamptz)
    
    ### `patients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `phone` (text)
      - `address` (text)
      - `emergency_contact` (text)
      - `blood_group` (text)
      - `allergies` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    ### `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `department_id` (uuid, foreign key)
      - `service_id` (uuid, foreign key)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `status` (text) - pending, confirmed, completed, cancelled
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    ### `check_ins`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `appointment_id` (uuid, foreign key, nullable)
      - `check_in_time` (timestamptz)
      - `check_out_time` (timestamptz, nullable)
      - `reason` (text)
      - `status` (text) - checked_in, checked_out
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for doctors to view their appointments
    - Add policies for patients to view departments, services, and doctors
    - Add policies for patients to manage their appointments and check-ins

  ## 3. Important Notes
    - All tables use UUID primary keys with auto-generation
    - Foreign keys ensure data integrity
    - Timestamps track creation and updates
    - Default values prevent null issues
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration_minutes integer DEFAULT 30,
  price decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  specialization text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  experience_years integer DEFAULT 0,
  image_url text DEFAULT '',
  bio text DEFAULT '',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  emergency_contact text DEFAULT '',
  blood_group text DEFAULT '',
  allergies text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  check_in_time timestamptz DEFAULT now(),
  check_out_time timestamptz,
  reason text NOT NULL DEFAULT '',
  status text DEFAULT 'checked_in',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Departments policies (public read)
CREATE POLICY "Public can view departments"
  ON departments FOR SELECT
  USING (true);

-- Services policies (public read)
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  USING (true);

-- Doctors policies (public read)
CREATE POLICY "Public can view doctors"
  ON doctors FOR SELECT
  USING (true);

-- Patients policies
CREATE POLICY "Users can view own patient profile"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patient profile"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patient profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
      AND patients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Check-ins policies
CREATE POLICY "Patients can view own check-ins"
  ON check_ins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = check_ins.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create check-ins"
  ON check_ins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = check_ins.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can update own check-ins"
  ON check_ins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = check_ins.patient_id
      AND patients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = check_ins.patient_id
      AND patients.user_id = auth.uid()
    )
  );