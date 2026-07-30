import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, CheckCircle2, CreditCard, ShieldCheck, Sparkles, UserRound, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPlanById, getPlanOptions, type SubscriptionPlan } from '../plans';
import type { RegisterUserInput } from '../types/auth';

type MembershipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: SubscriptionPlan['id']) => void;
  mode?: 'select' | 'details';
  user?: {
    name?: string;
    email?: string;
    plan?: SubscriptionPlan['id'];
    discount?: number;
    renewalDate?: string;
    daysRemaining?: number;
  } | null;
  initialPlanId?: SubscriptionPlan['id'];
  initialFlowStep?: FlowStep;
};

type FlowStep = 'plan' | 'account' | 'payment' | 'success';
type PaymentMethod = 'card' | 'yape' | 'paypal' | 'cash';

type PaymentFormState = {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
  yapePhone: string;
  autoRenew: boolean;
};

type RegisterFormState = RegisterUserInput & {
  confirmPassword: string;
};

const createInitialRegisterForm = (email = ''): RegisterFormState => ({
  username: '',
  email,
  password: '',
  confirmPassword: '',
  phone: '',
  ruc: '',
  plan: 'bronze',
  autoRenew: true,
});

const createInitialPaymentForm = (): PaymentFormState => ({
  paymentMethod: 'card',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvc: '',
  yapePhone: '',
  autoRenew: true,
});

export const MembershipModal = ({
  isOpen,
  onClose,
  onSelectPlan,
  mode = 'select',
  user,
  initialPlanId,
  initialFlowStep = 'plan',
}: MembershipModalProps) => {
  const { user: authUser, isAuthenticated, register, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const plans = useMemo(() => getPlanOptions(), []);
  const [view, setView] = useState<'select' | 'details'>(mode);
  const [flowStep, setFlowStep] = useState<FlowStep>(initialFlowStep);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlan['id']>(initialPlanId ?? user?.plan ?? plans[0]?.id ?? 'bronze');
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(createInitialRegisterForm(user?.email ?? ''));
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(createInitialPaymentForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const profileName = authUser?.username ?? user?.name ?? '';
  const profileEmail = authUser?.email ?? user?.email ?? '';
  const currentPlan = useMemo(() => getPlanById(user?.plan ?? selectedPlanId), [selectedPlanId, user?.plan]);
  const selectedPlan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);

  useEffect(() => {
    setView(mode);
  }, [mode]);

  useEffect(() => {
    if (!isOpen) {
      setView(mode);
      setFlowStep(initialFlowStep);
      setSelectedPlanId(initialPlanId ?? user?.plan ?? plans[0]?.id ?? 'bronze');
      setRegisterForm(createInitialRegisterForm(user?.email ?? ''));
      setPaymentForm(createInitialPaymentForm());
      setError('');
      setIsSubmitting(false);
      return;
    }

    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    } else if (user?.plan) {
      setSelectedPlanId(user.plan);
    }

    setFlowStep(initialFlowStep);

    setRegisterForm((current) => ({
      ...current,
      username: current.username || profileName,
      email: current.email || profileEmail,
      plan: current.plan || selectedPlanId,
      autoRenew: current.autoRenew ?? true,
    }));
  }, [initialFlowStep, initialPlanId, isOpen, mode, plans, profileEmail, profileName, selectedPlanId, user?.email, user?.plan]);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    onSelectPlan?.(plan.id);
  };

  const handleContinueToAccount = () => {
    setFlowStep('account');
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'autoRenew') {
      setRegisterForm((current) => ({ ...current, autoRenew: value === 'true' }));
      return;
    }

    setRegisterForm((current) => ({ ...current, [name]: value }));
  };

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'autoRenew') {
      setPaymentForm((current) => ({ ...current, autoRenew: value === 'true' }));
      return;
    }

    setPaymentForm((current) => ({ ...current, [name]: value }));
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setFlowStep('payment');
  };

  const handlePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!isAuthenticated) {
        await register({
          username: registerForm.username.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
          phone: registerForm.phone.trim(),
          ruc: registerForm.ruc?.trim() || undefined,
          plan: selectedPlanId,
          discount: selectedPlan.descuento,
          autoRenew: registerForm.autoRenew,
        });
      }

      await updateSubscription({
        plan: selectedPlanId,
        discount: selectedPlan.descuento,
        autoRenew: paymentForm.autoRenew,
        amount: selectedPlan.precio,
        paymentMethod: paymentForm.paymentMethod,
      });

      const welcomeName = registerForm.username.trim() || authUser?.username || profileName || 'cliente mayorista';
      const planIcon = selectedPlan.icono;
      onClose();
      navigate('/');
      window.alert(`¡Bienvenido, ${welcomeName}! Tu membresía ${planIcon} ${selectedPlan.nombre} ya está activa.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo completar la suscripción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    onClose();
    navigate('/');
    window.alert('¡Bienvenido a EZZETA! Tu membresía mayorista ya está activa.');
  };

  if (!isOpen) {
    return null;
  }

  if (view === 'details') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-3 sm:p-6 overflow-y-auto backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-[1.8rem] border border-black/10 bg-white p-4 shadow-[0_30px_75px_rgba(0,0,0,0.22)]
                      sm:rounded-[2rem] sm:p-6 lg:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-black/50">Tu membresía</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-black">{currentPlan.nombre}</h2>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-black/70">
                  Consulta los detalles de tu membresía activa y mejora tu plan cuando lo necesites.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="self-end sm:self-auto rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:border-black/30"
              >
                X
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.4rem] border border-black/10 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2">
                  <UserRound size={15} className="text-black" />
                  <p className="text-sm uppercase tracking-[0.28em] text-black/60">Datos del usuario</p>
                </div>
                <div className="mt-4 space-y-3 text-sm text-black/75">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Nombre</span>
                    <span className="font-medium text-black">{profileName || 'Cliente mayorista'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Correo</span>
                    <span className="font-medium text-black">{profileEmail || 'Sin correo registrado'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Plan</span>
                    <span className="font-medium text-black">{currentPlan.nombre}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Descuento</span>
                    <span className="font-medium text-black">{user?.discount ?? currentPlan.descuento}%</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Renovación</span>
                    <span className="font-medium text-black">{user?.renewalDate || 'Por confirmar'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-black/60">Días restantes</span>
                    <span className="font-medium text-black">{user?.daysRemaining ?? 0} días</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-black/10 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-red-600" />
                  <p className="text-sm uppercase tracking-[0.28em] text-black/60">Beneficios</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-black/75">
                  {currentPlan.beneficios.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-sm text-black/70 sm:text-left">
                Tu membresía actual está activa con <span className="font-semibold text-black">{currentPlan.nombre}</span>.
              </p>
              <motion.button
                type="button"
                onClick={() => setView('select')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                ✨ Cambiar Plan
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-3 sm:p-5 overflow-y-auto backdrop-blur-[2px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-6xl max-h-[90dvh] overflow-y-auto rounded-[1.8rem] sm:rounded-[2rem] border border-black/10 bg-white p-4 sm:p-6 lg:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building2 size={15} className="text-black" />
                <p className="text-xs uppercase tracking-[0.28em] text-black/50">Membresía mayorista</p>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-black">
                {flowStep === 'plan' && 'Elige tu plan'}
                {flowStep === 'account' && 'Crea tu cuenta'}
                {flowStep === 'payment' && 'Completa tu suscripción'}
                {flowStep === 'success' && '¡Todo listo!'}
              </h2>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-black/70">
                {flowStep === 'plan' && 'Compara beneficios, descuentos y duración para encontrar el plan ideal.'}
                {flowStep === 'account' && 'Registra tus datos para activar tu membresía y disfrutar beneficios exclusivos.'}
                {flowStep === 'payment' && 'Elige tu método de pago preferido y confirma la activación del plan.'}
                {flowStep === 'success' && 'Tu membresía ya está activa y puedes volver a comprar con descuentos especiales.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-end sm:self-auto rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:border-black/30"
            >
              X
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {['plan', 'account', 'payment', 'success'].map((step, index) => {
              const isCompleted = ['plan', 'account', 'payment', 'success'].indexOf(flowStep) > index;
              const isActive = flowStep === step;
              const labels = {
                plan: 'Plan',
                account: 'Cuenta',
                payment: 'Pago',
                success: 'Listo',
              } as const;
              const Icon = step === 'plan' ? Sparkles : step === 'account' ? UserRound : step === 'payment' ? Wallet : CheckCircle2;

              return (
                <motion.div
                  key={step}
                  whileHover={{ y: -1 }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.18em] ${isActive ? 'border-black bg-black text-white' : isCompleted ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white text-black/70'}`}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current/30">
                    <Icon size={13} />
                  </span>
                  <span>{labels[step as keyof typeof labels]}</span>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
          {flowStep === 'plan' ? (
            <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;

                  return (
                    <motion.button
                      key={plan.id}
                      type="button"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handlePlanSelect(plan)}
                      className={`rounded-[1.4rem] border p-4 text-left shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition ${isSelected ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black hover:border-black/30'}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{plan.icono}</span>
                          <span className="font-semibold">{plan.nombre}</span>
                        </div>
                        <span className="rounded-full border border-current/20 px-2 py-1 text-[10px] uppercase tracking-[0.25em]">
                          {plan.duracion}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-inherit/80">{plan.beneficios[0]}</p>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-semibold">S/{plan.precio}</p>
                          <p className="mt-1 text-sm text-inherit/70">{plan.descuento}% de descuento</p>
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-sm">{plan.duracion}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="rounded-[1.4rem] border border-black/10 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.07)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-black/60">Tu elección</p>
                    <h3 className="mt-2 text-xl font-semibold text-black">{selectedPlan.nombre}</h3>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-black">
                    {selectedPlan.descuento}% dto.
                  </div>
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <ShieldCheck size={16} />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Incluye</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-black/75">
                    {selectedPlan.beneficios.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-red-600" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  type="button"
                  onClick={handleContinueToAccount}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-5 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Continuar al pago
                </motion.button>
              </div>
            </motion.div>
          ) : null}

          {flowStep === 'account' ? (
            <motion.form key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.07)] lg:grid-cols-2" onSubmit={handleRegisterSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Usuario</span>
                  <input name="username" value={registerForm.username} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="Tu usuario" required />
                </label>
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Correo</span>
                  <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="correo@empresa.com" required />
                </label>
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Teléfono</span>
                  <input name="phone" value={registerForm.phone} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="987654321" required />
                </label>
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">RUC (opcional)</span>
                  <input name="ruc" value={registerForm.ruc || ''} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="20600000000" />
                </label>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Contraseña</span>
                  <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="••••••••" required />
                </label>
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Confirmar contraseña</span>
                  <input name="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={handleRegisterChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="••••••••" required />
                </label>
                <label className="block text-sm text-black/75">
                  <span className="mb-1 block font-medium">Método de pago</span>
                  <select name="paymentMethod" value={paymentForm.paymentMethod} onChange={handlePaymentChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none">
                    <option value="card">Tarjeta</option>
                    <option value="yape">Yape</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Contra entrega</option>
                  </select>
                </label>
                <label className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/75">
                  <span>Renovación automática</span>
                  <select name="autoRenew" value={String(registerForm.autoRenew)} onChange={handleRegisterChange} className="w-full sm:w-auto rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none">
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </label>
              </div>

              {error ? <p className="text-sm text-red-600 lg:col-span-2">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setFlowStep('plan')} className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5">
                  Volver
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                  Continuar
                </motion.button>
              </div>
            </motion.form>
          ) : null}

          {flowStep === 'payment' ? (
            <motion.form key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.07)]" onSubmit={handlePaymentSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-[1.2rem] border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/50">Plan seleccionado</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-black">{selectedPlan.nombre}</p>
                      <p className="text-center text-sm text-black/70 sm:text-left">{selectedPlan.descuento}% de descuento mensual</p>
                    </div>
                    <div className="self-start rounded-full bg-white px-3 py-1 text-sm font-medium text-black">S/{selectedPlan.precio}</div>
                  </div>
                </div>

                {paymentForm.paymentMethod === 'card' ? (
                  <div className="space-y-4 rounded-[1.2rem] border border-black/10 bg-white p-4">
                    <label className="block text-sm text-black/75">
                      <span className="mb-1 block font-medium">Número de tarjeta</span>
                      <input name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="4242 4242 4242 4242" required />
                    </label>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <label className="block text-sm text-black/75">
                        <span className="mb-1 block font-medium">Nombre en la tarjeta</span>
                        <input name="cardName" value={paymentForm.cardName} onChange={handlePaymentChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="Juan Pérez" required />
                      </label>
                      <label className="block text-sm text-black/75">
                        <span className="mb-1 block font-medium">Expiración / CVC</span>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input name="cardExpiry" value={paymentForm.cardExpiry} onChange={handlePaymentChange} className="w-full sm:w-1/2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="MM/AA" required />
                          <input name="cardCvc" value={paymentForm.cardCvc} onChange={handlePaymentChange} className="w-full sm:w-1/2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="CVC" required />
                        </div>
                      </label>
                    </div>
                  </div>
                ) : null}

                {paymentForm.paymentMethod === 'yape' ? (
                  <label className="block text-sm text-black/75">
                    <span className="mb-1 block font-medium">Número Yape</span>
                    <input name="yapePhone" value={paymentForm.yapePhone} onChange={handlePaymentChange} className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none" placeholder="987654321" required />
                  </label>
                ) : null}

                {paymentForm.paymentMethod === 'paypal' ? (
                  <div className="rounded-[1.2rem] border border-black/10 bg-white p-4 text-sm text-black/70">
                    Serás redirigido a PayPal al confirmar el pedido.
                  </div>
                ) : null}

                {paymentForm.paymentMethod === 'cash' ? (
                  <div className="rounded-[1.2rem] border border-black/10 bg-white p-4 text-sm text-black/70">
                    Puedes pagar al recibir el pedido en la dirección indicada.
                  </div>
                ) : null}
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setFlowStep('account')} className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5">
                  Volver
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-black/70">
                  {isSubmitting ? 'Activando...' : 'Iniciar membresía'}
                </motion.button>
              </div>
            </motion.form>
          ) : null}

          {flowStep === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 rounded-2xl border border-black/10 bg-white p-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.07)] sm:p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
                <CreditCard size={24} />
              </div>
              <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-black">¡Tu miembrosía ya está activa!</h3>
              <p className="mt-3 text-sm text-black/70">
                {selectedPlan.nombre} quedó activado con un descuento del {selectedPlan.descuento}% y podrás seguir comprando con beneficios exclusivos.
              </p>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleComplete} className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                Volver al inicio
              </motion.button>
            </motion.div>
          ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
