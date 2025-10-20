/*
  # Insert Sample Hospital Data

  ## 1. Data Inserted
    - Departments (6 departments)
    - Doctors (3 doctors using existing images)
    - Services (multiple services per department)

  ## 2. Important Notes
    - Uses images available in the project
    - All data is realistic and comprehensive
    - Doctors are linked to departments
    - Services are priced appropriately
*/

-- Insert Departments
INSERT INTO departments (name, description, icon) VALUES
  ('Emergency', 'Round-the-clock emergency medical services for critical and urgent care situations.', 'emergency'),
  ('Cardiology', 'Specialized care for heart conditions, cardiovascular diseases, and cardiac health monitoring.', 'cardiology'),
  ('Pediatrics', 'Comprehensive healthcare services for infants, children, and adolescents up to age 18.', 'pediatrics'),
  ('Orthopedics', 'Treatment of musculoskeletal system disorders, including bones, joints, ligaments, and tendons.', 'orthopedics'),
  ('Neurology', 'Diagnosis and treatment of nervous system disorders, brain, and spinal cord conditions.', 'neurology'),
  ('Radiology', 'Advanced medical imaging services including X-rays, CT scans, MRI, and ultrasound.', 'radiology')
ON CONFLICT (name) DO NOTHING;

-- Insert Doctors
INSERT INTO doctors (first_name, last_name, specialization, qualification, experience_years, image_url, bio, available, department_id)
SELECT
  'Anthony',
  'Johnson',
  'Emergency Medicine',
  'MD, FACEP',
  15,
  '/images/Dr Anthony.jpg',
  'Dr. Anthony Johnson is a board-certified emergency medicine physician with over 15 years of experience in critical care and trauma management. He specializes in acute care and emergency procedures.',
  true,
  d.id
FROM departments d WHERE d.name = 'Emergency'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (first_name, last_name, specialization, qualification, experience_years, image_url, bio, available, department_id)
SELECT
  'Mark',
  'Stevens',
  'Cardiology',
  'MD, FACC',
  20,
  '/images/Dr Mark.jpg',
  'Dr. Mark Stevens is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention. He has performed over 3,000 cardiac procedures and is dedicated to patient-centered care.',
  true,
  d.id
FROM departments d WHERE d.name = 'Cardiology'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (first_name, last_name, specialization, qualification, experience_years, image_url, bio, available, department_id)
SELECT
  'Tracy',
  'Williams',
  'Pediatrics',
  'MD, FAAP',
  12,
  '/images/Dr Tracy.jpg',
  'Dr. Tracy Williams is a compassionate pediatrician who specializes in child development and preventive care. She has a special interest in pediatric nutrition and childhood immunizations.',
  true,
  d.id
FROM departments d WHERE d.name = 'Pediatrics'
ON CONFLICT DO NOTHING;

-- Insert Services for Emergency Department
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Emergency Consultation',
  'Immediate medical evaluation and treatment for urgent conditions',
  30,
  150.00,
  d.id
FROM departments d WHERE d.name = 'Emergency'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Trauma Care',
  'Comprehensive emergency care for traumatic injuries',
  60,
  500.00,
  d.id
FROM departments d WHERE d.name = 'Emergency'
ON CONFLICT DO NOTHING;

-- Insert Services for Cardiology
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Cardiac Consultation',
  'Comprehensive heart health evaluation and diagnosis',
  45,
  200.00,
  d.id
FROM departments d WHERE d.name = 'Cardiology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Echocardiogram',
  'Ultrasound imaging of the heart to assess structure and function',
  30,
  350.00,
  d.id
FROM departments d WHERE d.name = 'Cardiology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'ECG/EKG',
  'Electrocardiogram to measure heart electrical activity',
  15,
  100.00,
  d.id
FROM departments d WHERE d.name = 'Cardiology'
ON CONFLICT DO NOTHING;

-- Insert Services for Pediatrics
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Well-Child Visit',
  'Routine health checkup and developmental assessment for children',
  30,
  120.00,
  d.id
FROM departments d WHERE d.name = 'Pediatrics'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Vaccination',
  'Childhood immunizations and preventive care',
  20,
  80.00,
  d.id
FROM departments d WHERE d.name = 'Pediatrics'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Sick Visit',
  'Evaluation and treatment for childhood illnesses',
  25,
  100.00,
  d.id
FROM departments d WHERE d.name = 'Pediatrics'
ON CONFLICT DO NOTHING;

-- Insert Services for Orthopedics
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Orthopedic Consultation',
  'Evaluation of musculoskeletal conditions and injuries',
  40,
  180.00,
  d.id
FROM departments d WHERE d.name = 'Orthopedics'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Joint Injection',
  'Therapeutic injection for joint pain and inflammation',
  20,
  250.00,
  d.id
FROM departments d WHERE d.name = 'Orthopedics'
ON CONFLICT DO NOTHING;

-- Insert Services for Neurology
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Neurological Consultation',
  'Comprehensive evaluation of nervous system disorders',
  50,
  220.00,
  d.id
FROM departments d WHERE d.name = 'Neurology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'EEG',
  'Electroencephalogram to measure brain electrical activity',
  45,
  300.00,
  d.id
FROM departments d WHERE d.name = 'Neurology'
ON CONFLICT DO NOTHING;

-- Insert Services for Radiology
INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'X-Ray',
  'Digital radiography for bone and tissue imaging',
  15,
  120.00,
  d.id
FROM departments d WHERE d.name = 'Radiology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'CT Scan',
  'Computed tomography for detailed cross-sectional imaging',
  30,
  600.00,
  d.id
FROM departments d WHERE d.name = 'Radiology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'MRI',
  'Magnetic resonance imaging for detailed soft tissue visualization',
  45,
  900.00,
  d.id
FROM departments d WHERE d.name = 'Radiology'
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, duration_minutes, price, department_id)
SELECT
  'Ultrasound',
  'Real-time imaging using sound waves for diagnostic purposes',
  25,
  200.00,
  d.id
FROM departments d WHERE d.name = 'Radiology'
ON CONFLICT DO NOTHING;
