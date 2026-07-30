import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getPlanById } from '../plans';
import { CartDrawer } from './CartDrawer';
import { MembershipModal } from './MembershipModal';
import { SearchDropdown } from './SearchDropdown';
import { getProducts } from '../services/contentService';

type NavigationLink = {
  label: string;
  href: string;
  external?: boolean;
};

const navigationLinks: NavigationLink[] = [
  { label: 'Inicio', href: '/' },
  { label: '3x100', href: 'https://3x100.pe', external: true },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Beneficios', href: '/beneficios' },
];

export const Header = () => {
  const { favorites, cart, toggleCart } = useWishlist();
  const { user, isAuthenticated, isLoading, logout, login } = useAuth();
  const navigate = useNavigate();

  const products = getProducts();
  const searchRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      navigate('/tienda');
      return;
    }

    navigate(`/tienda?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
  };

  const renderNavItem = (link: NavigationLink) => {
    const baseClassName = 'transition hover:text-red-600';

    if (link.external) {
      return (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={baseClassName}
        >
          {link.label}
        </a>
      );
    }

    return (
      <NavLink
        key={link.href}
        to={link.href}
        className={({ isActive }) => `${baseClassName} ${isActive ? 'text-black' : 'text-black/80'}`}
      >
        {link.label}
      </NavLink>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-black lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="text-base font-semibold uppercase tracking-[0.3em] text-black sm:text-xl lg:mr-auto">
            CREPANTE
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium uppercase tracking-[0.24em] lg:flex">
            {navigationLinks.map((link) => renderNavItem(link))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {membership ? (
              <button
                type="button"
                onClick={() => setIsMembershipModalOpen(true)}
                className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600 sm:inline-flex"
              >
                <span className="text-base leading-none" aria-hidden>
                  {membership.plan.icono}
                </span>
                <span className="max-w-[10rem] truncate">{user?.username ?? 'Usuario'}</span>
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
                className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-black/60 sm:flex"
              >
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar"
                  className="w-72 bg-transparent outline-none placeholder:text-black/40"
                />
              </form>
              <SearchDropdown
                products={searchResults}
                search={search}
                onClose={() => setSearch('')}
                onViewAll={() => {
                  navigate(`/tienda?search=${encodeURIComponent(search)}`);
                  setSearch('');
                }}
              />
            </div>

            <Link to="/deseados" className="relative rounded-full border border-zinc-200 bg-white p-2.5 text-black">
              <Heart size={18} />
              {favorites.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {favorites.length}
                </span>
              ) : null}
            </Link>

            <button className="relative rounded-full border border-zinc-200 bg-white p-2.5 text-black" type="button" onClick={toggleCart}>
              <ShoppingBag size={18} />
              {cart.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-black/10 bg-white lg:hidden"
            >
              <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
                <form
                  onSubmit={(event) => {
                    handleSearch(event);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/60"
                >
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar productos"
                    className="w-full bg-transparent outline-none placeholder:text-black/40"
                  />
                </form>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMembershipModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600"
                  >
                    Ver planes
                  </button>

                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLoginIdentifier('');
                        setLoginPassword('');
                        setLoginError('');
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Iniciar sesión
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  )}
                </div>

                <nav className="flex flex-col divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
                  {navigationLinks.map((link) => {
                    if (link.external) {
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-black/70 transition hover:bg-red-50 hover:text-red-600"
                        >
                          {link.label}
                        </a>
                      );
                    }

                    return (
                      <NavLink
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] transition ${
                            isActive ? 'bg-black text-white' : 'text-black/70 hover:bg-red-50 hover:text-red-600'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
              className="w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-8"
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
