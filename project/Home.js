document.addEventListener('DOMContentLoaded', function() {
  // Get all the links
  const homeLink = document.getElementById('home-link');
  const aboutLink = document.getElementById('about-link');
  const doctorsLink = document.getElementById('doctors-link');
  const serviceLink = document.getElementById('Service-link');
  const departmentsLink = document.getElementById('Departments');
  const contactLink = document.getElementById('Contact');

  // Add click event listeners to each link
  homeLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default behavior of the link
      window.location.href = 'Home.html'; // Navigate to Home.html
  });

  aboutLink.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'About.html';
  });

  doctorsLink.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'Doctors.html';
  });

  serviceLink.addEventListener('click', function(event) {
      event.preventDefault();
      // Handle Service page navigation
  });

  departmentsLink.addEventListener('click', function(event) {
      event.preventDefault();
      // Handle Departments page navigation
  });

  contactLink.addEventListener('click', function(event) {
      event.preventDefault();
      // Handle Contact page navigation
  });
});

  
  const sections = {
    home: document.getElementById('home-section'),
    about: document.getElementById('about-section'),
    doctors: document.getElementById('doctors-section'),
    // Add references for other sections here
  };
  
  // Function to scroll smoothly to a section when a link is clicked
  function scrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Add click event listeners to the links
  for (const [key, link] of Object.entries(links)) {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default link behavior
  
      // Scroll to the corresponding section when a link is clicked
      scrollToSection(sections[key]);
    });
  }