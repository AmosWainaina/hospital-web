import { supabase, getCurrentUser, getPatientProfile, createPatientProfile } from './supabase.js';

let currentUser = null;
let currentPatient = null;

export async function initAuth() {
  try {
    const user = await getCurrentUser();

    if (user) {
      currentUser = user;
      const patient = await getPatientProfile(user.id);
      currentPatient = patient;
      updateUIForAuthState(true);
    } else {
      updateUIForAuthState(false);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    // Even if there's an error, set the UI to logged out state
    updateUIForAuthState(false);
  }

  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      try {
        if (event === 'SIGNED_IN' && session) {
          currentUser = session.user;
          const patient = await getPatientProfile(session.user.id);
          currentPatient = patient;
          updateUIForAuthState(true);
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          currentPatient = null;
          updateUIForAuthState(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Ensure UI is updated even on error
        if (event === 'SIGNED_IN' && session) {
          currentUser = session.user;
          updateUIForAuthState(true);
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          currentPatient = null;
          updateUIForAuthState(false);
        }
      }
    })();
  });
}

function updateUIForAuthState(isAuthenticated) {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const dashboardNav = document.getElementById('dashboard-nav');
  const dashboardSection = document.getElementById('dashboard');
  const authContainer = document.getElementById('auth-container');

  if (isAuthenticated) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    dashboardNav.classList.remove('hidden');
    authContainer.classList.add('auth-hidden');
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    dashboardNav.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    authContainer.classList.add('auth-hidden');

    const hash = window.location.hash;
    if (hash === '#dashboard') {
      window.location.hash = '#home';
    }
  }
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function register(email, password, profileData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    try {
      await createPatientProfile(data.user.id, profileData);
    } catch (profileError) {
      console.error('Error creating patient profile:', profileError);
    }
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function getCurrentUserData() {
  return { user: currentUser, patient: currentPatient };
}

export function setCurrentPatient(patient) {
  currentPatient = patient;
}

export function setupAuthListeners() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const closeAuthBtn = document.getElementById('close-auth');
  const authContainer = document.getElementById('auth-container');
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const bookAppointmentHeroBtn = document.getElementById('book-appointment-hero');

  loginBtn.addEventListener('click', () => {
    authContainer.classList.remove('auth-hidden');
    document.body.style.overflow = 'hidden';
  });

  closeAuthBtn.addEventListener('click', () => {
    authContainer.classList.add('auth-hidden');
    document.body.style.overflow = 'auto';
    loginForm.reset();
    registerForm.reset();
  });

  authContainer.addEventListener('click', (e) => {
    if (e.target === authContainer) {
      authContainer.classList.add('auth-hidden');
      document.body.style.overflow = 'auto';
      loginForm.reset();
      registerForm.reset();
    }
  });

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (targetTab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
      } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
      }
    });
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
      await login(email, password);
      // Close modal and redirect to dashboard after successful login
      authContainer.classList.add('auth-hidden');
      document.body.style.overflow = 'auto';
      loginForm.reset();
      errorDiv.textContent = '';
      errorDiv.classList.remove('show');
      window.location.hash = '#dashboard';
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
      // Keep modal open on error
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const phone = document.getElementById('register-phone').value;
    const dob = document.getElementById('register-dob').value;
    const gender = document.getElementById('register-gender').value;
    const errorDiv = document.getElementById('register-error');

    try {
      await register(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        date_of_birth: dob,
        gender: gender
      });

      // Close modal after successful registration
      authContainer.classList.add('auth-hidden');
      document.body.style.overflow = 'auto';
      registerForm.reset();
      errorDiv.textContent = '';
      errorDiv.classList.remove('show');

      // Switch to login tab after successful registration
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();

      alert('Registration successful! You can now login.');
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
      // Keep modal open on error
    }
  });

  logoutBtn.addEventListener('click', async () => {
    try {
      await logout();
      window.location.hash = '#home';
    } catch (error) {
      console.error('Logout error:', error);
    }
  });

  bookAppointmentHeroBtn.addEventListener('click', () => {
    if (currentUser) {
      window.location.hash = '#dashboard';
      setTimeout(() => {
        const bookTab = document.querySelector('[data-tab="book"]');
        if (bookTab) bookTab.click();
      }, 100);
    } else {
      authContainer.classList.remove('auth-hidden');
      document.body.style.overflow = 'hidden';
    }
  });
}
