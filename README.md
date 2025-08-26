# 🌟 Professional Personal Website Template

A modern, responsive personal website template built with vanilla JavaScript, Tailwind CSS, and advanced features including AI chat integration, accessibility enhancements, and performance optimizations.

> **🎯 Ready-to-Use Template**: This is a fully functional template where **you only need to edit one file** (`scripts/data.js`) to create your personalized professional website. No coding required!

## 🚀 Quick Start (5 Minutes Setup)

1. **Clone or download** this repository
2. **Edit** `scripts/data.js` with your personal information
3. **Replace** `profile.jpg` with your professional photo
4. **Deploy** to your preferred hosting platform
5. **Done!** Your personalized website is ready


## 🎯 What You Get

- **Professional Design** - Dark theme, smooth animations, modern layout
- **Fully Responsive** - Looks perfect on desktop, tablet, and mobile
- **SEO Ready** - Meta tags, Open Graph, Twitter cards auto-generated
- **Contact Form** - AWS Lambda integration or easy third-party alternatives
- **AI Chat Feature** - Optional Chrome AI integration for visitor interaction
- **Accessibility First** - WCAG compliant, screen reader optimized
- **Performance Optimized** - Fast loading, lazy images, reduced motion support
- **Zero Configuration HTML** - All content populated from data.js automatically

## ✨ Features

- **🎨 Modern Design** - Clean, professional layout with dark theme
- **📱 Fully Responsive** - Optimized for all screen sizes
- **♿ Accessible** - WCAG compliant with screen reader support
- **⚡ Fast Performance** - Optimized loading and smooth animations
- **🤖 AI Chat** - Optional Chrome AI integration for visitor interaction
- **📧 Contact Form** - AWS Lambda backend support for form submissions
- **🎯 SEO Optimized** - Dynamic meta tags and social sharing
- **🔧 Easy Customization** - Configure everything through one data file

## 📁 Project Structure

```
personal-website/
├── index.html              # Main HTML file (minimal editing required)
├── scripts/
│   ├── data.js            # 🎯 MAIN CONFIG FILE - Edit this!
│   ├── main.js            # Core functionality
│   ├── ai-manager.js      # AI features
│   ├── ai-chat-interface.js
│   ├── animations.js      # Visual effects
│   └── accessibility-enhancements.js
├── styles/
│   └── main.css           # Custom styles
├── assets/
│   └── favicon.svg        # Site icon
    ├── profile.jpg        # Your profile photo (replace this)
└── README.md              # This file
```

## 🔧 Configuration Guide

### Step 1: Update Personal Information (`scripts/data.js`)

#### Site Configuration
```javascript
const siteConfig = {
    title: "Your Name",                    // Page title
    description: "Your professional bio",   // Meta description for SEO
    keywords: "Your, Skills, Keywords",     // SEO keywords
    author: "Your Name",
    ogUrl: "https://yourwebsite.com",      // Your website URL
    twitterTitle: "Your Name",
    twitterDescription: "Your tagline",
    themeColor: "#111827",                 // Browser theme color
    faviconPath: "assets/favicon.svg"      // Path to your favicon
};
```

#### Contact Configuration
```javascript
const contactConfig = {
    lambdaUrl: 'your-aws-lambda-url',      // Your contact form backend
    contactEmail: "your@email.com",        // Your contact email
    maxMessageLength: 1000,                // Max characters in contact form
    enableContactForm: true                // Enable/disable contact form
};
```

#### Personal Introduction
```javascript
const personalIntro = {
    paragraph1: "Your introduction paragraph 1...",
    paragraph2: "Your introduction paragraph 2...",
    paragraph3: "Your introduction paragraph 3..."
};
```

#### Personal Information
```javascript
const personalInfo = {
    name: "Your Name",
    title: "Your Job Title",
    currentCompany: "Your Company",
    tagline: "Your professional tagline",
    email: "your@email.com",
    location: "Your Location",
    bio: "Your professional bio",
    profileImage: "assets/profile.jpg",    // Optional: change if different
};
```

### Step 2: Update Your Professional Data

#### Experience
Replace the `experience` array with your work history:
```javascript
const experience = [
    {
        company: "Company Name",
        position: "Your Position",
        duration: "Start Date - End Date",
        location: "Location",
        flag: "🇺🇸",                      // Country flag emoji
        country: "Country",
        description: "Brief description of your role...",
        achievements: [
            "Achievement 1",
            "Achievement 2",
            // Add more achievements
        ],
        technologies: ["Tech1", "Tech2", "Tech3"]
    },
    // Add more experience entries
];
```

#### Projects
Update the `projects` array with your work:
```javascript
const projects = [
    {
        title: "Project Name",
        description: "Project description...",
        image: null,                       // Optional: add image URL
        technologies: ["Tech1", "Tech2"],
        liveUrl: "https://project-demo.com",
        githubUrl: "https://github.com/user/project",
        featured: true,                    // Show on main page
        category: "Web Development"        // Project category
    },
    // Add more projects
];
```

#### Skills
Customize your skills and proficiency levels:
```javascript
const skills = {
    "Frontend": [
        { name: "JavaScript", level: 90, icon: "code" },
        { name: "React", level: 85, icon: "component" },
        // Add your frontend skills
    ],
    "Backend & Languages": [
        { name: "Node.js", level: 85, icon: "server" },
        // Add your backend skills
    ],
    // Add more skill categories
};
```

### Step 3: Replace Your Photo

- Replace `profile.jpg` with your professional headshot
- Recommended: Square image, at least 400x400px, good lighting

### Step 4: Optional Customizations

#### Social Links
```javascript
const socialLinks = [
    {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/your-profile",
        icon: "linkedin",
        color: "#0077b5"
    },
    // Add your social profiles
];
```

#### Articles/Blog Posts
```javascript
const articles = [
    {
        title: "Article Title",
        excerpt: "Brief description...",
        url: "https://your-blog.com/article",
        publishDate: "2024-01-01",
        readTime: "5 min read",
        tags: ["Tag1", "Tag2"]
    },
    // Add your articles
];
```

## 🚀 Deployment Options

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source: Deploy from a branch
4. Choose `main` branch
5. Your site will be available at `https://username.github.io/repository-name`

### AWS S3 + CloudFront
1. Upload files to S3 bucket
2. Enable static website hosting
3. Set up CloudFront distribution (optional)

## 📧 Contact Form Setup

The template includes a contact form that requires an AWS Lambda backend:

### Option 1: Use AWS Lambda (Recommended)
1. Create an AWS Lambda function for form processing
2. Set up API Gateway or Lambda Function URL
3. Update `contactConfig.lambdaUrl` in `data.js`


### Option 2: Disable Contact Form
```javascript
const contactConfig = {
    enableContactForm: false,  // This will hide the contact form
    contactEmail: "your@email.com"  // Keep for mailto links
};
```

## 🎨 Customization Tips

### Colors and Themes
- The template uses Tailwind CSS classes
- Main colors are defined in `index.html` Tailwind config
- Modify the color scheme by updating Tailwind color classes

### Sections
- Hide/show sections by commenting out the corresponding HTML in `index.html`
- All content is populated from `data.js`, so empty arrays will show "loading" states

### AI Chat Feature
- The AI chat uses Chrome's built-in AI (Gemini Nano)
- Works only in compatible Chrome browsers
- Will automatically hide if AI is not supported
- Customize the AI personality by editing the system prompt in `main.js`

### Animations
- Animations automatically adapt to user preferences
- Reduced motion support included
- Performance optimization for low-end devices

## 🛠️ Development

### Local Development
```bash
# Simple HTTP server (Python)
python3 -m http.server 8000

# Or using Node.js
npx http-server

# Or using PHP
php -S localhost:8000
```

### Browser Requirements
- **Modern browsers** (Chrome 90+, Firefox 88+, Safari 14+)
- **JavaScript enabled**
- **Chrome AI features** require Chrome 127+ with experimental flags

## 📋 Checklist for New Users

### Before Publishing:
- [ ] Updated all sections in `data.js` with your information
- [ ] Replaced `me.jpg` with your photo
- [ ] Updated contact email and social links
- [ ] Tested contact form (if using Lambda)
- [ ] Updated site title and meta descriptions
- [ ] Added your projects and experience
- [ ] Verified all external links work
- [ ] Updated portfolio links

### Optional Enhancements:
- [ ] Set up AWS Lambda for contact form
- [ ] Configure custom domain
- [ ] Add Google Analytics (add tracking code to `index.html`)
- [ ] Set up SSL certificate
- [ ] Optimize images for web
- [ ] Add more project screenshots

## 🔧 Troubleshooting

### Contact Form Not Working
1. Check if `contactConfig.lambdaUrl` is set correctly
2. Verify Lambda function is publicly accessible
3. Check browser console for error messages
4. Test with `enableContactForm: false` to disable

### Styling Issues
1. Ensure Tailwind CSS is loading (check network tab)
2. Clear browser cache
3. Verify all CSS files are accessible

### JavaScript Errors
1. Open browser developer tools (F12)
2. Check console for error messages
3. Ensure all script files are loading correctly
4. Verify `data.js` syntax is correct (use JSON validator)

### AI Chat Not Appearing
1. AI chat requires Chrome 127+ with experimental flags OR Origin Trial token
2. Feature will automatically hide if not supported
3. This is expected behavior and doesn't affect the main site

## 🤖 Chrome Prompt API Origin Trial Setup

The AI chat feature uses Chrome's built-in Prompt API (Gemini Nano). Instead of requiring users to manually enable Chrome flags, you can register for Google's Origin Trial to automatically enable the feature for your domain visitors.

### What is the Origin Trial?

The Chrome Prompt API Origin Trial allows websites to use experimental Chrome AI features without requiring users to manually enable flags. When you register your domain and add the origin trial token to your HTML, Chrome automatically enables the Prompt API for all visitors to your site.

**Benefits over manual Chrome flags:**
- ✅ **Better User Experience**: Visitors don't need to configure anything
- ✅ **Automatic Activation**: AI features work immediately for supported browsers  
- ✅ **Higher Adoption**: More users will experience your AI features
- ✅ **Professional Setup**: No technical knowledge required from visitors

### Step-by-Step Registration Process

#### 1. Register for Origin Trial
1. Visit [Chrome Origin Trials](https://developer.chrome.com/origintrials/)
2. Sign in with your Google account
3. Click "Register for New Trial"
4. Search for **"Prompt API for Gemini Nano"** or **"AI Prompt API Multimodal Input"**
5. Select the trial and click "Register"

#### 2. Add Your Domain
1. Enter your website domain (e.g., `https://yoursite.com`)
2. Include both `www` and non-`www` versions if needed:
   - `https://yoursite.com`
   - `https://www.yoursite.com`
3. For localhost testing, add: `http://localhost:8000` (adjust port as needed)
4. Click "Register"

#### 3. Get Your Token
1. After registration, you'll receive a unique origin trial token
2. Copy the token string (it will be quite long)

#### 4. Update Your HTML
Replace the existing origin trial meta tag in `index.html`:

**Find this existing line:**
```html
<meta http-equiv="origin-trial" content="AqMixl1ARhc0sjViJvLf27A7IYKfLAi0V3sTbkLO5/PjCWcwX9M405Xmi4KWNJfZBWlr1ueL5A06O+fCjjg+hQgAAAB2eyJvcmlnaW4iOiJodHRwczovL21haW4uZDEwcmdlMG55M203c3YuYW1wbGlmeWFwcC5jb206NDQzIiwiZmVhdHVyZSI6IkFJUHJvbXB0QVBJTXVsdGltb2RhbElucHV0IiwiZXhwaXJ5IjoxNzc0MzEwNDAwfQ==">
```

**Replace with your token:**
```html
<meta http-equiv="origin-trial" content="YOUR_ORIGIN_TRIAL_TOKEN_HERE">
```

#### 5. Deploy and Test
1. Deploy your updated website
2. Visit your site in Chrome 127+ (Canary/Dev Channel recommended)
3. Open DevTools Console - you should see AI detection logs
4. The AI chat button should appear automatically if the browser supports it

### Important Notes

**Token Expiry:**
- Origin trial tokens have expiration dates (typically 6-12 months)
- Monitor your token status in the Chrome Origin Trials dashboard
- Update tokens before they expire to maintain functionality

**Browser Requirements:**
- Chrome 127+ (Canary, Dev, or Beta channels recommended)
- Desktop only (mobile Chrome doesn't support on-device AI yet)
- ChromeOS is not currently supported

**Fallback for Development:**
If you prefer not to use Origin Trial or need to test locally, users can still manually enable Chrome flags:

1. Open Chrome and navigate to: `chrome://flags/`
2. Enable these flags:
   - `#prompt-api-for-gemini-nano`
   - `#optimization-guide-on-device-model`
3. Restart Chrome
4. Visit `chrome://components/`
5. Find "Optimization Guide On Device Model" and click "Check for update"
6. Wait for the model to download (~5GB)

### Troubleshooting Origin Trial

**Token Not Working:**
- Verify your domain exactly matches what you registered
- Check that the token hasn't expired
- Ensure you're testing on the registered domain (not localhost unless registered)
- Try hard refresh (Ctrl+F5) to clear cache

**AI Still Not Available:**
- Confirm you're using Chrome 127+ (check `chrome://version/`)
- Try Chrome Canary or Dev channel for latest features
- Check browser console for specific error messages
- Verify you're not on mobile or ChromeOS

**Model Download Issues:**
- The AI model is ~5GB and downloads automatically
- Download happens in background and may take time
- Check `chrome://components/` for download status
- Ensure stable internet connection

For more information, see the [Chrome AI Documentation](https://developer.chrome.com/docs/ai/get-started).

## 📄 License

This template is open source and available under the MIT License. Feel free to use it for personal or commercial projects.

## 🤝 Contributing

Found a bug or want to suggest improvements? Please open an issue or submit a pull request!

## 💡 Support

For questions about using this template:
1. Check this README first
2. Look at the example data in `data.js`
3. Check browser console for error messages
4. Open an issue on GitHub for bugs or questions

---

**Made with ❤️ by [Karthik Subramanian](https://github.com/karthiks3000)**

Ready to build your amazing personal website? Just edit `data.js` and you're good to go! 🎉
