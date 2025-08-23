// Personal Website Data for Karthik Subramanian

// Personal Information
const personalInfo = {
    name: "Karthik Subramanian",
    title: "Senior Software Engineering Manager",
    tagline: "Building innovative solutions with AWS and modern web technologies",
    email: "contact@karthiks3000.dev",
    location: "Remote",
    bio: "Passionate software engineer with extensive experience in cloud technologies, full-stack development, and AWS services. Currently leading engineering teams at Scholastic Inc. and contributing to the AWS community through technical articles and innovative projects.",
    profileImage: "assets/profile.jpg",
    resume: "assets/Karthik_Subramanian.pdf"
};

// Social Links
const socialLinks = [
    {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/karthik-subramanian-7381b67b/",
        icon: "linkedin",
        color: "#0077b5"
    },
    {
        platform: "GitHub",
        url: "https://github.com/karthiks3000",
        icon: "github",
        color: "#333"
    },
    {
        platform: "Portfolio",
        url: "https://karthiks3000.github.io/",
        icon: "globe",
        color: "#2563eb"
    },
    {
        platform: "Dev.to",
        url: "https://dev.to/karthiks3000",
        icon: "pen-tool",
        color: "#0a0a0a"
    }
];

// Professional Experience
const experience = [
    {
        company: "Scholastic Inc.",
        position: "Senior Software Engineering Manager",
        duration: "Oct 2022 - Present",
        location: "Remote",
        description: "Leading software engineering teams and driving technical strategy for educational technology solutions at one of the world's largest publishers and distributors of children's books.",
        achievements: [
            "Managing and mentoring senior software engineering teams",
            "Driving technical architecture decisions for scalable educational platforms",
            "Implementing best practices for software development lifecycle",
            "Collaborating with product teams to deliver innovative educational solutions"
        ],
        technologies: ["Team Leadership", "Software Architecture", "Educational Technology", "Agile Methodologies"]
    },
    {
        company: "Renaissance Learning",
        position: "Technical Lead",
        duration: "Mar 2022 - Oct 2022",
        location: "Remote",
        description: "Led technical initiatives for educational assessment and learning analytics platforms, focusing on scalable solutions for K-12 education.",
        achievements: [
            "Architected and implemented scalable learning analytics solutions",
            "Led cross-functional teams in delivering educational assessment tools",
            "Optimized system performance for high-volume educational data processing",
            "Mentored junior developers and established coding standards"
        ],
        technologies: ["Technical Leadership", "Learning Analytics", "Data Processing", "Educational Software"]
    },
    {
        company: "Scholastic Inc.",
        position: "Senior Software Engineer Consultant",
        duration: "Apr 2018 - Mar 2022",
        location: "Remote",
        description: "Developed and maintained large-scale educational software solutions, focusing on digital learning platforms and content management systems.",
        achievements: [
            "Built scalable web applications for educational content delivery",
            "Implemented robust APIs for educational data management",
            "Optimized application performance for millions of student users",
            "Collaborated with UX teams to create engaging educational interfaces"
        ],
        technologies: ["Full-Stack Development", "API Design", "Educational Platforms", "Performance Optimization"]
    },
    {
        company: "Viacom Inc.",
        position: "Technical Lead Consultant",
        duration: "Jun 2011 - Apr 2018",
        location: "New York, NY",
        description: "Led technical development for media and entertainment platforms, focusing on content management systems and digital media delivery solutions.",
        achievements: [
            "Architected content management systems for major media brands",
            "Led development teams for high-traffic entertainment websites",
            "Implemented scalable video streaming and content delivery solutions",
            "Established technical standards and development processes"
        ],
        technologies: ["Media Technology", "Content Management", "Video Streaming", "High-Traffic Systems"]
    }
];

// Featured Projects
const projects = [
    {
        title: "Multiplayer TriviaSnake Game",
        description: "Built with Amazon Q Developer - an innovative multiplayer game combining trivia and snake gameplay mechanics. Features real-time multiplayer functionality, trivia questions, and classic snake game elements.",
        image: null, // Will use placeholder
        technologies: ["JavaScript", "AWS", "WebSockets", "HTML5 Canvas", "Amazon Q Developer"],
        liveUrl: "https://dev.to/aws-builders/building-a-multiplayer-triviasnake-game-with-amazon-q-developer-15j3",
        demoUrl: "https://dj3xrj5xgqclx.cloudfront.net/",
        videoUrl: "https://www.youtube.com/watch?v=s6iQiddfELA",
        githubUrl: "https://github.com/karthiks3000/triviasnake",
        featured: true,
        category: "Game Development"
    },
    {
        title: "AWS Serverless Architecture with SAM",
        description: "Comprehensive tutorial series on building serverless applications with AWS SAM. Covers setup, deployment, best practices, and real-world implementation examples.",
        image: null, // Will use placeholder
        technologies: ["AWS Lambda", "API Gateway", "DynamoDB", "SAM", "CloudFormation"],
        liveUrl: "https://dev.to/aws-builders/aws-serverless-architecture-with-sam-part-1-3fj1",
        githubUrl: "https://github.com/karthiks3000/aws-sam-tutorial",
        featured: true,
        category: "Cloud Architecture"
    },
    {
        title: "Rapid Prototyping Insights",
        description: "Technical article sharing key insights and lessons learned from rapid prototyping experiences in software development. Covers methodologies, tools, and best practices.",
        image: null, // Will use placeholder
        technologies: ["Prototyping", "Development Best Practices", "Technical Writing"],
        liveUrl: "https://dev.to/aws-builders/rapid-learnings-from-rapid-prototyping-54pe",
        featured: true,
        category: "Technical Writing"
    },
    {
        title: "Personal Portfolio Website",
        description: "Modern, responsive personal website built with vanilla JavaScript, Tailwind CSS, and advanced animations. Features interactive timeline, project showcase, and optimized performance.",
        image: null, // Will use placeholder
        technologies: ["JavaScript", "Tailwind CSS", "GSAP", "AOS", "HTML5"],
        liveUrl: "#",
        githubUrl: "https://github.com/karthiks3000",
        featured: false,
        category: "Web Development"
    },
    {
        title: "AWS Community Builder Content",
        description: "Collection of technical articles and tutorials created as part of the AWS Community Builders program, focusing on cloud architecture and serverless technologies.",
        image: null, // Will use placeholder
        technologies: ["AWS", "Technical Writing", "Community Building", "Cloud Architecture"],
        liveUrl: "https://dev.to/karthiks3000",
        featured: false,
        category: "Technical Writing"
    },
    {
        title: "Educational Technology Solutions",
        description: "Enterprise-scale educational platforms and learning management systems developed during tenure at Scholastic Inc. and Renaissance Learning.",
        image: null, // Will use placeholder
        technologies: ["Educational Technology", "Scalable Architecture", "Learning Analytics", "Full-Stack Development"],
        liveUrl: null,
        githubUrl: null,
        featured: false,
        category: "Enterprise Solutions"
    }
];

// Skills Data
const skills = {
    "Frontend": [
        { name: "JavaScript", level: 90, icon: "code" },
        { name: "React", level: 85, icon: "component" },
        { name: "HTML/CSS", level: 90, icon: "layout" },
        { name: "TypeScript", level: 80, icon: "file-code" }
    ],
    "Backend & Languages": [
        { name: "Node.js", level: 85, icon: "server" },
        { name: "Python", level: 80, icon: "terminal" },
        { name: "Java", level: 75, icon: "coffee" },
        { name: "C#", level: 70, icon: "hash" }
    ],
    "Cloud & AWS": [
        { name: "AWS Lambda", level: 90, icon: "zap" },
        { name: "API Gateway", level: 85, icon: "globe" },
        { name: "DynamoDB", level: 85, icon: "database" },
        { name: "CloudFormation", level: 80, icon: "layers" },
        { name: "S3", level: 90, icon: "hard-drive" },
        { name: "CloudFront", level: 85, icon: "cloud" }
    ],
    "Tools & Frameworks": [
        { name: "Git", level: 90, icon: "git-branch" },
        { name: "Docker", level: 75, icon: "box" },
        { name: "SAM", level: 85, icon: "settings" },
        { name: "WebSockets", level: 80, icon: "radio" }
    ]
};

// Education and Certifications
const education = {
    degree: "Bachelor of Engineering, Information Technology",
    institution: "University of Mumbai",
    year: "2011",
    location: "Mumbai, India"
};

const certifications = [
    {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        year: "2022",
        credentialId: "",
        verificationUrl: "",
        icon: "award",
        color: "#ff9900"
    }
];

const memberships = [
    {
        name: "AWS Community Builders",
        organization: "Amazon Web Services",
        year: "2025",
        description: "Selected member of the AWS Community Builders program, contributing to the AWS community through technical content and expertise sharing",
        icon: "users",
        color: "#ff9900"
    }
];

// Articles/Blog Posts
const articles = [
    {
        title: "Building a Multiplayer TriviaSnake Game with Amazon Q Developer",
        excerpt: "Learn how to build an innovative multiplayer game combining trivia and snake gameplay using Amazon Q Developer and AWS services.",
        url: "https://dev.to/aws-builders/building-a-multiplayer-triviasnake-game-with-amazon-q-developer-15j3",
        publishDate: "2024-12-15",
        readTime: "8 min read",
        tags: ["AWS", "Game Development", "Amazon Q Developer", "JavaScript"]
    },
    {
        title: "AWS Serverless Architecture with SAM - Part 1",
        excerpt: "A comprehensive guide to building serverless applications with AWS SAM, covering setup, deployment, and best practices.",
        url: "https://dev.to/aws-builders/aws-serverless-architecture-with-sam-part-1-3fj1",
        publishDate: "2024-11-20",
        readTime: "12 min read",
        tags: ["AWS", "Serverless", "SAM", "Lambda", "API Gateway"]
    },
    {
        title: "Rapid Learnings from Rapid Prototyping",
        excerpt: "Key insights and lessons learned from rapid prototyping experiences in software development.",
        url: "https://dev.to/aws-builders/rapid-learnings-from-rapid-prototyping-54pe",
        publishDate: "2024-10-10",
        readTime: "6 min read",
        tags: ["Prototyping", "Development", "Best Practices", "Learning"]
    },
    {
        title: "AWS Lambda Best Practices for Production",
        excerpt: "Essential best practices for deploying and managing AWS Lambda functions in production environments, covering performance, security, and monitoring.",
        url: "https://dev.to/karthiks3000",
        publishDate: "2024-09-15",
        readTime: "10 min read",
        tags: ["AWS", "Lambda", "Serverless", "Best Practices"]
    },
    {
        title: "Building Scalable APIs with Node.js and Express",
        excerpt: "A comprehensive guide to building robust and scalable REST APIs using Node.js, Express, and modern development practices.",
        url: "https://dev.to/karthiks3000",
        publishDate: "2024-08-20",
        readTime: "15 min read",
        tags: ["Node.js", "API", "Express", "Development"]
    },
    {
        title: "Game Development with HTML5 Canvas and JavaScript",
        excerpt: "Learn the fundamentals of game development using HTML5 Canvas and JavaScript, from basic animations to complex game mechanics.",
        url: "https://dev.to/karthiks3000",
        publishDate: "2024-07-10",
        readTime: "12 min read",
        tags: ["Game Development", "JavaScript", "HTML5", "Canvas"]
    }
];

// Fun Facts and Personality
const funFacts = [
    {
        icon: "coffee",
        title: "Coffee Enthusiast",
        description: "Powered by coffee and curiosity - always exploring new brewing methods"
    },
    {
        icon: "code",
        title: "Code Craftsman",
        description: "Believes in writing clean, maintainable code that tells a story"
    },
    {
        icon: "lightbulb",
        title: "Innovation Seeker",
        description: "Constantly exploring emerging technologies and their practical applications"
    },
    {
        icon: "users",
        title: "Team Builder",
        description: "Passionate about mentoring developers and building high-performing teams"
    },
    {
        icon: "gamepad-2",
        title: "Game Developer",
        description: "Created innovative multiplayer games combining trivia and classic gameplay"
    },
    {
        icon: "cloud",
        title: "Cloud Architect",
        description: "AWS Community Builder passionate about serverless and scalable solutions"
    }
];

// Personality Traits
const personalityTraits = [
    {
        icon: "brain",
        title: "Problem Solver",
        description: "Thrives on complex challenges and finding elegant solutions",
        color: "text-blue-600"
    },
    {
        icon: "heart",
        title: "Mentor",
        description: "Passionate about helping others grow and succeed in their careers",
        color: "text-red-500"
    },
    {
        icon: "zap",
        title: "Innovator",
        description: "Always looking for ways to improve processes and embrace new technologies",
        color: "text-yellow-500"
    },
    {
        icon: "target",
        title: "Goal-Oriented",
        description: "Focused on delivering results and exceeding expectations",
        color: "text-green-600"
    }
];

// Personal Interests and Hobbies
const personalInterests = [
    {
        category: "Technology",
        items: [
            "Exploring emerging cloud technologies",
            "Building side projects and prototypes",
            "Contributing to open source projects",
            "Writing technical articles and tutorials"
        ]
    },
    {
        category: "Learning",
        items: [
            "Staying updated with AWS services",
            "Learning new programming languages",
            "Reading tech blogs and documentation",
            "Attending virtual conferences and webinars"
        ]
    },
    {
        category: "Creative",
        items: [
            "Game development and interactive experiences",
            "UI/UX design and user experience",
            "Photography and visual storytelling",
            "Music and audio production"
        ]
    },
    {
        category: "Lifestyle",
        items: [
            "Coffee brewing and tasting",
            "Fitness and outdoor activities",
            "Travel and exploring new cultures",
            "Cooking and trying new cuisines"
        ]
    }
];

// Navigation Menu Items
const navigationItems = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Articles", href: "#articles" },
    { name: "Contact", href: "#contact" }
];