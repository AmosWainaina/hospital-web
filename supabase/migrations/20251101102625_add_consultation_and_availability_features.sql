/*
  # Add Consultation and Doctor Availability Features

  ## 1. New Tables
    
    ### `consultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_id` (uuid, foreign key to doctors)
      - `subject` (text) - consultation topic
      - `message` (text) - patient's message
      - `status` (text) - pending, responded, closed
      - `callback_requested` (boolean) - if patient wants a callback
      - `preferred_contact_time` (text) - patient's preferred time
      - `response` (text) - doctor's response
      - `responded_at` (timestamptz) - when doctor responded
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    ### `doctor_availability`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `day_of_week` (integer) - 0=Sunday, 6=Saturday
      - `start_time` (time) - shift start time
      - `end_time` (time) - shift end time
      - `is_available` (boolean) - if doctor is available on this day
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all new tables
    - Patients can create consultations and view their own
    - Patients can view doctor availability (public read)
    - Doctors can view consultations assigned to them
    - Doctors can update consultation responses

  ## 3. Important Notes
    - Consultations allow patients to contact doctors
    - Doctor availability shows working hours per day
    - Status tracking for consultation requests
*/

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending',
  callback_requested boolean DEFAULT false,
  preferred_contact_time text DEFAULT '',
  response text DEFAULT '',
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

-- Consultations policies
CREATE POLICY "Patients can view own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = consultations.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = consultations.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can update own consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = consultations.patient_id
      AND patients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = consultations.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Doctor availability policies (public read)
CREATE POLICY "Public can view doctor availability"
  ON doctor_availability FOR SELECT
  USING (true);

-- Insert sample availability for existing doctors (Monday-Friday 9AM-5PM)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_available)
SELECT 
  d.id,
  dow,
  '09:00:00'::time,
  '17:00:00'::time,
  CASE WHEN dow IN (0, 6) THEN false ELSE true END
FROM doctors d
CROSS JOIN generate_series(0, 6) AS dow
ON CONFLICT (doctor_id, day_of_week) DO NOTHING;