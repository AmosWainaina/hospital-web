import { initAuth, setupAuthListeners } from './auth.js';
import { setupDashboard } from './dashboard.js';
import { loadDepartments, loadDoctors, loadServices, setupNavigation, setupScrollEffects } from './content.js';

async function init() {
  await initAuth();

  setupAuthListeners();

  setupNavigation();

  setupDashboard();

  await loadDepartments();
  await loadDoctors();
  await loadServices();

  setupScrollEffects();

  console.log('Care Hospital application initialized successfully');
}

document.addEventListener('DOMContentLoaded', init);
