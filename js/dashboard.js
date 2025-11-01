import {
  getCurrentUserData,
  setCurrentPatient
} from './auth.js';
import {
  updatePatientProfile,
  getDepartments,
  getDoctorsByDepartment,
  getServicesByDepartment,
  createAppointment,
  getPatientAppointments,
  updateAppointmentStatus,
  createCheckIn,
  checkOut,
  getActiveCheckIn,
  getCheckInHistory,
  createConsultation,
  getPatientConsultations,
  getDoctors
} from './supabase.js';

export function setupDashboard() {
  setupDashboardTabs();
  setupCheckIn();
  setupAppointmentBooking();
  setupProfile();
  setupConsultation();
}

function setupDashboardTabs() {
  const tabs = document.querySelectorAll('.dashboard-tab');
  const panels = document.querySelectorAll('.dashboard-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => panel.classList.remove('active'));
      document.getElementById(`${targetTab}-panel`).classList.add('active');

      if (targetTab === 'appointments') {
        loadAppointments();
      } else if (targetTab === 'check-in') {
        loadCheckInStatus();
      } else if (targetTab === 'consultation') {
        loadConsultations();
      }
    });
  });

  const panelTabs = document.querySelectorAll('.panel-tab');
  panelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelTab = tab.dataset.panelTab;

      panelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const panelContents = document.querySelectorAll('.panel-tab-content');
      panelContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${targetPanelTab}-consultation-tab`).classList.add('active');

      if (targetPanelTab === 'history') {
        loadConsultations();
      }
    });
  });
}

async function setupCheckIn() {
  const checkInBtn = document.getElementById('check-in-btn');
  const checkOutBtn = document.getElementById('check-out-btn');

  checkInBtn.addEventListener('click', async () => {
    const { user, patient } = getCurrentUserData();
    if (!user) {
      alert('Please login to check in');
      return;
    }

    if (!patient) {
      alert('Please complete your profile first');
      return;
    }

    const reason = prompt('Reason for visit:');
    if (!reason) return;

    try {
      await createCheckIn(patient.id, reason);
      await loadCheckInStatus();
      alert('Checked in successfully!');
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to check in. Please try again.');
    }
  });

  checkOutBtn.addEventListener('click', async () => {
    const { user, patient } = getCurrentUserData();
    if (!user) {
      alert('Please login to check out');
      return;
    }

    if (!patient) return;

    const activeCheckIn = await getActiveCheckIn(patient.id);
    if (!activeCheckIn) return;

    try {
      await checkOut(activeCheckIn.id);
      await loadCheckInStatus();
      alert('Checked out successfully!');
    } catch (error) {
      console.error('Check-out error:', error);
      alert('Failed to check out. Please try again.');
    }
  });

  await loadCheckInStatus();
}

async function loadCheckInStatus() {
  const { patient } = getCurrentUserData();
  if (!patient) return;

  const statusDiv = document.getElementById('check-in-status');
  const checkInBtn = document.getElementById('check-in-btn');
  const checkOutBtn = document.getElementById('check-out-btn');
  const historyDiv = document.getElementById('check-in-history');

  const activeCheckIn = await getActiveCheckIn(patient.id);

  if (activeCheckIn) {
    const checkInTime = new Date(activeCheckIn.check_in_time);
    statusDiv.innerHTML = `
      <strong>Status:</strong> Checked In<br>
      <strong>Check-in Time:</strong> ${checkInTime.toLocaleString()}<br>
      <strong>Reason:</strong> ${activeCheckIn.reason}
    `;
    checkInBtn.classList.add('hidden');
    checkOutBtn.classList.remove('hidden');
  } else {
    statusDiv.innerHTML = '<strong>Status:</strong> Not checked in';
    checkInBtn.classList.remove('hidden');
    checkOutBtn.classList.add('hidden');
  }

  const history = await getCheckInHistory(patient.id);
  if (history.length > 0) {
    historyDiv.innerHTML = '<h4>Recent Check-ins</h4>';
    history.forEach(item => {
      const checkInTime = new Date(item.check_in_time);
      const checkOutTime = item.check_out_time ? new Date(item.check_out_time) : null;

      historyDiv.innerHTML += `
        <div class="check-in-item">
          <p><strong>Date:</strong> ${checkInTime.toLocaleDateString()}</p>
          <p><strong>Check-in:</strong> ${checkInTime.toLocaleTimeString()}</p>
          ${checkOutTime ? `<p><strong>Check-out:</strong> ${checkOutTime.toLocaleTimeString()}</p>` : ''}
          <p><strong>Reason:</strong> ${item.reason}</p>
          <p><strong>Status:</strong> ${item.status}</p>
        </div>
      `;
    });
  }
}

async function setupAppointmentBooking() {
  const form = document.getElementById('appointment-form');
  const departmentSelect = document.getElementById('appointment-department');
  const doctorSelect = document.getElementById('appointment-doctor');
  const serviceSelect = document.getElementById('appointment-service');
  const dateInput = document.getElementById('appointment-date');

  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  const departments = await getDepartments();
  departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept.id;
    option.textContent = dept.name;
    departmentSelect.appendChild(option);
  });

  departmentSelect.addEventListener('change', async () => {
    const departmentId = departmentSelect.value;

    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    serviceSelect.innerHTML = '<option value="">Select Service</option>';

    if (!departmentId) return;

    const doctors = await getDoctorsByDepartment(departmentId);
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`;
      doctorSelect.appendChild(option);
    });

    const services = await getServicesByDepartment(departmentId);
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = `${service.name} - $${service.price}`;
      serviceSelect.appendChild(option);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { user, patient } = getCurrentUserData();
    if (!user) {
      alert('Please login to book an appointment');
      return;
    }

    if (!patient) {
      alert('Please complete your profile first');
      return;
    }

    const errorDiv = document.getElementById('appointment-error');
    const successDiv = document.getElementById('appointment-success');

    const appointmentData = {
      patient_id: patient.id,
      doctor_id: doctorSelect.value,
      department_id: departmentSelect.value,
      service_id: serviceSelect.value || null,
      appointment_date: dateInput.value,
      appointment_time: document.getElementById('appointment-time').value,
      notes: document.getElementById('appointment-notes').value,
      status: 'pending'
    };

    try {
      await createAppointment(appointmentData);

      successDiv.textContent = 'Appointment booked successfully!';
      successDiv.classList.add('show');
      errorDiv.classList.remove('show');

      form.reset();

      setTimeout(() => {
        successDiv.classList.remove('show');
      }, 5000);
    } catch (error) {
      console.error('Appointment booking error:', error);
      errorDiv.textContent = 'Failed to book appointment. Please try again.';
      errorDiv.classList.add('show');
      successDiv.classList.remove('show');
    }
  });
}

async function loadAppointments() {
  const { patient } = getCurrentUserData();
  if (!patient) return;

  const listDiv = document.getElementById('appointments-list');
  listDiv.innerHTML = '<div class="loading">Loading appointments...</div>';

  const appointments = await getPatientAppointments(patient.id);

  if (appointments.length === 0) {
    listDiv.innerHTML = '<p>No appointments found. Book your first appointment!</p>';
    return;
  }

  listDiv.innerHTML = '';
  appointments.forEach(appointment => {
    const date = new Date(appointment.appointment_date);
    const time = appointment.appointment_time;

    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.innerHTML = `
      <div class="appointment-header">
        <h4>${date.toLocaleDateString()}</h4>
        <span class="appointment-status ${appointment.status}">${appointment.status}</span>
      </div>
      <div class="appointment-details">
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Doctor:</strong> Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}</p>
        <p><strong>Specialization:</strong> ${appointment.doctor.specialization}</p>
        <p><strong>Department:</strong> ${appointment.department.name}</p>
        ${appointment.service ? `<p><strong>Service:</strong> ${appointment.service.name}</p>` : ''}
        ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      </div>
    `;
    listDiv.appendChild(card);
  });
}

async function setupProfile() {
  const form = document.getElementById('profile-form');
  const { patient } = getCurrentUserData();

  if (patient) {
    document.getElementById('profile-firstname').value = patient.first_name || '';
    document.getElementById('profile-lastname').value = patient.last_name || '';
    document.getElementById('profile-phone').value = patient.phone || '';
    document.getElementById('profile-dob').value = patient.date_of_birth || '';
    document.getElementById('profile-address').value = patient.address || '';
    document.getElementById('profile-emergency').value = patient.emergency_contact || '';
    document.getElementById('profile-blood').value = patient.blood_group || '';
    document.getElementById('profile-allergies').value = patient.allergies || '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { patient } = getCurrentUserData();
    if (!patient) return;

    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');

    const profileData = {
      first_name: document.getElementById('profile-firstname').value,
      last_name: document.getElementById('profile-lastname').value,
      phone: document.getElementById('profile-phone').value,
      date_of_birth: document.getElementById('profile-dob').value,
      address: document.getElementById('profile-address').value,
      emergency_contact: document.getElementById('profile-emergency').value,
      blood_group: document.getElementById('profile-blood').value,
      allergies: document.getElementById('profile-allergies').value
    };

    try {
      const updatedPatient = await updatePatientProfile(patient.id, profileData);
      setCurrentPatient(updatedPatient);

      successDiv.textContent = 'Profile updated successfully!';
      successDiv.classList.add('show');
      errorDiv.classList.remove('show');

      setTimeout(() => {
        successDiv.classList.remove('show');
      }, 5000);
    } catch (error) {
      console.error('Profile update error:', error);
      errorDiv.textContent = 'Failed to update profile. Please try again.';
      errorDiv.classList.add('show');
      successDiv.classList.remove('show');
    }
  });
}

async function setupConsultation() {
  const form = document.getElementById('consultation-form');
  const doctorSelect = document.getElementById('consultation-doctor');

  const doctors = await getDoctors();
  doctors.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor.id;
    option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`;
    doctorSelect.appendChild(option);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { user, patient } = getCurrentUserData();
    if (!user) {
      alert('Please login to send a consultation request');
      return;
    }

    if (!patient) {
      alert('Please complete your profile first');
      return;
    }

    const errorDiv = document.getElementById('consultation-error');
    const successDiv = document.getElementById('consultation-success');

    const consultationData = {
      patient_id: patient.id,
      doctor_id: doctorSelect.value,
      subject: document.getElementById('consultation-subject').value,
      message: document.getElementById('consultation-message').value,
      callback_requested: document.getElementById('consultation-callback').checked,
      preferred_contact_time: document.getElementById('consultation-contact-time').value,
      status: 'pending'
    };

    try {
      await createConsultation(consultationData);

      successDiv.textContent = 'Consultation request sent successfully! The doctor will respond soon.';
      successDiv.classList.add('show');
      errorDiv.classList.remove('show');

      form.reset();

      setTimeout(() => {
        successDiv.classList.remove('show');
      }, 5000);
    } catch (error) {
      console.error('Consultation creation error:', error);
      errorDiv.textContent = 'Failed to send consultation request. Please try again.';
      errorDiv.classList.add('show');
      successDiv.classList.remove('show');
    }
  });
}

async function loadConsultations() {
  const { patient } = getCurrentUserData();
  if (!patient) return;

  const listDiv = document.getElementById('consultations-list');
  listDiv.innerHTML = '<div class="loading">Loading consultations...</div>';

  const consultations = await getPatientConsultations(patient.id);

  if (consultations.length === 0) {
    listDiv.innerHTML = '<p>No consultations found. Send your first consultation request!</p>';
    return;
  }

  listDiv.innerHTML = '';
  consultations.forEach(consultation => {
    const date = new Date(consultation.created_at);

    const card = document.createElement('div');
    card.className = 'consultation-card';
    card.innerHTML = `
      <div class="consultation-header">
        <h4>${consultation.subject}</h4>
        <span class="consultation-status ${consultation.status}">${consultation.status}</span>
      </div>
      <div class="consultation-details">
        <p><strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
        <p><strong>Doctor:</strong> Dr. ${consultation.doctor.first_name} ${consultation.doctor.last_name}</p>
        <p><strong>Specialization:</strong> ${consultation.doctor.specialization}</p>
        <p><strong>Your Message:</strong> ${consultation.message}</p>
        ${consultation.callback_requested ? '<p><strong>Callback Requested:</strong> Yes</p>' : ''}
        ${consultation.preferred_contact_time ? `<p><strong>Preferred Contact Time:</strong> ${consultation.preferred_contact_time}</p>` : ''}
        ${consultation.response ? `
          <div class="consultation-response">
            <p><strong>Doctor's Response:</strong></p>
            <p>${consultation.response}</p>
            <p><small>Responded: ${new Date(consultation.responded_at).toLocaleString()}</small></p>
          </div>
        ` : '<p><em>Awaiting doctor response...</em></p>'}
      </div>
    `;
    listDiv.appendChild(card);
  });
}
