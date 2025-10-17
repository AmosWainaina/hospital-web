# Care Hospital - Comprehensive Hospital Management System

A modern, full-featured hospital management web application built with HTML, CSS, JavaScript, and Supabase.

## Features

### Patient Features
- **User Authentication**: Secure login and registration system
- **Patient Dashboard**: Personalized dashboard for managing healthcare needs
- **Check-In/Check-Out**: Easy facility check-in and check-out tracking
- **Appointment Booking**: Book appointments with specific doctors and departments
- **Appointment History**: View all past and upcoming appointments
- **Profile Management**: Update personal information, medical history, and emergency contacts

### Hospital Information
- **Departments**: Browse all hospital departments with detailed descriptions
- **Doctors Directory**: View profiles of expert doctors with their specializations and experience
- **Services**: Explore available medical services with pricing and duration information
- **About Us**: Learn about the hospital's mission, facilities, and commitment to care

### Technical Features
- Modern, responsive design that works on all devices
- Smooth animations and transitions
- Real-time data synchronization with Supabase
- Secure authentication with row-level security
- Professional UI with gradient effects and modern color scheme

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Custom CSS with modern design principles

## Database Schema

The application uses the following main tables:
- `patients` - Patient profiles and medical information
- `doctors` - Doctor profiles and specializations
- `departments` - Hospital departments
- `services` - Medical services offered
- `appointments` - Patient appointment bookings
- `check_ins` - Patient check-in/check-out records

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
care-hospital/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── main.js           # Application entry point
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Dashboard functionality
│   ├── content.js        # Content loading and display
│   └── supabase.js       # Supabase client and API calls
├── project/
│   └── images/           # Hospital images and assets
└── package.json          # Project dependencies
```

## Usage

### For Patients

1. **Register/Login**: Create an account or login to access the patient dashboard
2. **Complete Profile**: Fill in your medical information and emergency contacts
3. **Book Appointments**: Select a department, doctor, and time slot for your appointment
4. **Check-In**: Use the check-in feature when you arrive at the hospital
5. **View History**: Track your appointment history and check-in records

### Navigation

- **Home**: Welcome page with quick access to key features
- **About**: Information about the hospital
- **Departments**: Browse all medical departments
- **Doctors**: View doctor profiles
- **Services**: Explore available services
- **Dashboard**: Access patient features (login required)

## Design Highlights

- Clean, professional medical aesthetic
- Teal/cyan primary color scheme for trust and cleanliness
- Responsive grid layouts for departments, doctors, and services
- Smooth hover effects and transitions
- Mobile-friendly navigation
- Accessible form designs

## Security

- Row Level Security (RLS) enabled on all database tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- No sensitive data exposed in client-side code

## Credits

- Images sourced from project assets
- Built with Care Hospital branding and identity
- Powered by Supabase for backend services

## License

This is a proprietary hospital management system for Care Hospital.
