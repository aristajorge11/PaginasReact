import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useMemo, useState, type FormEvent, type MouseEvent as ReactMouseEvent, useRef, useEffect} from 'react';
import { Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getPlanById } from '../plans';
import { getHeaderData } from '../services/headerService';
import { CartDrawer } from './CartDrawer';
import { MembershipModal } from './MembershipModal';
import { SearchDropdown } from "./SearchDropdown";
import { getProducts } from "../services/contentService";

export const Header = () => {
  const { favorites, cart, toggleCart } = useWishlist();
  const { user, isAuthenticated, isLoading, logout, login } = useAuth();
  
  //buqueda
  const products = getProducts();
  const searchRef = useRef<HTMLDivElement>(null); 
  const [search, setSearch] = useState("");
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];

    const text = search.toLowerCase();

    return products
      .filter((product) =>
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text) ||
        product.subcategory.toLowerCase().includes(text)
      )
      .slice(0, 6);
  }, [search, products]);
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const headerData = getHeaderData();
  const { links } = headerData;
  const megaMenuTriggers = (headerData as any).megaMenuTriggers || ['Inicio', 'Nosotros', 'Contacto','Tienda','Beneficios'];
  const megaMenus = (headerData as any).megaMenus || {};

  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaTrigger, setActiveMegaTrigger] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const membership = useMemo(() => {
    if (!isAuthenticated || !user || isLoading) {
      return null;
    }

    const planEnd = new Date(user.planEnd);
    const isActive = Number.isFinite(planEnd.getTime()) && planEnd.getTime() > Date.now();

    if (!isActive) {
      return null;
    }

    const plan = getPlanById(user.plan);
    const daysRemaining = Math.max(0, Math.ceil((planEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    return {
      plan,
      daysRemaining,
    };
  }, [isAuthenticated, isLoading, user]);

  const membershipButtonLabel = membership ? `Plan ${membership.plan.nombre}` : null;

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setIsLoginSubmitting(true);

    try {
      await login({ identifier: loginIdentifier.trim(), password: loginPassword });
      setLoginIdentifier('');
      setLoginPassword('');
      setIsLoginModalOpen(false);
      navigate('/');
    } catch (submitError) {
      setLoginError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsLoginSubmitting(false);
    }
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      navigate("/tienda");
      return;
    }

    navigate(`/tienda?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const scrollToSection = (section: string) => {
    const target = document.getElementById(section) || document.querySelector(`[data-section="${section}"]`);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, link: { label: string; href: string }) => {
    const isSamePage = location.pathname === link.href;

    if (megaMenuTriggers.includes(link.label) && isSamePage) {
      event.preventDefault();
      const sectionId = link.label === 'Inicio' ? 'inicio' : link.label.toLowerCase();
      scrollToSection(sectionId);
      setIsMegaMenuOpen(false);
      setActiveMegaTrigger(null);
      return;
    }

    if (megaMenuTriggers.includes(link.label)) {
      setActiveMegaTrigger(link.label);
      setIsMegaMenuOpen(true);
    }
  };

  const renderMegaMenu = (trigger: string) => {
    const menuContent = megaMenus[trigger];
    
    if (!menuContent) return null;

    const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    const computeHref = (
      trigger: string,
      item: string
    ) => {

      if (trigger === "Tienda" || trigger === "Inicio") {

        // Categorías principales
        if (["Polos", "Shorts", "Joggers", "Pantalón"].includes(item)) {
          return `/tienda?category=${encodeURIComponent(item)}`;
        }

        // Subcategorías Polos
        if (
          [
            "Luxury",
            "Supremo",
            "Prime",
            "Caffarena",
            "Bottoncini",
          ].includes(item)
        ) {
          return `/tienda?category=Polos&subcategory=${encodeURIComponent(item)}`;
        }

        // Subcategorías Shorts
        if (item === "Set Vittoria") {
          return `/tienda?category=Shorts&subcategory=${encodeURIComponent(item)}`;
        }

        // Subcategorías Joggers
        if (item === "Set Signorile") {
          return `/tienda?category=Joggers&subcategory=${encodeURIComponent(item)}`;
        }

        // Subcategorías Pantalón
        if (["Clásico", "Sastre"].includes(item)) {
          return `/tienda?category=Pantalón&subcategory=${encodeURIComponent(item)}`;
        }

        return "/tienda";
      }

      if (trigger === "Nosotros") {
        return `/nosotros#${slugify(item)}`;
      }

      if (trigger === "Contacto") {
        return `/contacto#${slugify(item)}`;
      }

      if (trigger === "Beneficios") {
        return `/beneficios#${slugify(item)}`;
      }

      return "/";
    };

  [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {trigger === 'Contacto' ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {menuContent.map((group: any) => (
                  <div key={group.section}>
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-black/50">
                      {group.section}
                    </p>
                    <div className="mt-3 space-y-2">
                      {group.items.map((item: string) => {
                        const isContactInfo = item.includes(':');
                        if (isContactInfo) {
                          return (
                            <p key={item} className="text-center text-sm text-black/70 sm:text-left">
                              {item}
                            </p>
                          );
                        }

                        const href = computeHref(trigger, item);

                        return (
                          <Link
                            key={item}
                            to={href}
                            className="block rounded-lg px-2 py-2 text-sm text-black/70 transition hover:bg-red-50 hover:text-red-600"
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className={`grid gap-6 ${trigger === 'Tienda' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {menuContent.map((group: any) => (
                  <div key={group.section}>
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-black/50">
                      {group.section}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item: string) => {
                        const href = computeHref(trigger, item);
                        return (
                          <Link
                            key={item}
                            to={href}
                            className="rounded-full border border-black/10 px-3 py-2 text-xs sm:text-sm text-black/70 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#F7F3EC]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#F7F3EC]/90">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-full border border-black/10 bg-white p-2.5 text-black"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="text-base font-semibold uppercase tracking-[0.3em] text-black sm:text-xl lg:mr-auto">
            UOMO CATTIVO
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium uppercase tracking-[0.24em] text-black/80 lg:flex">
            {links.map((link) => {
              const isMegaTrigger = megaMenuTriggers.includes(link.label);

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (isMegaTrigger) {
                      setActiveMegaTrigger(link.label);
                      setIsMegaMenuOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isMegaTrigger) {
                      setIsMegaMenuOpen(false);
                      setActiveMegaTrigger(null);
                    }
                  }}
                >
                  <NavLink
                    to={link.href}
                    onClick={(event) => handleNavClick(event, link)}
                    className={({ isActive }) => `transition hover:text-red-600 ${isActive ? 'text-black' : ''}`}
                  >
                    {link.label}
                  </NavLink>

                  {isMegaTrigger && (
                    <AnimatePresence>
                      {isMegaMenuOpen && activeMegaTrigger === link.label && renderMegaMenu(link.label)}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {membership ? (
              <button
                type="button"
                onClick={() => setIsMembershipModalOpen(true)}
                className="hidden rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600 sm:inline-flex"
              >
                {membershipButtonLabel}
              </button>
            ) : null}

            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setLoginIdentifier('');
                  setLoginPassword('');
                  setLoginError('');
                  setIsLoginModalOpen(true);
                }}
                className="hidden rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600 sm:inline-flex"
              >
                Iniciar sesión
              </button>
            ) : null}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="hidden rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600 sm:inline-flex"
              >
                Cerrar sesión
              </button>
            ) : null}
            
            <div className="relative hidden h-full sm:block" ref={searchRef}>
              <form
                onSubmit={handleSearch}
                className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/60 sm:flex"
              >
                <Search size={16} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar"
                  className="w-72 bg-transparent outline-none placeholder:text-black/40"
                />
              </form>
              <SearchDropdown
                products={searchResults}
                search={search}
                onClose={() => setSearch("")}
                onViewAll={() => {
                  navigate(`/tienda?search=${encodeURIComponent(search)}`);
                  setSearch("");
                }}
              />
            </div>

            <Link to="/deseados" className="relative rounded-full border border-black/10 bg-white p-2.5 text-black">
              <Heart size={18} />
              {favorites.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {favorites.length}
                </span>
              ) : null}
            </Link>

            <button className="relative rounded-full border border-black/10 bg-white p-2.5 text-black" type="button" onClick={toggleCart}>
              <ShoppingBag size={18} />
              {cart.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-black/10 bg-white"
          >
            <nav className="flex flex-col divide-y divide-black/10 px-4 py-3 sm:px-6">
              {links.map((link) => (
                <div key={link.href}>
                  <NavLink
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm font-medium uppercase tracking-[0.24em] transition rounded-lg ${
                        isActive ? 'bg-black/10 text-black' : 'text-black/70 hover:text-red-600'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />

      <AnimatePresence>
        {isLoginModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:px-4 sm:py-6"
            onClick={() => setIsLoginModalOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-[1.5rem] border border-black/10 bg-[#F7F3EC] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 text-center sm:mb-6 sm:text-left">
                <p className="text-sm uppercase tracking-[0.3em] text-black/60">Acceso mayorista</p>
                <h2 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">Acceso Exclusivo para Mayoristas</h2>
                <p className="mt-3 text-sm text-black/70">Inicia sesión para acceder a los beneficios exclusivos de tu membresía.</p>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-black" htmlFor="header-login-identifier">
                    Correo electrónico
                  </label>
                  <input
                    id="header-login-identifier"
                    type="email"
                    value={loginIdentifier}
                    onChange={(event) => setLoginIdentifier(event.target.value)}
                    className="w-full rounded-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-red-500/20"
                    placeholder="correo@empresa.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-black" htmlFor="header-login-password">
                    Contraseña
                  </label>
                  <input
                    id="header-login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className="w-full rounded-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-red-500/20"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {loginError ? <p className="text-sm text-red-600">{loginError}</p> : null}

                <button
                  type="submit"
                  className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-black/50"
                  disabled={isLoginSubmitting}
                >
                  {isLoginSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10" />
                <span className="text-xs uppercase tracking-[0.25em] text-black/40">o</span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <p className="text-center text-sm text-black/70 sm:text-left">¿Aún no formas parte del programa mayorista?</p>
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsMembershipModalOpen(true);
                }}
                className="mt-4 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600 sm:w-auto"
              >
                ✨ Lo que te pierdes
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        mode={membership ? 'details' : 'select'}
        user={membership ? {
          name: user?.username,
          email: user?.email,
          plan: user?.plan,
          discount: user?.discount,
          renewalDate: new Date(user?.planEnd ?? Date.now()).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          daysRemaining: membership.daysRemaining,
        } : undefined}
      />
    </>
  );
};
