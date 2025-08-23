# Karthik Subramanian - Personal Website

A modern, responsive personal website showcasing professional experience, projects, and technical expertise. Built with vanilla JavaScript, Tailwind CSS, and enhanced with smooth animations and interactive elements.

## 🌟 Features

- **Modern Design**: Clean, professional layout with contemporary aesthetics
- **Interactive Animations**: Smooth GSAP animations and particle effects
- **Fully Responsive**: Optimized for all devices and screen sizes
- **Accessibility Compliant**: WCAG 2.1 AA compliant with full keyboard navigation
- **Cross-browser Compatible**: Works on all modern browsers with graceful degradation
- **Performance Optimized**: Fast loading with lazy loading and optimized assets
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 🚀 Live Demo

[View Live Website](https://karthiks3000.dev)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom components
- **Animations**: GSAP (GreenSock), AOS (Animate On Scroll)
- **Effects**: Particles.js for interactive background
- **Icons**: Lucide Icons for consistent iconography
- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **Performance**: Advanced optimization and browser compatibility

## 📁 Project Structure

```
├── index.html                    # Main HTML file
├── styles/
│   └── main.css                 # Custom CSS styles and components
├── scripts/
│   ├── main.js                  # Core functionality and initialization
│   ├── animations.js            # GSAP animations and effects
│   ├── data.js                  # Dynamic content data
│   ├── performance.js           # Performance optimization utilities
│   └── browser-compatibility.js # Cross-browser support and polyfills
├── assets/
│   ├── favicon.svg              # Site favicon
│   └── projects/                # Project screenshots and assets
├── docs/
│   └── TESTING.md               # Comprehensive testing documentation
├── me.jpg                       # Professional headshot
├── profile-photo.svg            # Fallback profile image
└── Karthik_Subramanian.pdf      # Resume PDF download
```

## 🎨 Website Sections

1. **Hero Section**: Animated introduction with particle background and social links
2. **About**: Personal background, fun facts, and personality traits
3. **Experience**: Interactive timeline with detailed work history
4. **Projects**: Filterable showcase with live demos and GitHub links
5. **Skills & Education**: Interactive skills visualization and certifications
6. **Articles**: Latest blog posts from Dev.to integration
7. **Contact**: Functional contact form with validation and social links

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- A local web server for development (recommended)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/karthiks3000/personal-website.git
   cd personal-website
   ```

2. **Serve locally** (recommended)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Direct File Access
You can also open `index.html` directly in your browser, though some features may be limited without a local server.

## 🎨 Customization

### Personal Information
Update your data in `scripts/data.js`:

```javascript
const personalInfo = {
    name: "Your Name",
    title: "Your Professional Title",
    tagline: "Your professional tagline",
    email: "your.email@example.com",
    // ... other personal details
};

const experience = [
    {
        company: "Your Company",
        position: "Your Position",
        duration: "Start - End",
        // ... experience details
    }
];
```

### Assets
- Replace `me.jpg` with your professional photo
- Update `Karthik_Subramanian.pdf` with your resume
- Add project images to `assets/projects/`
- Update `assets/favicon.svg` with your favicon

### Styling
- Modify color scheme in the Tailwind config within `index.html`
- Customize components in `styles/main.css`
- Adjust animations in `scripts/animations.js`

## 📊 Performance & Quality

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: 
  - LCP < 2.5s (Largest Contentful Paint)
  - FID < 100ms (First Input Delay)
  - CLS < 0.1 (Cumulative Layout Shift)
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Optimized meta tags and semantic structure

## 🔧 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |
| IE      | Any     | ❌ Not Supported* |

*Internet Explorer users will see a graceful fallback with basic functionality.

## � Responsive Design

- **Mobile-first approach** with progressive enhancement
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Touch-friendly interactions** with 44px minimum touch targets
- **Optimized typography** scaling across all devices

## ♿ Accessibility Features

- Semantic HTML structure with proper landmarks
- ARIA labels and roles for screen readers
- Full keyboard navigation support
- High contrast ratios (4.5:1 minimum)
- Respects user motion preferences
- Focus management for interactive elements

## 🧪 Testing

The website includes comprehensive testing capabilities. For detailed testing procedures, see [`docs/TESTING.md`](docs/TESTING.md).

### Manual Testing Checklist
- [ ] All navigation links work correctly
- [ ] Contact form validates and submits properly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All images load with proper fallbacks
- [ ] Animations respect user motion preferences
- [ ] Site is fully keyboard accessible
- [ ] External links open securely in new tabs

## 🔒 Security Features

- **Secure External Links**: All external links include `rel="noopener noreferrer"`
- **Form Validation**: Client-side validation with security considerations
- **Content Security**: No inline scripts or unsafe practices
- **HTTPS Ready**: Optimized for secure connections

## 🚀 Deployment

The website is static and can be deployed to any hosting service:

### Recommended Platforms
- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Automatic deployments with form handling
- **Vercel**: Fast global CDN with automatic HTTPS
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **Traditional Web Hosting**: Any standard web server

### Deployment Steps
1. Build/optimize assets (if needed)
2. Upload files to your hosting service
3. Configure custom domain (optional)
4. Set up HTTPS certificate
5. Test all functionality in production

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**Karthik Subramanian**  
Senior Software Engineering Manager

- 🌐 **Website**: [karthiks3000.dev](https://karthiks3000.dev)
- 💼 **LinkedIn**: [karthik-subramanian-7381b67b](https://www.linkedin.com/in/karthik-subramanian-7381b67b/)
- 🐙 **GitHub**: [@karthiks3000](https://github.com/karthiks3000)
- ✍️ **Blog**: [dev.to/karthiks3000](https://dev.to/karthiks3000)
- 📧 **Email**: contact@karthiks3000.dev

---

⭐ **If you found this project helpful, please consider giving it a star!**

Built with ❤️ by Karthik Subramanian