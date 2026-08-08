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

    const preferredPlanId = initialPlanId ?? user?.plan ?? plans[0]?.id ?? 'bronze';

    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    } else if (user?.plan) {
      setSelectedPlanId(user.plan);
    } else {
      setSelectedPlanId(preferredPlanId);
    }

    setFlowStep(initialFlowStep);

    setRegisterForm((current) => ({
      ...current,
      username: current.username || profileName,
      email: current.email || profileEmail,
      plan: current.plan || preferredPlanId,
      autoRenew: current.autoRenew ?? true,
    }));
  }, [initialFlowStep, initialPlanId, isOpen, mode, plans, profileEmail, profileName, user?.email, user?.plan]);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    onSelectPlan?.(plan.id);
  };

  const handleContinueToAccount = () => {
    if (isAuthenticated) {
      setFlowStep('payment');
      return;
    }

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

      setFlowStep('success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo completar la suscripción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    onClose();
    navigate('/');
    window.alert('¡Bienvenido a MAXETA! Tu membresía mayorista ya está activa.');
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
            className="relative w-full max-w-5xl max-h-[92dvh] overflow-y-auto border border-white/10 bg-[#111111] text-white shadow-[0_40px_120px_rgba(0,0,0,0.6)] p-5 sm:p-7 lg:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center border border-green-500 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-green-400">● Activa</span>
                <h2 className="mt-4 text-3xl font-bold uppercase tracking-[0.12em] text-white">{currentPlan.nombre}</h2>
                <p className="mt-2 text-sm text-white/60">Panel de administración de tu membresía mayorista.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="self-end border border-white/10 bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:text-red-500"
              >
                X
              </button>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="sticky top-0 border border-white/10 bg-[#111111] p-7">
                <div className="space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-black">
                    <UserRound size={18} className="text-white"/>
                  </div>
                  <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/40">Perfil</p>
                      <h3 className="text-lg font-semibold text-white">Datos del usuario</h3>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Nombre</span>
                    <span className="font-medium text-white">{profileName || 'Cliente mayorista'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Correo</span>
                    <span className="font-medium text-white">{profileEmail || 'Sin correo registrado'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Plan</span>
                    <span className="font-medium text-white">{currentPlan.nombre}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Descuento</span>
                    <span className="font-medium text-white">{user?.discount ?? currentPlan.descuento}%</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Renovación</span>
                    <span className="font-medium text-white">{user?.renewalDate || 'Por confirmar'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-white/60">Días restantes</span>
                    <span className="font-medium text-white">{user?.daysRemaining ?? 0} días</span>
                  </div>
                </div>
              </div>

              <div className="sticky top-0 border border-white/10 bg-[#111111] p-7">
                <div className="space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center border border-red-600/30 bg-red-600/10">
                    <Sparkles size={18} className="text-red-500"/>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/40">Membresía</p>
                    <h3 className="text-lg font-semibold text-white">Beneficios incluidos</h3>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {currentPlan.beneficios.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Estado</p>
                <p className="mt-1 text-white">
                  Tu plan <span className="font-semibold">{currentPlan.nombre}</span> se encuentra activo y funcionando correctamente.
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => setView('select')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="border border-red-600 bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-red-500"
              >
                Administrar membresía →
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
          className="relative w-full max-w-6xl max-h-[90dvh] overflow-y-auto rounded-[1.8rem] sm:rounded-[2rem] border border-black/10 bg-[#1A1A1A] p-4 sm:p-6 lg:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="space-y-2">
                <Building2 size={15} className="text-white text-2xl" />
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">Membresía mayorista</p>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white text-2xl">
                {flowStep === 'plan' && 'Elige tu plan'}
                {flowStep === 'account' && 'Crea tu cuenta'}
                {flowStep === 'payment' && 'Completa tu suscripción'}
                {flowStep === 'success' && '¡Todo listo!'}
              </h2>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/70">
                {flowStep === 'plan' && 'Compara beneficios, descuentos y duración para encontrar el plan ideal.'}
                {flowStep === 'account' && 'Registra tus datos para activar tu membresía y disfrutar beneficios exclusivos.'}
                {flowStep === 'payment' && 'Elige tu método de pago preferido y confirma la activación del plan.'}
                {flowStep === 'success' && 'Tu membresía ya está activa y puedes volver a comprar con descuentos especiales.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-end border border-white/10 bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition hover:border-red-600 hover:text-red-500"
            >
              X
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-[#111111] p-3 sm:grid-cols-4">
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
                  className={`flex flex-col items-center justify-center gap-3 border px-4 py-4 text-xs uppercase tracking-[0.15em] transition-all duration-300 ${isActive ? 'border-red-600 bg-[#151515] text-white shadow-[0_0_35px_rgba(220,38,38,.18)]' : isCompleted ? 'border-red-600 bg-red-600 text-white' : 'border-white/10 bg-[#1A1A1A] text-white hover:border-red-600/60'}`}
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
                      className={`border p-6 text-left transition-all duration-300 ${isSelected ? 'border-red-600 bg-[#151515] text-white shadow-[0_0_35px_rgba(220,38,38,.18)]' : 'border-black/10 bg-white text-black hover:border-black/30'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex h-12 w-12 items-center justify-center border border-red-600/30 bg-red-600/10 text-2xl">
                            {plan.icono}
                          </div>
                          <span className="font-semibold">{plan.nombre}</span>
                        </div>
                        <span className="rounded-full border border-current/20 px-2 py-1 text-[10px] uppercase tracking-[0.25em]">
                          {plan.duracion}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-inherit/80">{plan.beneficios[0]}</p>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-4xl font-bold tracking-tight">S/{plan.precio}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-red-500">{plan.descuento}% de descuento</p>
                        </div>
                        <div className="border border-white/10 bg-[#1A1A1A]/10 px-3 py-1 text-sm">{plan.duracion}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="sticky top-0 border border-white/10 bg-[#111111] p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/40">Tu elección</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{selectedPlan.nombre}</h3>
                  </div>
                  <div className="border border-red-600 bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {selectedPlan.descuento}% dto.
                  </div>
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-black/10 bg-[#111111] p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <ShieldCheck size={16} />
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Incluye</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-white/70 uppercase tracking-[0.12em]">
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
                  className="mt-8 w-full border border-red-600 bg-red-600 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-500"
                >
                  Continuar al pago
                </motion.button>
              </div>
            </motion.div>
          ) : null}

          {flowStep === 'account' ? (
            <motion.form key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 grid grid-cols-1 gap-8 border border-white/10 bg-[#111111] p-7 lg:grid-cols-[1fr_1fr]" onSubmit={handleRegisterSubmit}>
              <div className="space-y-5 border-r border-white/10 pr-0 lg:pr-8">
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Usuario</span>
                  <input name="username" value={registerForm.username} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="Tu usuario" required />
                </label>
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Correo</span>
                  <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="correo@empresa.com" required />
                </label>
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Teléfono</span>
                  <input name="phone" value={registerForm.phone} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="987654321" required />
                </label>
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">RUC (opcional)</span>
                  <input name="ruc" value={registerForm.ruc || ''} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="20600000000" />
                </label>
              </div>

              <div className="space-y-5 border-r border-white/10 pr-0 lg:pr-8">
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Contraseña</span>
                  <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="••••••••" required />
                </label>
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Confirmar contraseña</span>
                  <input name="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="••••••••" required />
                </label>
                <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                  <span className="mb-1 block font-medium">Método de pago</span>
                  <select name="paymentMethod" value={paymentForm.paymentMethod} onChange={handlePaymentChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600">
                    <option value="card">Tarjeta</option>
                    <option value="yape">Yape</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash">Contra entrega</option>
                  </select>
                </label>
                <label className="flex flex-col gap-4 border border-white/10 bg-[#181818] p-5 lg:flex-row lg:items-center lg:justify-between">
                  <span>Renovación automática</span>
                  <select name="autoRenew" value={String(registerForm.autoRenew)} onChange={handleRegisterChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-red-600">
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </label>
              </div>

              {error ? <p className="text-sm text-red-600 lg:col-span-2">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setFlowStep('plan')} className="flex-1 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-black transition hover:bg-red-600 uppercase tracking-[0.16em]/5">
                  Volver
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" className="flex-1 rounded-full bg-red-600 uppercase tracking-[0.16em] px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                  Continuar
                </motion.button>
              </div>
            </motion.form>
          ) : null}

          {flowStep === 'payment' ? (
            <motion.form key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 border border-white/10 bg-[#111111] p-7" onSubmit={handlePaymentSubmit}>
              <div className="space-y-5 border-r border-white/10 pr-0 lg:pr-8">
                <div className="rounded-[1.2rem] border border-white/10 bg-[#1A1A1A] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Plan seleccionado</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{selectedPlan.nombre}</p>
                      <p className="text-center text-sm text-white/70 sm:text-left">{selectedPlan.descuento}% de descuento mensual</p>
                    </div>
                    <div className="self-start border border-white/10 bg-[#1A1A1A] px-3 py-1 text-sm font-medium text-white">S/{selectedPlan.precio}</div>
                  </div>
                </div>

                {paymentForm.paymentMethod === 'card' ? (
                  <div className="space-y-4 rounded-[1.2rem] border border-white/10 bg-[#1A1A1A] p-4">
                    <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                      <span className="mb-1 block font-medium">Número de tarjeta</span>
                      <input name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="4242 4242 4242 4242" required />
                    </label>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                        <span className="mb-1 block font-medium">Nombre en la tarjeta</span>
                        <input name="cardName" value={paymentForm.cardName} onChange={handlePaymentChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="Juan Pérez" required />
                      </label>
                      <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                        <span className="mb-1 block font-medium">Expiración / CVC</span>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input name="cardExpiry" value={paymentForm.cardExpiry} onChange={handlePaymentChange} className="w-full sm:w-1/2 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm outline-none" placeholder="MM/AA" required />
                          <input name="cardCvc" value={paymentForm.cardCvc} onChange={handlePaymentChange} className="w-full sm:w-1/2 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm outline-none" placeholder="CVC" required />
                        </div>
                      </label>
                    </div>
                  </div>
                ) : null}

                {paymentForm.paymentMethod === 'yape' ? (
                  <label className="block text-sm text-white/70 uppercase tracking-[0.12em]">
                    <span className="mb-1 block font-medium">Número Yape</span>
                    <input name="yapePhone" value={paymentForm.yapePhone} onChange={handlePaymentChange} className="w-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-600" placeholder="987654321" required />
                  </label>
                ) : null}

                {paymentForm.paymentMethod === 'paypal' ? (
                  <div className="rounded-[1.2rem] border border-white/10 bg-[#1A1A1A] p-4 text-sm text-white/70">
                    Serás redirigido a PayPal al confirmar el pedido.
                  </div>
                ) : null}

                {paymentForm.paymentMethod === 'cash' ? (
                  <div className="rounded-[1.2rem] border border-white/10 bg-[#1A1A1A] p-4 text-sm text-white/70">
                    Puedes pagar al recibir el pedido en la dirección indicada.
                  </div>
                ) : null}
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setFlowStep(isAuthenticated ? 'plan' : 'account')} className="flex-1 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600 uppercase tracking-[0.16em]/5">
                  Volver
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-600 uppercase tracking-[0.16em]/70">
                  {isSubmitting ? 'Activando...' : 'Iniciar membresía'}
                </motion.button>
              </div>
            </motion.form>
          ) : null}

          {flowStep === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 border border-white/10 bg-[#111111] p-7">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white">
                <CreditCard size={24} />
              </div>
              <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">¡Tu membresía ya está activa!</h3>
              <p className="mt-3 text-sm text-white/70">
                {selectedPlan.nombre} quedó activado con un descuento del {selectedPlan.descuento}% y podrás seguir comprando con beneficios exclusivos.
              </p>
              <div className="mt-10 border border-white/10 bg-[#1A1A1A] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    RESUMEN
                </p>

                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-white/50">Plan</span>
                        <span className="text-white">{selectedPlan.nombre}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-white/50">Descuento</span>
                        <span className="text-red-500">
                            {selectedPlan.descuento}%
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-white/50">Duración</span>
                        <span className="text-white">
                            {selectedPlan.duracion}
                        </span>
                    </div>
                </div>
            </div>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleComplete} className="mt-8 flex w-full items-center justify-center border border-red-600 bg-red-600 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-700">
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
