import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ identifier, password });
      navigate('/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-5 text-center sm:mb-6 sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-black/60">Acceso mayorista</p>
          <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">Iniciar sesión</h1>
          <p className="mt-3 text-sm text-black/70">Ingresa tus credenciales para acceder a tu cuenta de cliente mayorista.</p>
        </div>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="identifier">
              Usuario o correo
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="usuario@correo.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-black/50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-black/70">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-red-600 hover:text-red-700">
            Crear una cuenta
          </Link>
        </p>
      </div>
    </section>
  );
};
