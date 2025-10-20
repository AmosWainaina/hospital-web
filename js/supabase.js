import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getPatientProfile(userId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching patient profile:', error);
    return null;
  }

  return data;
}

export async function createPatientProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('patients')
    .insert([{
      user_id: userId,
      ...profileData
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating patient profile:', error);
    throw error;
  }

  return data;
}

export async function updatePatientProfile(patientId, profileData) {
  const { data, error } = await supabase
    .from('patients')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', patientId)
    .select()
    .single();

  if (error) {
    console.error('Error updating patient profile:', error);
    throw error;
  }

  return data;
}

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }

  return data;
}

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      department:departments(name)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data;
}

export async function getDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      department:departments(name)
    `)
    .eq('available', true)
    .order('last_name');

  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }

  return data;
}

export async function getDoctorsByDepartment(departmentId) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('department_id', departmentId)
    .eq('available', true)
    .order('last_name');

  if (error) {
    console.error('Error fetching doctors by department:', error);
    return [];
  }

  return data;
}

export async function getServicesByDepartment(departmentId) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('department_id', departmentId)
    .order('name');

  if (error) {
    console.error('Error fetching services by department:', error);
    return [];
  }

  return data;
}

export async function createAppointment(appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }

  return data;
}

export async function getPatientAppointments(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors(first_name, last_name, specialization),
      department:departments(name),
      service:services(name, duration_minutes, price)
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return data;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }

  return data;
}

export async function createCheckIn(patientId, reason, appointmentId = null) {
  const { data, error } = await supabase
    .from('check_ins')
    .insert([{
      patient_id: patientId,
      appointment_id: appointmentId,
      reason: reason,
      status: 'checked_in'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating check-in:', error);
    throw error;
  }

  return data;
}

export async function checkOut(checkInId) {
  const { data, error } = await supabase
    .from('check_ins')
    .update({
      check_out_time: new Date().toISOString(),
      status: 'checked_out'
    })
    .eq('id', checkInId)
    .select()
    .single();

  if (error) {
    console.error('Error checking out:', error);
    throw error;
  }

  return data;
}

export async function getActiveCheckIn(patientId) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'checked_in')
    .order('check_in_time', { ascending: false })
    .maybeSingle();

  if (error) {
    console.error('Error fetching active check-in:', error);
    return null;
  }

  return data;
}

export async function getCheckInHistory(patientId, limit = 10) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('patient_id', patientId)
    .order('check_in_time', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching check-in history:', error);
    return [];
  }

  return data;
}
