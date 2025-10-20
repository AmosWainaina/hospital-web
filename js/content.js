const departmentIcons = {
  'emergency': '🚑',
  'cardiology': '❤️',
  'pediatrics': '👶',
  'orthopedics': '🦴',
  'neurology': '🧠',
  'radiology': '🔬',
  'dermatology': '🧴',
  'ophthalmology': '👁️',
  'gynecology': '👩‍⚕️',
  'urology': '🩺'
};

const staticDepartments = [
  {
    name: 'Emergency',
    description: 'Round-the-clock emergency medical services for critical and urgent care situations, including trauma care and life-saving interventions.',
    icon: 'emergency'
  },
  {
    name: 'Cardiology',
    description: 'Specialized care for heart conditions, cardiovascular diseases, and cardiac health monitoring with advanced diagnostic tools.',
    icon: 'cardiology'
  },
  {
    name: 'Pediatrics',
    description: 'Comprehensive healthcare services for infants, children, and adolescents, focusing on growth, development, and preventive care.',
    icon: 'pediatrics'
  },
  {
    name: 'Orthopedics',
    description: 'Treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and sports-related injuries.',
    icon: 'orthopedics'
  },
  {
    name: 'Neurology',
    description: 'Diagnosis and treatment of nervous system disorders, brain, spinal cord conditions, and neurological rehabilitation.',
    icon: 'neurology'
  },
  {
    name: 'Radiology',
    description: 'Advanced medical imaging services including X-rays, CT scans, MRI, ultrasound, and specialized diagnostic imaging.',
    icon: 'radiology'
  },
  {
    name: 'Dermatology',
    description: 'Comprehensive skin care services, including treatment of skin conditions, cosmetic dermatology, and skin cancer screening.',
    icon: 'dermatology'
  },
  {
    name: 'Ophthalmology',
    description: 'Eye care services including vision exams, treatment of eye diseases, and surgical procedures for vision correction.',
    icon: 'ophthalmology'
  }
];

export async function loadDepartments() {
  const grid = document.getElementById('departments-grid');
  grid.innerHTML = '<div class="loading">Loading departments...</div>';

  // Simulate async loading
  await new Promise(resolve => setTimeout(resolve, 500));

  if (staticDepartments.length === 0) {
    grid.innerHTML = '<p>No departments available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  staticDepartments.forEach(dept => {
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

const staticDoctors = [
  {
    first_name: 'Anthony',
    last_name: 'Johnson',
    specialization: 'Emergency Medicine',
    qualification: 'MD, FACEP',
    experience_years: 15,
    image_url: '/images/Dr Anthony.jpg',
    bio: 'Dr. Anthony Johnson is a board-certified emergency medicine physician with over 15 years of experience in critical care and trauma management. He specializes in acute care and emergency procedures.',
    department: { name: 'Emergency' }
  },
  {
    first_name: 'Mark',
    last_name: 'Stevens',
    specialization: 'Cardiology',
    qualification: 'MD, FACC',
    experience_years: 20,
    image_url: '/images/Dr Mark.jpg',
    bio: 'Dr. Mark Stevens is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention. He has performed over 3,000 cardiac procedures and is dedicated to patient-centered care.',
    department: { name: 'Cardiology' }
  },
  {
    first_name: 'Tracy',
    last_name: 'Williams',
    specialization: 'Pediatrics',
    qualification: 'MD, FAAP',
    experience_years: 12,
    image_url: '/images/Dr Tracy.jpg',
    bio: 'Dr. Tracy Williams is a compassionate pediatrician who specializes in child development and preventive care. She has a special interest in pediatric nutrition and childhood immunizations.',
    department: { name: 'Pediatrics' }
  },
  {
    first_name: 'Sarah',
    last_name: 'Chen',
    specialization: 'Orthopedics',
    qualification: 'MD, FAAOS',
    experience_years: 18,
    image_url: '/images/Doctors.png',
    bio: 'Dr. Sarah Chen is an orthopedic surgeon specializing in joint replacement and sports medicine. She has extensive experience in minimally invasive surgical techniques and rehabilitation.',
    department: { name: 'Orthopedics' }
  },
  {
    first_name: 'Michael',
    last_name: 'Rodriguez',
    specialization: 'Neurology',
    qualification: 'MD, FAAN',
    experience_years: 14,
    image_url: '/images/Doctors.png',
    bio: 'Dr. Michael Rodriguez is a neurologist with expertise in stroke care, epilepsy, and neurodegenerative disorders. He is committed to providing comprehensive neurological care to his patients.',
    department: { name: 'Neurology' }
  },
  {
    first_name: 'Emily',
    last_name: 'Davis',
    specialization: 'Radiology',
    qualification: 'MD, ABR',
    experience_years: 16,
    image_url: '/images/Doctors.png',
    bio: 'Dr. Emily Davis is a radiologist specializing in diagnostic imaging and interventional radiology. She uses advanced imaging technologies to provide accurate diagnoses and minimally invasive treatments.',
    department: { name: 'Radiology' }
  }
];

export async function loadDoctors() {
  const grid = document.getElementById('doctors-grid');
  grid.innerHTML = '<div class="loading">Loading doctors...</div>';

  // Simulate async loading
  await new Promise(resolve => setTimeout(resolve, 500));

  if (staticDoctors.length === 0) {
    grid.innerHTML = '<p>No doctors available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  staticDoctors.forEach(doctor => {
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

const staticServices = [
  // Emergency Services
  {
    name: 'Emergency Consultation',
    description: 'Immediate medical evaluation and treatment for urgent conditions',
    department: { name: 'Emergency' },
    duration_minutes: 30,
    price: 150.00
  },
  {
    name: 'Trauma Care',
    description: 'Comprehensive emergency care for traumatic injuries',
    department: { name: 'Emergency' },
    duration_minutes: 60,
    price: 500.00
  },
  {
    name: 'Critical Care',
    description: 'Intensive care for life-threatening conditions',
    department: { name: 'Emergency' },
    duration_minutes: 120,
    price: 800.00
  },

  // Cardiology Services
  {
    name: 'Cardiac Consultation',
    description: 'Comprehensive heart health evaluation and diagnosis',
    department: { name: 'Cardiology' },
    duration_minutes: 45,
    price: 200.00
  },
  {
    name: 'Echocardiogram',
    description: 'Ultrasound imaging of the heart to assess structure and function',
    department: { name: 'Cardiology' },
    duration_minutes: 30,
    price: 350.00
  },
  {
    name: 'ECG/EKG',
    description: 'Electrocardiogram to measure heart electrical activity',
    department: { name: 'Cardiology' },
    duration_minutes: 15,
    price: 100.00
  },
  {
    name: 'Cardiac Catheterization',
    description: 'Minimally invasive procedure to diagnose and treat heart conditions',
    department: { name: 'Cardiology' },
    duration_minutes: 90,
    price: 1200.00
  },

  // Pediatrics Services
  {
    name: 'Well-Child Visit',
    description: 'Routine health checkup and developmental assessment for children',
    department: { name: 'Pediatrics' },
    duration_minutes: 30,
    price: 120.00
  },
  {
    name: 'Vaccination',
    description: 'Childhood immunizations and preventive care',
    department: { name: 'Pediatrics' },
    duration_minutes: 20,
    price: 80.00
  },
  {
    name: 'Sick Visit',
    description: 'Evaluation and treatment for childhood illnesses',
    department: { name: 'Pediatrics' },
    duration_minutes: 25,
    price: 100.00
  },
  {
    name: 'Developmental Assessment',
    description: 'Comprehensive evaluation of child development milestones',
    department: { name: 'Pediatrics' },
    duration_minutes: 45,
    price: 180.00
  },

  // Orthopedics Services
  {
    name: 'Orthopedic Consultation',
    description: 'Evaluation of musculoskeletal conditions and injuries',
    department: { name: 'Orthopedics' },
    duration_minutes: 40,
    price: 180.00
  },
  {
    name: 'Joint Injection',
    description: 'Therapeutic injection for joint pain and inflammation',
    department: { name: 'Orthopedics' },
    duration_minutes: 20,
    price: 250.00
  },
  {
    name: 'Sports Medicine Consultation',
    description: 'Specialized care for athletic injuries and performance optimization',
    department: { name: 'Orthopedics' },
    duration_minutes: 35,
    price: 160.00
  },
  {
    name: 'Physical Therapy Session',
    description: 'Rehabilitation and strengthening exercises for musculoskeletal recovery',
    department: { name: 'Orthopedics' },
    duration_minutes: 60,
    price: 120.00
  },

  // Neurology Services
  {
    name: 'Neurological Consultation',
    description: 'Comprehensive evaluation of nervous system disorders',
    department: { name: 'Neurology' },
    duration_minutes: 50,
    price: 220.00
  },
  {
    name: 'EEG',
    description: 'Electroencephalogram to measure brain electrical activity',
    department: { name: 'Neurology' },
    duration_minutes: 45,
    price: 300.00
  },
  {
    name: 'MRI Brain Scan',
    description: 'Magnetic resonance imaging for detailed brain visualization',
    department: { name: 'Neurology' },
    duration_minutes: 60,
    price: 800.00
  },
  {
    name: 'Neurological Rehabilitation',
    description: 'Therapeutic interventions for neurological recovery and adaptation',
    department: { name: 'Neurology' },
    duration_minutes: 45,
    price: 150.00
  },

  // Radiology Services
  {
    name: 'X-Ray',
    description: 'Digital radiography for bone and tissue imaging',
    department: { name: 'Radiology' },
    duration_minutes: 15,
    price: 120.00
  },
  {
    name: 'CT Scan',
    description: 'Computed tomography for detailed cross-sectional imaging',
    department: { name: 'Radiology' },
    duration_minutes: 30,
    price: 600.00
  },
  {
    name: 'MRI',
    description: 'Magnetic resonance imaging for detailed soft tissue visualization',
    department: { name: 'Radiology' },
    duration_minutes: 45,
    price: 900.00
  },
  {
    name: 'Ultrasound',
    description: 'Real-time imaging using sound waves for diagnostic purposes',
    department: { name: 'Radiology' },
    duration_minutes: 25,
    price: 200.00
  },

  // Dermatology Services
  {
    name: 'Dermatology Consultation',
    description: 'Comprehensive skin evaluation and treatment planning',
    department: { name: 'Dermatology' },
    duration_minutes: 30,
    price: 140.00
  },
  {
    name: 'Skin Cancer Screening',
    description: 'Full body examination for skin cancer detection',
    department: { name: 'Dermatology' },
    duration_minutes: 45,
    price: 180.00
  },
  {
    name: 'Acne Treatment',
    description: 'Medical treatment for acne and related skin conditions',
    department: { name: 'Dermatology' },
    duration_minutes: 25,
    price: 120.00
  },

  // Ophthalmology Services
  {
    name: 'Eye Examination',
    description: 'Comprehensive vision and eye health assessment',
    department: { name: 'Ophthalmology' },
    duration_minutes: 40,
    price: 160.00
  },
  {
    name: 'Glaucoma Screening',
    description: 'Pressure testing and evaluation for glaucoma',
    department: { name: 'Ophthalmology' },
    duration_minutes: 30,
    price: 130.00
  },
  {
    name: 'Cataract Evaluation',
    description: 'Assessment and treatment planning for cataracts',
    department: { name: 'Ophthalmology' },
    duration_minutes: 35,
    price: 170.00
  }
];

export async function loadServices() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '<div class="loading">Loading services...</div>';

  // Simulate async loading
  await new Promise(resolve => setTimeout(resolve, 500));

  if (staticServices.length === 0) {
    grid.innerHTML = '<p>No services available at the moment.</p>';
    return;
  }

  grid.innerHTML = '';
  staticServices.forEach(service => {
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

  if (mobileMenuToggle && navLinksContainer) {
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
