// Get references to the navigation links and target sections
const links = {
    home: document.getElementById('home-link'),
    about: document.getElementById('about-link'),
    doctors: document.getElementById('doctors-link'),
    // Add references for other links and sections here
  };
  
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