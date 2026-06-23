const { useState, useEffect, useRef, createContext, useContext } = React;

// ==================== i18n Context ====================
const I18nContext = createContext();
const useI18n = () => useContext(I18nContext);

const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('portfolio-lang') || 'zh-CN');
  useEffect(() => { localStorage.setItem('portfolio-lang', lang); }, [lang]);
  return <I18nContext.Provider value={{ lang, setLang }}>{children}</I18nContext.Provider>;
};

// ==================== Cursor Glow Effect ====================
const CursorGlow = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      glowRef.current.x += (mouseRef.current.x - glowRef.current.x) * 0.1;
      glowRef.current.y += (mouseRef.current.y - glowRef.current.y) * 0.1;
      const gradient = ctx.createRadialGradient(glowRef.current.x, glowRef.current.y, 0, glowRef.current.x, glowRef.current.y, 250);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.15)');
      gradient.addColorStop(0.5, 'rgba(191, 0, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    const handleMouseMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: 'screen' }} />;
};

// ==================== Language Switcher ====================
const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const languages = window.__PORTFOLIO_I18N__.languages;
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/10 transition-all">
        <span>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 rounded-lg glass min-w-[140px] z-50">
          {languages.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-all flex items-center gap-2 ${lang === l.code ? 'text-primary' : 'text-gray-300'}`}>
              <span>{l.flag}</span><span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== Navbar ====================
const Navbar = ({ t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#skills', label: t.nav.skills },
    { href: '#projects', label: t.nav.projects },
    { href: '#contact', label: t.nav.contact }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-cyan-500/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
        <a href="#home" className="text-xl font-bold gradient-text">LM.Portfolio</a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (<a key={link.href} href={link.href} className="nav-link text-sm font-medium">{link.label}</a>))}
          <LanguageSwitcher />
        </div>
        <button className="md:hidden text-gray-300 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-cyan-500/20">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (<a key={link.href} href={link.href} className="nav-link text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>{link.label}</a>))}
            <div className="pt-4 border-t border-white/10"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </nav>
  );
};

// ==================== Header / Hero ====================
const Header = ({ t }) => (
  <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 hero-grid opacity-50"></div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="particle absolute w-2 h-2 bg-primary rounded-full opacity-40"
        style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i * 0.5}s` }} />
    ))}
    <div className="relative z-10 text-center px-6 max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>{t.hero.name}</h1>
      <h2 className="text-2xl md:text-3xl font-light text-primary mb-6 fade-in-up" style={{ animationDelay: '0.4s' }}>{t.hero.title}</h2>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 fade-in-up" style={{ animationDelay: '0.6s' }}>{t.hero.intro}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up" style={{ animationDelay: '0.8s' }}>
        <a href="#contact" className="btn-primary px-8 py-3 rounded-full font-semibold text-black"><i className="fas fa-download mr-2"></i>{t.hero.downloadResume}</a>
        <a href="#contact" className="btn-secondary px-8 py-3 rounded-full font-semibold"><i className="fas fa-paper-plane mr-2"></i>{t.hero.contactMe}</a>
      </div>
      <div className="flex justify-center gap-6 mt-12 fade-in-up" style={{ animationDelay: '1s' }}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:glow-cyan transition-all"><i className="fab fa-github text-xl"></i></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:glow-cyan transition-all"><i className="fab fa-linkedin-in text-xl"></i></a>
        <a href="mailto:liming@example.com" className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:glow-cyan transition-all"><i className="fas fa-envelope text-xl"></i></a>
      </div>
    </div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <a href="#about" className="text-primary/60 hover:text-primary transition-colors"><i className="fas fa-chevron-down text-2xl"></i></a>
    </div>
  </section>
);

// ==================== About Section ====================
const About = ({ t }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.about.title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary to-secondary p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center"><span className="text-6xl">👨‍💻</span></div>
              </div>
              <div className="absolute -inset-4 border-2 border-primary/30 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">{t.about.description1}</p>
            <p className="text-gray-300 leading-relaxed">{t.about.description2}</p>
            <p className="text-gray-300 leading-relaxed">{t.about.description3}</p>
            <div className="flex justify-start gap-12 pt-6">
              <div className="text-center"><div className="text-4xl font-bold gradient-text">5+</div><div className="text-gray-500 text-sm mt-1">{t.about.stats.years}</div></div>
              <div className="text-center"><div className="text-4xl font-bold gradient-text">30+</div><div className="text-gray-500 text-sm mt-1">{t.about.stats.projects}</div></div>
              <div className="text-center"><div className="text-4xl font-bold gradient-text">10+</div><div className="text-gray-500 text-sm mt-1">{t.about.stats.awards}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== Skills Section ====================
const Skills = ({ t }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skills, setSkills] = useState({ frontend: 0, backend: 0, database: 0, devops: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); setSkills({ frontend: 90, backend: 85, database: 80, devops: 75 }); } }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    { key: 'frontend', icon: 'fa-brands fa-react', name: t.skills.frontend, tags: t.skills.frontendTags, color: 'from-cyan-400 to-blue-500' },
    { key: 'backend', icon: 'fa-solid fa-server', name: t.skills.backend, tags: t.skills.backendTags, color: 'from-green-400 to-emerald-500' },
    { key: 'database', icon: 'fa-solid fa-database', name: t.skills.database, tags: t.skills.databaseTags, color: 'from-purple-400 to-pink-500' },
    { key: 'devops', icon: 'fa-solid fa-cloud', name: t.skills.devops, tags: t.skills.devopsTags, color: 'from-orange-400 to-red-500' }
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6 bg-gradient-to-b from-dark to-dark/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.skills.title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((skill, index) => (
            <div key={skill.key} className={`glass rounded-2xl p-6 card-hover transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center`}><i className={`${skill.icon} text-white text-xl`}></i></div>
                <h3 className="text-xl font-semibold">{skill.name}</h3>
              </div>
              <div className="skill-bar mb-4"><div className="skill-progress" style={{ width: isVisible ? `${skills[skill.key]}%` : '0%' }}></div></div>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map(tag => (<span key={tag} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-primary/20 text-gray-400 hover:text-primary hover:border-primary/50 transition-colors">{tag}</span>))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Projects Section ====================
const Projects = ({ t }) => {
  const projects = t.projects.items;
  const projectIcons = ['fa-cart-shopping', 'fa-chart-line', 'fa-robot'];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.projects.title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="glass rounded-2xl overflow-hidden card-hover group">
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-dark to-gray-900">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-4 left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <i className={`fa-solid ${projectIcons[index]} text-3xl text-primary`}></i>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (<span key={tag} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/30">{tag}</span>))}
                </div>
                <div className="flex gap-4">
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1"><i className="fas fa-external-link-alt text-xs"></i><span>Demo</span></a>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1"><i className="fab fa-github text-xs"></i><span>Code</span></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Contact Section ====================
const Contact = ({ t }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => { setFormData({ name: '', email: '', message: '' }); setSubmitted(false); }, 3000); };

  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-b from-dark/50 to-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.contact.formName}</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t.contact.formPlaceholder.name} className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-gray-700 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.contact.formEmail}</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={t.contact.formPlaceholder.email} className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-gray-700 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.contact.formMessage}</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder={t.contact.formPlaceholder.message} className="w-full px-4 py-3 rounded-lg bg-dark/50 border border-gray-700 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full py-3 rounded-lg font-semibold text-black">
                {submitted ? <><i className="fas fa-check mr-2"></i>{t.contact.formSuccess}</> : <><i className="fas fa-paper-plane mr-2"></i>{t.contact.formSubmit}</>}
              </button>
            </form>
          </div>
          <div className="flex flex-col justify-center items-center text-center space-y-8">
            <p className="text-gray-400 text-lg">{t.contact.subtitle}</p>
            <div className="flex flex-col gap-4">
              <a href="mailto:liming@example.com" className="flex items-center gap-4 px-6 py-4 glass rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:glow-cyan transition-all"><i className="fas fa-envelope text-primary text-xl"></i></div>
                <div className="text-left"><div className="text-sm text-gray-500">{t.contact.social.email}</div><div className="text-white">liming@example.com</div></div>
              </a>
              <a href="https://github.com" className="flex items-center gap-4 px-6 py-4 glass rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:glow-cyan transition-all"><i className="fab fa-github text-primary text-xl"></i></div>
                <div className="text-left"><div className="text-sm text-gray-500">{t.contact.social.github}</div><div className="text-white">github.com/liming</div></div>
              </a>
              <a href="https://linkedin.com" className="flex items-center gap-4 px-6 py-4 glass rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:glow-cyan transition-all"><i className="fab fa-linkedin-in text-primary text-xl"></i></div>
                <div className="text-left"><div className="text-sm text-gray-500">{t.contact.social.linkedin}</div><div className="text-white">linkedin.com/in/liming</div></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== Footer ====================
const Footer = ({ t }) => (
  <footer className="py-8 px-6 border-t border-gray-800">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-gray-500 text-sm">© 2024 {t.footer.copyright}</div>
      <div className="text-gray-500 text-sm flex items-center gap-2"><span>{t.footer.madeWith}</span><span className="text-red-500">♥</span><span>Li Ming</span></div>
      <div className="flex gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors"><i className="fab fa-github text-lg"></i></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors"><i className="fab fa-linkedin-in text-lg"></i></a>
        <a href="mailto:liming@example.com" className="text-gray-500 hover:text-primary transition-colors"><i className="fas fa-envelope text-lg"></i></a>
      </div>
    </div>
  </footer>
);

// ==================== Main App ====================
const App = () => {
  const { lang } = useI18n();
  const { translations, languages } = window.__PORTFOLIO_I18N__;
  const t = translations[lang] || translations['zh-CN'];

  return (
    <div className="relative min-h-screen bg-dark">
      <CursorGlow />
      <Navbar t={t} />
      <main>
        <Header t={t} />
        <About t={t} />
        <Skills t={t} />
        <Projects t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
};

// ==================== Initialize ====================
const Root = () => (
  <I18nProvider>
    <App />
  </I18nProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);