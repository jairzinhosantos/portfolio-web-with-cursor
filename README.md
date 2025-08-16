# Personal Portfolio

Personal portfolio built with Angular 19 that showcases professional information, projects, publications, and multimedia content.

## Features

- Angular 19 with Server-Side Rendering
- Responsive design
- External API integration (GitHub, YouTube, Medium)
- Interactive carousels
- Theme management
- Environment variables
- Fallback system
- SEO optimized

## Prerequisites

- Node.js 20.x LTS
- npm
- API keys for external services (optional)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/jairzinhosantos/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment files and personal data

#### Configure environment variables:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Edit the files with your credentials:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

#### Configure personal data:
```bash
cp src/assets/data/personal-info.example.json src/assets/data/personal-info.json
cp src/assets/data/social-urls.example.json src/assets/data/social-urls.json
```

Edit the JSON files with your information:
- `src/assets/data/personal-info.json`
- `src/assets/data/social-urls.json`

### 4. Add personal files
- Profile photo: `src/assets/branding/profile.png`
- CV in PDF: `src/assets/resume/resume_yourname-en.pdf`

### 5. Run in development
```bash
npm start
```

Available at `http://localhost:4200`

## Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm run build:ssr  # Build with SSR
npm test           # Unit tests
npm run e2e        # End-to-end tests
npm run analyze    # Bundle analysis
```

## Environment Variables

### YouTube API
- API Key: Get one from Google Cloud Console
- Channel ID: Your YouTube channel ID
- Channel Handle: Your channel handle

### GitHub API
- Username: Your GitHub username
- Token (optional): Personal access token

### Medium RSS
- Username: Your Medium username
- RSS API URL: Service to convert RSS to JSON

## Project Structure

```
src/
├── app/
│   ├── services/          # Services for external APIs
│   │   ├── github.service.ts    # GitHub service
│   │   ├── medium.service.ts    # Medium service
│   │   └── youtube.service.ts   # YouTube service
│   ├── app.component.ts   # Main component
│   ├── app.component.html # Main template
│   └── app.component.scss # Main styles
├── assets/               # Static resources
│   ├── branding/        # Logos and personal branding
│   ├── icons/           # Technology icons
│   ├── projects/        # Project images
│   └── publications/    # Publication images
├── environments/        # Environment configuration
└── styles.scss         # Global styles
```

## Technical Features

### Interactive Carousels
- Touch and mouse support
- Responsive
- CSS animations

### Theme Management
- Light, dark and automatic themes
- localStorage persistence
- Smooth transitions

### Performance
- Lazy loading
- Server-Side Rendering
- Bundle optimization

### Error Handling
- Fallback system
- Robust error handling
- Loading states

## Integrated APIs

### GitHub API
- Endpoint: `https://api.github.com/users/{username}/repos`
- Gets public repositories
- Fallback: Empty array

### YouTube Data API v3
- Endpoint: `https://www.googleapis.com/youtube/v3/`
- Gets channel videos
- Fallback: Not available state

### Medium RSS
- Endpoint: RSS converted to JSON
- Gets latest articles
- Fallback: Static articles

## Deployment

### Production build
```bash
npm run build
```

Files are generated in `dist/portfolio/`

### Production environment variables
Configure variables in your hosting platform:
- Vercel: Environment Variables
- Netlify: Site settings > Environment variables

### SSR
```bash
npm run build:ssr
npm run serve:ssr
```

## Security

### Credential Protection
- Environment variables separated from code
- Real files excluded from repository
- Example files as templates
- Tokens with minimal permissions

### Personal Data Protection
- Personal information in separate files
- CV and photos excluded from version control

### Protected Files
```
src/environments/environment.ts
src/environments/environment.prod.ts
src/assets/data/personal-info.json
src/assets/data/social-urls.json
src/assets/resume/*.pdf
src/assets/branding/profile.png
```

### Initial Configuration
1. Copy `.example` files and remove suffix
2. Edit with your real information
3. Add profile photo and CV
4. Never upload these files to repository

### Data Validation
- Automatic API sanitization
- URL and HTML validation
- Secure error handling