# Portfolio Website Specification - React SPA

## 1. Project Overview
- **Project Name**: Personal Portfolio SPA (React + Tailwind)
- **Type**: Single Page Application with React.js + Tailwind CSS
- **Core Functionality**: Professional portfolio with tri-language support (Chinese/English/Russian), dynamic cursor-following glow effect, smooth navigation, and dark-themed design inspired by S0umyajit | Portfolio.
- **Target Users**: Potential employers, clients, and collaborators

---

## 2. Visual & Rendering Specification

### Scene Setup
- **Background**: Deep black (#0a0a0a)
- **Layout**: Full-page sections with smooth scroll navigation
- **Cursor Effect**: Dynamic glowing orb following mouse movement with blur trail

### Color Palette
- **Primary**: Cyan (#00f5ff)
- **Secondary**: Purple (#bf00ff)
- **Accent**: White (#ffffff)
- **Background**: Black (#0a0a0a)
- **Text Primary**: White (#ffffff)
- **Text Secondary**: Gray (#9ca3af)

### Typography
- **Font Family**: 'Poppins' from Google Fonts (weights: 300, 400, 500, 600, 700)
- **Fallback**: sans-serif

### Icons
- **Library**: Font Awesome 6 CDN

---

## 3. Component Specification

### 3.1 Navbar
- Fixed top, glass-morphism effect
- Logo on left
- Nav links: Home, About, Skills, Projects, Contact
- Language switcher (dropdown): 中文 | EN | RU
- Mobile hamburger menu

### 3.2 Header/Hero
- Full viewport height
- Animated text intro
- Name, Title, Brief intro
- CTA Buttons: "Download Resume" | "Contact Me"
- Background: animated grid + floating particles

### 3.3 About
- Profile avatar (stylized)
- Personal background (lorem ipsum per language)
- Stats: Years experience, Projects, Awards

### 3.4 Skills
- Animated skill bars
- Categories with icons: Frontend, Backend, Database, DevOps
- Tech tags

### 3.5 Projects
- Card grid (3 cols desktop, 1 mobile)
- Project image (gradient placeholder)
- Name, description (lorem ipsum), tech stack tags
- Links: Live Demo, GitHub

### 3.6 Contact
- Contact form (Name, Email, Message)
- Social links: GitHub, LinkedIn, Email

### 3.7 Cursor Glow
- Canvas-based glowing orb
- Follows mouse with lerp interpolation
- Cyan-to-purple gradient
- ~200px diameter, ~100px blur

---

## 4. i18n Specification

### Languages
1. **zh-CN** (Default)
2. **en-US**
3. **ru-RU**

### Lorem Ipsum Strategy
- Chinese: 中文占位文本
- English: Standard Lorem Ipsum
- Russian: Russian Lorem Ipsum

---

## 5. Technical Stack

### CDN Dependencies
- React 18.x
- ReactDOM 18.x
- Tailwind CSS Play CDN
- Poppins (Google Fonts)
- Font Awesome 6.x

### Project Structure
```
/portfolio
  index.html
  src/
    index.js
    App.jsx
    components/
      Navbar.jsx
      Header.jsx
      About.jsx
      Skills.jsx
      Projects.jsx
      Contact.jsx
      Footer.jsx
      CursorGlow.jsx
    i18n/
      translations.js
    styles/
      index.css
  tailwind.config.js
```

---

## 6. Acceptance Criteria

1. Dark theme with Poppins font loads
2. Cursor-following glow effect visible
3. All 6 sections render with content
4. Language switcher changes all text instantly
5. Smooth scroll navigation works
6. Buttons have hover glow effects with box-shadow
7. Project cards display with tech tags
8. Contact form has inputs
9. Mobile-responsive layout
10. No console errors