import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getNavigation } from '../services/contentService';
import { AnimatePresence, motion } from "framer-motion";

export const Footer = () => {
  const links = getNavigation();

  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const socialLinks = (
    <>
      <a
        href="https://www.tiktok.com/@uomocattivo"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-gray px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 3v10a4 4 0 1 0 4-4V5a6 6 0 1 1-4 1z" fill="white"/>
        </svg>
        TikTok
      </a>

      <a
        href="https://www.instagram.com/uomocattivo_/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.2"/>
          <path d="M16 8h.01" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="white" strokeWidth="1.2"/>
        </svg>
        Instagram
      </a>

      <a
        href="https://web.facebook.com/p/UOMO-Cattivo-61552419367774"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" fill="white"/>
        </svg>
        Facebook
      </a>
    </>
  );

  return (
    <footer className="border-t border-black/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr]">

          {/* Logo */}
          <div className="text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              UOMO CATTIVO
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Estilo masculino, identidad seria y presencia.
            </h2>

            <p className="mt-3 text-sm text-white/70">
              La colección editorial de prendas pensadas para quienes prefieren distinción y actitud.
            </p>

            <div className="mt-6 flex justify-center lg:block">
              <img
                src="https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/406240257_122122291490080645_5906321138546348594_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x733&ctp=s1024x733&_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=0Okkm9cBBG0Q7kNvwHMyTFn&_nc_oc=AdozORhTPSf8MaIcREVPeqRBcUk1kPsJhtsmXQoCF7qtqSyHJa5upi_3SOyJknG7ns0&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=qBpEDUoEsiPVqdIXnAMT5A&_nc_ss=7b289&oh=00_AQB8IJX3Y0eb6v2xyR76Sl2_ESX3xNbAnjCyAzcsU92j4A&oe=6A6EC546"
                alt="Logo"
                className="h-40 w-75 rounded-xl"
              />
            </div>

            {/* Mobile Accordion */}
            <div className="mt-10 space-y-5 lg:hidden">

              {/* Empresa */}

              <div className="border-t border-white/10 pt-4">

                <button
                  onClick={() => toggleSection('empresa')}
                  className="flex w-full items-center justify-between text-sm uppercase tracking-[0.2em]"
                >
                  <span>LA EMPRESA</span>
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
                      {links.slice(0, 5).map((link) => (
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

              {/* Comunidad */}

              <div className="border-t border-white/10 pt-4">

                <button
                  onClick={() => toggleSection('comunidad')}
                  className="flex w-full items-center justify-between text-sm uppercase tracking-[0.2em]"
                >
                  <span>NUESTRA COMUNIDAD</span>
                  <span>{openSection === 'comunidad' ? '△' : '▽'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === "comunidad" && (
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
                      {links.slice(0, 5).map((link) => (
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
                      {links.slice(0, 5).map((link) => (
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

            </div>

          </div>

          {/* Escritorio */}

          <div className="hidden lg:block">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
              La Empresa
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {links.slice(0,5).map(link=>(
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-[#F7F3EC]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
              Nuestra Comunidad
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {links.slice(4).map(link=>(
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-[#F7F3EC]">
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

          <p>© 2026 UOMO CATTIVO. Todos los derechos reservados.</p>

          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#F7F3EC]"
          >
            Ver colección
            <ArrowRight size={16}/>
          </Link>

        </div>
      </div>
    </footer>
  );
};