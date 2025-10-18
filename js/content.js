import { getDepartments, getServices, getDoctors } from './supabase.js';

const departmentIcons = {
  'emergency': '🚑',
  'cardiology': '❤️',
  'pediatrics': '👶',
  'orthopedics': '🦴',
  'neurology': '🧠',
  'radiology': '🔬'
};

export async function loadDepartments() {
  const grid = document.getElementById('departments-grid');
  grid.innerHTML = '<div class="loading">Loading departments...</div>';

  const departments = await getDepartments();

  if (departments.length === 0) {
    grid.innerHTML = '<p>No departments available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  departments.forEach(dept => {
    const card = document.createElement('div');
    card.className = 'department-card';

    const icon = departmentIcons[dept.icon] || '🏥';

    card.innerHTML = `
      <div class="department-icon">${icon}</div>
      <h3>${dept.name}</h3>
      <p>${dept.description}</p>
    `;

    grid.appendChild(card);
  });
}

export async function loadDoctors() {
  const grid = document.getElementById('doctors-grid');
  grid.innerHTML = '<div class="loading">Loading doctors...</div>';

  const doctors = await getDoctors();

  if (doctors.length === 0) {
    grid.innerHTML = '<p>No doctors available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  doctors.forEach(doctor => {
    const card = document.createElement('div');
    card.className = 'doctor-card';

    card.innerHTML = `
      <img src="${doctor.image_url}" alt="Dr. ${doctor.first_name} ${doctor.last_name}" class="doctor-image" onerror="this.src='https://via.placeholder.com/350x400?text=Dr.+${doctor.first_name}+${doctor.last_name}'">
      <div class="doctor-info">
        <h3 class="doctor-name">Dr. ${doctor.first_name} ${doctor.last_name}</h3>
        <p class="doctor-specialization">${doctor.specialization}</p>
        <p class="doctor-details">
          <strong>Qualification:</strong> ${doctor.qualification}<br>
          <strong>Experience:</strong> ${doctor.experience_years} years<br>
          ${doctor.department ? `<strong>Department:</strong> ${doctor.department.name}` : ''}
        </p>
        ${doctor.bio ? `<p class="doctor-bio">${doctor.bio}</p>` : ''}
      </div>
    `;

    grid.appendChild(card);
  });
}

export async function loadServices() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '<div class="loading">Loading services...</div>';

  const services = await getServices();

  if (services.length === 0) {
    grid.innerHTML = '<p>No services available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  services.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';

    card.innerHTML = `
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      ${service.department ? `<p><strong>Department:</strong> ${service.department.name}</p>` : ''}
      <div class="service-meta">
        <span class="service-duration">⏱️ ${service.duration_minutes} minutes</span>
        <span class="service-price">$${parseFloat(service.price).toFixed(2)}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

export function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        sections.forEach(s => s.classList.add('hidden'));
        targetSection.classList.remove('hidden');

        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.innerWidth <= 968) {
          navLinksContainer.classList.remove('active');
        }
      }

      window.location.hash = targetId;
    });
  });

  const handleHashChange = () => {
    const hash = window.location.hash.substring(1) || 'home';
    const targetSection = document.getElementById(hash);

    if (targetSection) {
      sections.forEach(s => s.classList.add('hidden'));
      targetSection.classList.remove('hidden');

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  handleHashChange();

  sections.forEach((section, index) => {
    if (index > 0) {
      section.classList.add('hidden');
    }
  });
}

export function setupScrollEffects() {
  const navbar = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.department-card, .doctor-card, .service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
  });
}
