import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";

const aboutLinks = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contáctanos', href: '/contacto' },
];

const companyLinks = [
  { label: 'Políticas', href: '/politicas' },
  { label: 'Términos', href: '/terminos' },
  { label: 'Libro de reclamaciones', href: '/reclamaciones' },
  { label: 'Forma parte de la comunidad', href: '/comunidad' },
];

export const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const socialLinks = (
    <>
      <a
        href="https://www.tiktok.com/@maxeta.pe"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full border border-white/20 bg-black px-4 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:bg-red-600"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 3v10a4 4 0 1 0 4-4V5a6 6 0 1 1-4 1z" fill="white"/>
        </svg>
        TikTok
      </a>

      <a
        href="https://www.instagram.com/maxeta.pe/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full border border-white/20 bg-[#e1306c] px-4 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:bg-red-600"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.2"/>
          <path d="M16 8h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="white" strokeWidth="1.2"/>
        </svg>
        Instagram
      </a>

      <a
        href="https://www.facebook.com/maxeta.peru"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full border border-white/20 bg-[#405de6] px-4 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:bg-red-600"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" fill="white"/>
        </svg>
        Facebook
      </a>

    </>
  );

  return (
    <footer className="border-t border-zinc-200 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr]">

          {/* Logo */}
          <div className="text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              MAXETA
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Diseño moderno, piezas claras y estilo para todos los días.
            </h2>

            <p className="mt-3 text-sm text-white/70">
              Una propuesta urbana, accesible y versátil que combina comodidad, identidad y actitud.
            </p>

            <div className="mt-6 flex justify-center lg:block">
              <img
                src="/logo.webp"
                alt="Logo"
                className="h-40 w-55 rounded-xl"
              />
            </div>

            {/* Mobile Accordion */}
            <div className="mt-10 space-y-5 lg:hidden">

              {/* Acerca de Nosotros */}

              <div className="border-t border-white/10 pt-4">

                <button
                  onClick={() => toggleSection('empresa')}
                  className="flex w-full items-center justify-between text-sm uppercase tracking-[0.2em]"
                >
                  <span>ACERCA DE NOSOTROS</span>
                  <span>{openSection === 'empresa' ? '△' : '▽'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === "empresa" && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden mt-4 space-y-3 text-left text-sm text-white/80"
                    >
                      {aboutLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            className="block rounded-lg px-2 py-2 transition hover:bg-white/10"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

              </div>

              {/* La Empresa */}

              <div className="border-t border-white/10 pt-4">

                <button
                  onClick={() => toggleSection('empresa-info')}
                  className="flex w-full items-center justify-between text-sm uppercase tracking-[0.2em]"
                >
                  <span>LA EMPRESA</span>
                  <span>{openSection === 'empresa-info' ? '△' : '▽'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === "empresa-info" && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden mt-4 space-y-3 text-left text-sm text-white/80"
                    >
                      {companyLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            className="block rounded-lg px-2 py-2 transition hover:bg-white/10"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

              </div>

              {/* Redes */}

              <div className="border-t border-white/10 pt-4">

                <button
                  onClick={() => toggleSection('redes')}
                  className="flex w-full items-center justify-between text-sm uppercase tracking-[0.2em]"
                >
                  <span>REDES</span>
                  <span>{openSection === 'redes' ? '△' : '▽'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === "redes" && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden mt-4 space-y-3 text-left text-sm text-white/80"
                    >
                      <li>
                        <a href="https://www.tiktok.com/@maxeta.pe" target="_blank" rel="noreferrer" className="block rounded-lg px-2 py-2 transition hover:bg-white/10">
                          TikTok
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/maxeta.pe/" target="_blank" rel="noreferrer" className="block rounded-lg px-2 py-2 transition hover:bg-white/10">
                          Instagram
                        </a>
                      </li>
                      <li>
                        <a href="https://www.facebook.com/maxeta.peru" target="_blank" rel="noreferrer" className="block rounded-lg px-2 py-2 transition hover:bg-white/10">
                          Facebook
                        </a>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>

              </div>

            </div>

          </div>

          {/* Escritorio */}

          <div className="hidden lg:block">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
              Acerca de Nosotros
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {aboutLinks.map(link=>(
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
              La Empresa
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {companyLinks.map(link=>(
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex flex-col items-end">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
              Redes
            </h3>

            <div className="mt-3 flex flex-col gap-3 w-full">
              {socialLinks}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-sm text-white/60 sm:flex-row lg:px-8">

          <p>© 2026 MAXETA. Todos los derechos reservados.</p>

          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white"
          >
            Ver colección
            <ArrowRight size={16}/>
          </Link>

        </div>
      </div>
    </footer>
  );
};