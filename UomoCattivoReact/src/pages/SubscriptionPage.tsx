import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MembershipModal } from '../components/MembershipModal';
import { useAuth } from '../context/AuthContext';
import { getDefaultPlanId, getPlanOptions, type SubscriptionPlan, type WholesalePlanId } from '../plans';
import type { RegisterUserInput } from '../types/auth';

type SubscriptionStep = 'plan' | 'register' | 'payment' | 'confirmation';

type PaymentFormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'card' | 'yape' | 'paypal' | 'cash';
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
  yapePhone: string;
  autoRenew: boolean;
};

const initialPaymentForm = (userEmail = '', userPhone = ''): PaymentFormState => ({
  name: '',
  email: userEmail,
  phone: userPhone,
  address: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvc: '',
  yapePhone: '',
  autoRenew: true,
});

const initialRegisterForm = (userEmail = '', userPhone = ''): RegisterUserInput => ({
  username: '',
  email: userEmail,
  password: '',
  phone: userPhone,
  ruc: '',
  plan: getDefaultPlanId(),
  autoRenew: true,
});

export const SubscriptionPage = () => {
  const { user, isAuthenticated, register, updateSubscription } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [step, setStep] = useState<SubscriptionStep>('plan');
  const [selectedPlanId, setSelectedPlanId] = useState<WholesalePlanId>(getDefaultPlanId());
  const [registerForm, setRegisterForm] = useState<RegisterUserInput>(initialRegisterForm());
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(initialPaymentForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const planOptions = useMemo(() => getPlanOptions(), []);
  const selectedPlan = useMemo(() => planOptions.find((plan) => plan.id === selectedPlanId) ?? planOptions[0], [planOptions, selectedPlanId]);

  useEffect(() => {
    if (user) {
      setRegisterForm((current) => ({
        ...current,
        username: current.username || user.username,
        email: current.email || user.email,
        phone: current.phone || user.phone,
        ruc: current.ruc || user.ruc || '',
        plan: current.plan || user.plan,
        autoRenew: current.autoRenew ?? user.autoRenew,
      }));

      setPaymentForm((current) => ({
        ...current,
        name: current.name || user.username,
        email: current.email || user.email,
        phone: current.phone || user.phone,
        autoRenew: current.autoRenew ?? user.autoRenew,
      }));
    }
  }, [user]);

  const handlePlanSelection = (planId: SubscriptionPlan['id']) => {
    setSelectedPlanId(planId);
    setIsModalOpen(false);
    setError('');

    if (isAuthenticated) {
      setStep('payment');
      return;
    }

    setStep('register');
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'autoRenew') {
      setRegisterForm((current) => ({ ...current, autoRenew: value === 'true' }));
      return;
    }

    setRegisterForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'autoRenew') {
      setPaymentForm((current) => ({ ...current, autoRenew: value === 'true' }));
      return;
    }

    setPaymentForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        ...registerForm,
        ruc: registerForm.ruc?.trim() || undefined,
        plan: selectedPlanId,
        discount: selectedPlan.descuento,
      });
      setStep('payment');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo completar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await updateSubscription({
        plan: selectedPlanId,
        discount: selectedPlan.descuento,
        autoRenew: paymentForm.autoRenew,
        amount: selectedPlan.precio,
        paymentMethod: paymentForm.paymentMethod,
      });
      setStep('confirmation');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo completar la suscripción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (step === 'register') {
      return (
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Paso 2</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Crea tu cuenta mayorista</h2>
            <p className="mt-2 text-sm text-white/70">Registra tus datos para activar el plan seleccionado y continuar con el pago simulado.</p>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={handleRegisterSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">Usuario</span>
                <input name="username" value={registerForm.username} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="Tu usuario" required />
              </label>
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">Correo</span>
                <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="correo@empresa.com" required />
              </label>
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">Contraseña</span>
                <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="••••••••" required />
              </label>
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">Teléfono</span>
                <input name="phone" value={registerForm.phone} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="987654321" required />
              </label>
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">RUC (opcional)</span>
                <input name="ruc" value={registerForm.ruc || ''} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="20600000000" />
              </label>
              <label className="block text-sm text-white/80">
                <span className="mb-1 block">Renovación automática</span>
                <select name="autoRenew" value={String(registerForm.autoRenew)} onChange={handleRegisterChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none">
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep('plan')} className="flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20">
                Volver
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-800">
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta y continuar'}
              </button>
            </div>
          </form>
        </motion.div>
      );
    }

    if (step === 'payment') {
      return (
        <motion.div
          key="payment"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Paso 3</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Completa el pago simulado</h2>
            <p className="mt-2 text-sm text-white/70">Este formulario replica el checkout del carrito con un flujo visual de dos columnas y sin integración real con una pasarela.</p>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={handlePaymentSubmit}>
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <h3 className="text-base font-semibold text-white">Datos del usuario</h3>
                <label className="block text-sm text-white/80">
                  <span className="mb-1 block">Nombre completo</span>
                  <input name="name" value={paymentForm.name} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="Nombre y apellido" required />
                </label>
                <label className="block text-sm text-white/80">
                  <span className="mb-1 block">Correo</span>
                  <input name="email" type="email" value={paymentForm.email} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="correo@empresa.com" required />
                </label>
                <label className="block text-sm text-white/80">
                  <span className="mb-1 block">Teléfono</span>
                  <input name="phone" value={paymentForm.phone} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="987654321" required />
                </label>
                <label className="block text-sm text-white/80">
                  <span className="mb-1 block">Dirección</span>
                  <input name="address" value={paymentForm.address} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="Av. Principal 123" required />
                </label>
                <label className="block text-sm text-white/80">
                  <span className="mb-1 block">Método de pago</span>
                  <select name="paymentMethod" value={paymentForm.paymentMethod} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none">
                    <option value="card">Tarjeta</option>
                    <option value="yape">Yape</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </label>

                {paymentForm.paymentMethod === 'card' && (
                  <div className="space-y-3 rounded-[1rem] border border-white/10 bg-black/20 p-3">
                    <label className="block text-sm text-white/80">
                      <span className="mb-1 block">Número de tarjeta</span>
                      <input name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="4242 4242 4242 4242" required />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm text-white/80">
                        <span className="mb-1 block">Titular</span>
                        <input name="cardName" value={paymentForm.cardName} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="Nombre del titular" required />
                      </label>
                      <label className="block text-sm text-white/80">
                        <span className="mb-1 block">Expiración / CVC</span>
                        <div className="flex gap-2">
                          <input name="cardExpiry" value={paymentForm.cardExpiry} onChange={handlePaymentChange} className="w-1/2 rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="MM/AA" required />
                          <input name="cardCvc" value={paymentForm.cardCvc} onChange={handlePaymentChange} className="w-1/2 rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="CVC" required />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {paymentForm.paymentMethod === 'yape' && (
                  <label className="block text-sm text-white/80">
                    <span className="mb-1 block">Número Yape</span>
                    <input name="yapePhone" value={paymentForm.yapePhone} onChange={handlePaymentChange} className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-black outline-none" placeholder="987654321" required />
                  </label>
                )}

                {paymentForm.paymentMethod === 'paypal' && (
                  <p className="rounded-[1rem] border border-white/10 bg-black/20 p-3 text-sm text-white/70">Se abrirá una pantalla de confirmación ficticia al completar el flujo.</p>
                )}

                {paymentForm.paymentMethod === 'cash' && (
                  <p className="rounded-[1rem] border border-white/10 bg-black/20 p-3 text-sm text-white/70">La activación se confirmará al finalizar el proceso simulado.</p>
                )}
              </div>

              <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
                  <ShieldCheck size={16} />
                  <span>Resumen del plan</span>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-white/60">Plan seleccionado</p>
                      <h3 className="text-xl font-semibold text-white">{selectedPlan.nombre}</h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{selectedPlan.duracion}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/60">Precio mensual</p>
                      <p className="text-3xl font-semibold text-white">S/{selectedPlan.precio}</p>
                    </div>
                    <div className="rounded-full bg-red-600/20 px-3 py-1 text-sm text-red-300">{selectedPlan.descuento}% dto.</div>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-white">Beneficios incluidos</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/70">
                    {selectedPlan.beneficios.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-red-400" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <label className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                  <span>Renovación automática</span>
                  <select name="autoRenew" value={String(paymentForm.autoRenew)} onChange={handlePaymentChange} className="rounded-full border border-white/10 bg-white px-3 py-2 text-sm text-black outline-none">
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </label>
              </div>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex gap-3">
              <button type="button" onClick={() => (isAuthenticated ? setStep('plan') : setStep('register'))} className="flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20">
                Volver
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-800">
                {isSubmitting ? 'Procesando...' : 'Confirmar suscripción'}
              </button>
            </div>
          </form>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="confirmation"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-5"
      >
        <div className="rounded-[1.25rem] border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-100">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/20 p-2">
              <Check size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Suscripción confirmada</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Tu plan {selectedPlan.nombre} ya quedó activado</h2>
            </div>
          </div>
          <p className="mt-4 text-sm text-emerald-100/90">Tu usuario fue actualizado mediante AuthService y el plan seleccionado quedó guardado en la sesión activa.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Detalle</p>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Plan</span>
                <span className="font-semibold text-white">{selectedPlan.nombre}</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Precio</span>
                <span className="font-semibold text-white">S/{selectedPlan.precio}</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Duración</span>
                <span className="font-semibold text-white">{selectedPlan.duracion}</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Renovación</span>
                <span className="font-semibold text-white">{paymentForm.autoRenew ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Próximos pasos</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-red-400" /><span>Recibirás el acceso a beneficios exclusivos de tu plan.</span></li>
              <li className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-red-400" /><span>Tu cuenta actualiza el plan y el descuento automáticamente.</span></li>
              <li className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-red-400" /><span>Podrás revisar los cambios desde la cuenta mayorista.</span></li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-[#F7F3EC]">
            Volver al inicio
          </Link>
          <button type="button" onClick={() => { setStep('plan'); setIsModalOpen(true); }} className="flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
            Elegir otro plan
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-black p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Suscripción mayorista</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Activa tu plan en pocos pasos</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">Elige un plan, registra tu cuenta si aún no tienes una y confirma el pago simulado. El flujo está diseñado para replicar el estilo del checkout del carrito.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
            {isAuthenticated ? 'Cuenta activa' : 'Registro necesario'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/60">
              <CreditCard size={16} />
              <span>Plan actual</span>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-white/60">Seleccionado</p>
                  <h2 className="text-2xl font-semibold text-white">{selectedPlan.nombre}</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{selectedPlan.duracion}</div>
              </div>
              <p className="mt-4 text-sm text-white/70">{selectedPlan.beneficios[0]}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/60">Precio</p>
                  <p className="text-3xl font-semibold text-white">S/{selectedPlan.precio}</p>
                </div>
                <div className="rounded-full bg-red-600/20 px-3 py-1 text-sm text-red-300">{selectedPlan.descuento}% de descuento</div>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-white">Beneficios incluidos</p>
                <button type="button" onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-red-300 transition hover:text-red-200">
                  Cambiar plan
                </button>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {selectedPlan.beneficios.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-red-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-medium text-white">Renovación</p>
              <p className="mt-2 text-sm text-white/70">Tu membresía puede renovarse de forma automática según la opción seleccionada al finalizar el proceso.</p>
            </div>

            <button type="button" onClick={() => setIsModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#F7F3EC]">
              Ver planes disponibles <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <MembershipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectPlan={handlePlanSelection} />
    </section>
  );
};
