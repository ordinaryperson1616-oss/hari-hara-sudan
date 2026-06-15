/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, FormEvent } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Mail, 
  Code2, 
  Database, 
  Cpu, 
  Hourglass, 
  Flame, 
  CheckCircle2, 
  Send, 
  X, 
  ChevronRight, 
  Sparkles, 
  Workflow, 
  ArrowUpRight,
  Maximize2,
  Terminal,
  Server,
  Layers,
  AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  tags: string[];
  gradient: string;
  category: 'IoT' | 'Web App' | 'Frontend';
  features: string[];
  architecture: {
    frontend?: string;
    backend?: string;
    hardware?: string;
    database?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

export default function App() {
  // Navigation & Interactive states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'projects'>('home');
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Static Local Data for SUDAN
  const skills = [
    { name: 'Python', category: 'Backend' },
    { name: 'Django', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'JavaScript', category: 'Language' },
    { name: 'Tailwind CSS', category: 'Style' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'ESP32 IoT', category: 'Hardware' },
    { name: 'Automation', category: 'Backend' }
  ];

  const projects: Project[] = [
    {
      id: 'platedetect-ai',
      title: 'PlateDetect AI',
      shortDesc: 'ESP32-based Number Plate Detection System.',
      longDesc: 'A hardware-software co-designed pipeline that leverages lightweight microcontrollers for edge capture and a high-throughput Django ML server to perform automatic plate recognition. High-contrast optical characters are processed in sub-60ms intervals using optimized OCR grids and convolutional neural weights, triggering relay controls on success.',
      category: 'IoT',
      tags: ['ESP32 IoT', 'Python', 'REST APIs', 'Automation'],
      gradient: 'from-blue-500/20 to-transparent',
      features: [
        'Hardware-accelerated live image capture using an ESP32-CAM module.',
        'Real-time streaming integration with a Django middleware server via secure endpoints.',
        'Intelligent vehicle number plate alignment using custom OpenCV filters.',
        'Physical GPIO pin toggle interface for automatic boom barriers.'
      ],
      architecture: {
        frontend: 'Tailwind CSS Live Feed Console',
        backend: 'Django API Pipeline + OpenCV Core',
        hardware: 'ESP32cam + OV2640 Module + GPIO Relays',
        database: 'MongoDB Local Ledger'
      },
      metrics: [
        { label: 'OCR Process Speed', value: '58ms' },
        { label: 'Recognition Accuracy', value: '98.4%' },
        { label: 'Edge Frame Rate', value: '18 FPS' }
      ]
    },
    {
      id: 'saas-dashboard',
      title: 'SaaS Dashboard',
      shortDesc: 'Full-stack Python & Django CRM platform.',
      longDesc: 'A complex, multi-tenant customer relationship manager engineered to parse millions of daily transactional records. Employs optimized query planners alongside robust caching rules to display operational runtimes, client telemetry metrics, and financial insights without sacrificing performance.',
      category: 'Web App',
      tags: ['Python', 'Django', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
      gradient: 'from-purple-500/20 to-transparent',
      features: [
        'Multi-tenant account separation with dynamic subdomain resolution.',
        'Responsive interactive charts using SVG-mapped rendering frameworks.',
        'Advanced background reporting services driven by batch tasks.',
        'Comprehensive activity ledger tracking employee transactions.'
      ],
      architecture: {
        frontend: 'Vanilla JavaScript + Tailwind Component Primitives',
        backend: 'Python 3.11 + Django Framework Router',
        database: 'MongoDB Replica Set',
        hardware: 'Cloud-native Linux Container'
      },
      metrics: [
        { label: 'Payload Response', value: '14ms' },
        { label: 'Concurrency Max', value: '10k Peak/s' },
        { label: 'Uptime SLA', value: '99.98%' }
      ]
    },
    {
      id: 'portfolio-2026',
      title: 'Portfolio 2026',
      shortDesc: 'Advanced GSAP animated showcase site.',
      longDesc: 'A custom portfolio layout exploring high-fidelity client interactions, dark environment depth, and layout performance. Uses custom spring constants and backdrop filter blending layers to represent mathematical elegance on the web.',
      category: 'Frontend',
      tags: ['JavaScript', 'Tailwind CSS'],
      gradient: 'from-pink-500/20 to-transparent',
      features: [
        'Responsive subgrid canvas with active glass material nodes.',
        'Dynamic viewport monitoring preventing layout shifting.',
        'Lightweight transition triggers and keyframe springs.',
        'Optimized system theme matching.'
      ],
      architecture: {
        frontend: 'React 19 + Tailwind CSS Alpha v4',
        backend: 'SPA Client Engine',
        database: 'LocalState Storage'
      },
      metrics: [
        { label: 'First Contentful Paint', value: '0.2s' },
        { label: 'Lighthouse Performance', value: '100/100' },
        { label: 'Asset Payload Size', value: '24KB Gzipped' }
      ]
    }
  ];

  // Dynamic Filtering logic
  const filteredProjects = useMemo(() => {
    if (!selectedSkill) return projects;
    return projects.filter(p => p.tags.includes(selectedSkill));
  }, [selectedSkill]);

  // Statistics Walkthrough Data
  const stats = [
    { 
      value: '12+', 
      label: 'Projects', 
      detail: 'Completed multi-tenant SaaS dashboards, edge computer vision projects, and custom embedded firmware nodes.' 
    },
    { 
      value: '400+', 
      label: 'Coding Hours', 
      detail: 'Productive hours logged shipping client features, optimizing database indexes, and tuning camera sensors.' 
    },
    { 
      value: '100%', 
      label: 'Commitment', 
      detail: 'Applying solid DRY principles, comprehensive documentation, and performance benchmarks to every code block.' 
    }
  ];

  // Contact form submission mock
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setFormError('Please fill out all required fields.');
      return;
    }
    
    // Simulate API Submission
    setIsSubmitting(true);
    setFormError('');
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
      // Reset form fields
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ordinaryperson1616@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen md:h-screen w-full box-border text-[#E5E7EB] bg-[#050505] font-sans antialiased relative overflow-x-hidden md:overflow-hidden select-none">
      
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute right-0 top-0 w-[45rem] h-[45rem] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -left-20 bottom-10 w-[35rem] h-[35rem] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-7xl h-full p-4 md:p-8 flex flex-col gap-6 relative z-10 box-border">
        
        {/* HEADER */}
        <header id="portfolio-header" className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => setSelectedSkill(null)}>
            <span className="text-blue-500 font-extrabold hover:text-blue-400 transition-colors">G</span>
            <span className="text-white"> HARI HARA </span>
            <span className="text-purple-500 font-extrabold hover:text-purple-400 transition-colors">SUDAN</span>
          </div>

          {/* Navigation Links (Interactive filters) */}
          <nav className="flex gap-6 md:gap-8 text-xs uppercase tracking-widest font-medium opacity-60">
            <button 
              id="nav-home"
              onClick={() => {
                setSelectedSkill(null);
                setActiveTab('home');
              }} 
              className={`hover:opacity-100 transition-opacity cursor-pointer py-1 border-b ${!selectedSkill && activeTab === 'home' ? 'border-blue-500 opacity-100 text-blue-400 font-semibold' : 'border-transparent'}`}
            >
              All Projects
            </button>
            <button 
              id="nav-about"
              onClick={() => {
                setSelectedSkill('ESP32 IoT');
                setActiveTab('about');
              }}
              className={`hover:opacity-100 transition-opacity cursor-pointer py-1 border-b ${selectedSkill === 'ESP32 IoT' ? 'border-purple-500 opacity-100 text-purple-400 font-semibold' : 'border-transparent'}`}
            >
              IoT & Embedded
            </button>
            <button 
              id="nav-projects"
              onClick={() => {
                setSelectedSkill('Django');
                setActiveTab('projects');
              }}
              className={`hover:opacity-100 transition-opacity cursor-pointer py-1 border-b ${selectedSkill === 'Django' ? 'border-pink-500 opacity-100 text-pink-400 font-semibold' : 'border-transparent'}`}
            >
              Django Core
            </button>
          </nav>

          {/* Available status pill */}
          <div 
            id="status-badge"
            onClick={() => setIsContactOpen(true)}
            className="glass px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer border border-white/10 group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-emerald-400 transition-colors">Available For Hire</span>
          </div>
        </header>

        {/* MAIN BODY GRID */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow min-h-0">
          
          {/* LEFT PANEL (Columns 1-8): Resume Hero & Core Knowledge */}
          <div className="col-span-1 md:col-span-8 flex flex-col gap-6 min-h-0">
            
            {/* Hero Glass Box */}
            <section id="hero-section" className="glass rounded-[24px] p-6 md:p-10 flex-grow flex flex-col justify-center relative overflow-hidden glow-blue min-h-[300px]">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold block">Full Stack Developer</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4 select-none">
                    G HARI HARA<br/>
                    <span className="gradient-text font-black">SUDAN</span>
                  </h1>
                  
                  <p className="max-w-xl opacity-60 text-xs sm:text-sm leading-relaxed mb-6">
                    Crafting high-performance web systems with Python, Django, and modern frontend technologies. Focused on scalable multi-tenant architecture, robust database plans, and seamless edge device telemetry.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  <button 
                    id="cta-projects"
                    onClick={() => {
                      setSelectedSkill(null);
                      const el = document.getElementById('featured-section-title');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  >
                    View Projects
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
                  </button>
                  <button 
                    id="cta-contact"
                    onClick={() => setIsContactOpen(true)}
                    className="border border-white/20 bg-white/5 backdrop-blur px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  >
                    Contact Me
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Internal abstract decoration */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-blue-600/10 to-transparent pointer-events-none"></div>
            </section>

            {/* Bottom Section: Skills Inventory & Live Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Skill Matrix Box */}
              <section id="skills-section" className="glass rounded-[24px] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs uppercase tracking-widest opacity-50 font-bold">Core Expertise</h3>
                    {selectedSkill && (
                      <button 
                        onClick={() => setSelectedSkill(null)}
                        className="text-[10px] text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Clear Filter <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] opacity-40 mb-4 leading-normal">
                    Click a skill badge to filter projects that implement that particular technology directly.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const isSelected = selectedSkill === skill.name;
                    return (
                      <button
                        key={skill.name}
                        onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
                        className={`skill-badge px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-sm scale-105 font-bold' 
                            : 'text-neutral-300 hover:text-white border-white/5 bg-white/5'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Statistics Grid */}
              <section id="stats-section" className="glass rounded-[24px] p-6 flex justify-between items-center relative overflow-hidden">
                {stats.map((stat, i) => (
                  <div 
                    key={stat.label}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                    className="flex-1 text-center flex flex-col justify-center h-full cursor-pointer relative group transition-all"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-200">
                      {stat.value}
                    </div>
                    <div className="text-[10px] uppercase opacity-40 tracking-wider group-hover:text-blue-400 transition-colors duration-200">
                      {stat.label}
                    </div>

                    {/* Rich Stat Detail Popover */}
                    <div className={`absolute left-1/2 -translate-x-1/2 -top-24 w-44 p-3 rounded-xl bg-black/95 border border-white/10 text-left text-[11px] leading-relaxed transition-all duration-300 pointer-events-none shadow-2xl z-20 ${
                      hoveredStat === i ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                    }`}>
                      <div className="font-semibold text-blue-400 mb-1">{stat.label} Info</div>
                      <span className="text-gray-400 leading-normal">{stat.detail}</span>
                      <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black border-r border-b border-white/10 rotate-45"></div>
                    </div>

                    {/* Divider line */}
                    {i < stats.length - 1 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-white/10"></div>
                    )}
                  </div>
                ))}
              </section>

            </div>

          </div>

          {/* RIGHT PANEL (Columns 9-12): Featured Projects list */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6 min-h-0">
            
            <section id="featured-projects" className="glass rounded-[24px] p-6 flex-grow flex flex-col min-h-0">
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <h3 id="featured-section-title" className="text-xs uppercase tracking-widest opacity-50 font-bold">
                    Featured Projects
                  </h3>
                  {selectedSkill && (
                    <span className="text-[10px] text-blue-400">
                      Filtered by: {selectedSkill} ({filteredProjects.length})
                    </span>
                  )}
                </div>
                <Layers className="w-4 h-4 text-neutral-400 opacity-60" />
              </div>

              {/* Dynamic Scrollable Card Area */}
              <div className="space-y-4 overflow-y-auto flex-grow max-h-[420px] md:max-h-none pr-1">
                {filteredProjects.length === 0 ? (
                  <div className="h-44 flex flex-col justify-center items-center text-center opacity-40">
                    <AlertCircle className="w-8 h-8 mb-2 stroke-1" />
                    <span className="text-xs">No projects found with skill "{selectedSkill}"</span>
                    <button 
                      onClick={() => setSelectedSkill(null)}
                      className="mt-2 text-xs text-blue-400 underline cursor-pointer"
                    >
                      Show all projects
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="w-full h-18 bg-white/5 rounded-lg border border-white/5 mb-3 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                        {/* Custom visual backgrounds replicating gradient designs */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${project.gradient} transition-opacity duration-300 opacity-80 group-hover:opacity-100`}></div>
                        
                        {/* Static visual representation wireframe */}
                        <div className="absolute inset-x-2 bottom-2 flex justify-between items-center text-[9px] font-mono opacity-30 group-hover:opacity-60 transition-opacity">
                          <span>SYSTEM_CORE_{project.id.toUpperCase()}</span>
                          <span className="text-[8px]">0x7F // OK</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-semibold tracking-tight text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            {project.title}
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-0.5 group-hover:translate-y-0" />
                          </h4>
                          <p className="text-[11px] opacity-40 tracking-tight mt-1">
                            {project.shortDesc}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono bg-white/5 text-gray-400 border border-white/5 px-1.5 py-0.5 rounded text-end truncate max-w-20">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button 
                id="cta-social-trigger"
                onClick={() => setIsContactOpen(true)}
                className="mt-4 w-full py-3 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/5 hover:border-white/25 active:scale-[0.99] transition-all cursor-pointer text-center text-white"
              >
                Start A Project Discussion
              </button>
            </section>

          </div>

        </main>

        {/* FOOTER */}
        <footer id="portfolio-footer" className="flex flex-col sm:flex-row justify-between items-center px-6 py-3.5 glass rounded-full border border-white/5 gap-3">
          {/* Social Links */}
          <div className="flex gap-6 items-center">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer text-white"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer text-white"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer text-white"
            >
              <Twitter className="w-3.5 h-3.5" />
              Twitter
            </a>
          </div>

          <div className="text-[10px] text-center sm:text-right font-mono opacity-25 uppercase tracking-wider">
            G HARI HARA SUDAN // DESIGN PORTFOLIO // v2.0
          </div>
        </footer>

      </div>

      {/* DETAILED PROJECT MODAL (Overlay) */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass max-w-2xl w-full rounded-2xl overflow-hidden glow-purple max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className={`p-6 border-b border-white/5 bg-gradient-to-r ${selectedProject.gradient} flex justify-between items-center`}>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/20">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight">
                  {selectedProject.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1.5">Overview</h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {selectedProject.longDesc}
                </p>
              </div>

              {/* Multi-Metrics */}
              {selectedProject.metrics && (
                <div className="grid grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  {selectedProject.metrics.map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-xs text-neutral-400 font-medium mb-0.5">{m.label}</div>
                      <div className="text-lg font-mono font-bold text-blue-400">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded Tech stack specifications & architecture */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">System Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedProject.architecture.hardware && (
                    <div className="flex gap-2.5 items-start p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
                      <Cpu className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-200">Hardware Layer</div>
                        <div className="text-neutral-400 font-mono text-[11px] mt-0.5">{selectedProject.architecture.hardware}</div>
                      </div>
                    </div>
                  )}
                  {selectedProject.architecture.backend && (
                    <div className="flex gap-2.5 items-start p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
                      <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-200">Processing Core</div>
                        <div className="text-neutral-400 font-mono text-[11px] mt-0.5">{selectedProject.architecture.backend}</div>
                      </div>
                    </div>
                  )}
                  {selectedProject.architecture.frontend && (
                    <div className="flex gap-2.5 items-start p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
                      <Code2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-200">Presentation Tier</div>
                        <div className="text-neutral-400 font-mono text-[11px] mt-0.5">{selectedProject.architecture.frontend}</div>
                      </div>
                    </div>
                  )}
                  {selectedProject.architecture.database && (
                    <div className="flex gap-2.5 items-start p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
                      <Database className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-200">Storage Plane</div>
                        <div className="text-neutral-400 font-mono text-[11px] mt-0.5">{selectedProject.architecture.database}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Core Features list */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Key Accomplishments</h4>
                <div className="space-y-2">
                  {selectedProject.features.map((feat, index) => (
                    <div key={index} className="flex gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-neutral-950/40 flex justify-between items-center sm:gap-4 flex-wrap">
              <div className="flex gap-1.5 flex-wrap">
                {selectedProject.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono font-medium px-2 py-1 bg-white/5 rounded text-neutral-400">
                    #{t}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => {
                  setSelectedProject(null);
                  setIsContactOpen(true);
                }}
                className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-bold rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 mt-2 sm:mt-0"
              >
                Inquire Project Details
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONTACT DRAWER MODAL (Overlay) */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-end">
          <div className="glass w-full max-w-md h-full rounded-l-3xl border-l border-white/10 p-6 md:p-8 flex flex-col relative z-25 overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Let's Connect</h3>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Have a system optimization, full stack software, or IoT pipeline to coordinate?
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsContactOpen(false);
                  setFormSuccess(false);
                  setFormError('');
                }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact direct email & copy action */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">Email Address:</span>
                <span className="text-neutral-300 font-bold font-mono">ordinaryperson1616@gmail.com</span>
              </div>
              <button 
                onClick={handleCopyEmail}
                className="w-full py-1.5 rounded-lg text-xs font-mono font-medium border border-white/10 hover:bg-white/5 hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-neutral-200"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    Copy Email Address
                  </>
                )}
              </button>
            </div>

            {/* Success screen or actual message form */}
            {formSuccess ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Transmission Successful</h4>
                <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                  Sudan has locked in your contact payload. Secure channel transmission logged. A brief overview session summary will be dispatched to your email endpoint shortly.
                </p>
                <div className="p-3 bg-neutral-900 rounded-lg text-[10px] font-mono text-neutral-400 uppercase tracking-widest border border-white/5">
                  ID: S-{Math.floor(Math.random() * 90000) + 10000} // SUCCESS
                </div>
                <button 
                  onClick={() => setFormSuccess(false)}
                  className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold uppercase cursor-pointer transition-colors text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {formError && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5">
                      Your Name <span className="text-blue-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400/30 font-mono transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5">
                      Your Email Address <span className="text-blue-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400/30 font-mono transition-all"
                    />
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="E.g. MQTT IoT Deployment, SaaS Scaling..."
                      className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400/30 font-mono transition-all"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5">
                      Message Payload <span className="text-blue-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your system details or questions here..."
                      className="w-full bg-white/[0.01] border border-white/10 hover:border-white/20 focus:border-blue-400 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400/30 font-mono resize-none transition-all-slow leading-relaxed"
                    />
                  </div>

                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-500 font-bold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono group"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                    <Send className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  <p className="text-[9px] text-center opacity-30 mt-3 font-mono">
                    SECURITY COMPLIANT // RSA_SECURE_PAYLOAD_2026
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
