import { AnimatePresence, motion } from 'framer-motion';
import {ArrowRight,BadgeCheck,Check,ChevronDown,Clock3,CreditCard,Gift,Headphones,ShieldCheck,ShoppingCart,Sparkles,Store,Truck,} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageSection } from '../components/PageSection';
import { SectionTitle } from '../components/SectionTitle';
import { MembershipModal } from '../components/MembershipModal';
import { getPlanOptions, type SubscriptionPlan } from '../plans';

type FaqItem = {
  question: string;
  answer: string;
};

type BenefitCard = {
  icon: typeof Gift;
  title: string;
  description: string;
};

type BrandPartner = {
  name: string;
  url: string;
  image: string;
};

const benefitCards: BenefitCard[] = [
  {
    icon: Gift,
    title: 'Descuentos exclusivos',
    description: 'Accede a precios preferenciales para tus pedidos recurrentes y volúmenes.',
  },
  {
    icon: Sparkles,
    title: 'Promociones especiales',
    description: 'Recibe lanzamientos y campañas de temporada antes que el resto del mercado.',
  },
  {
    icon: Headphones,
    title: 'Atención prioritaria',
    description: 'Nuestro equipo responde con mayor agilidad y soporte dedicado para tu negocio.',
  },
  {
    icon: Clock3,
    title: 'Renovación sencilla',
    description: 'Mantén tu membresía activa sin complicaciones y sin perder tus beneficios.',
  },
  {
    icon: ShoppingCart,
    title: 'Gestión de pedidos',
    description: 'Simplifica tus compras con herramientas pensadas para mayoristas y operaciones.',
  },
  {
    icon: Truck,
    title: 'Compras rápidas',
    description: 'Optimiza tiempos y prioriza entregas con una experiencia más ágil.',
  },
];

const brandPartners: BrandPartner[] = [
  { name: 'Uomo Cattivo', url: 'https://uomocattivo.com/', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNlxm0vLmPWcDXKI3qtD_OWlT4a7P6rXQB2PMt2ExjnAC7ZH4U91z4lGE&s=10' },
  { name: 'Maxeta', url: 'https://maxeta.com.pe/home-main-demo/', image: 'https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/315619417_435035002151541_688612049179694179_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x2048&ctp=s2048x2048&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=wBtDX3QgbJ4Q7kNvwE_GvCJ&_nc_oc=AdrQslr4IibAr_CRCq4FR0RD5-K0RC2ATrypdB2N0cg6O9RwxFydNpZY_epbuDm4YUY&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=w3SOhkX0ARgO0kB4UhPx2A&_nc_ss=7b289&oh=00_AQCtCJPkz9omgAz8LONaLMfipZeD5xJCTFGUYmbZTzNL6g&oe=6A6E9C78' },
  { name: 'Crepante', url: 'https://crepante.com/', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zQmT4V-w98N5ZK4s3xDh6KVhf7PO6JZBZUW03tF1MA&s=10' },
  { name: '3x100', url: 'https://3x100.pe/', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTybjRG-Uc3H8GH3o9tstN7yWGbXOHl-ne620_C88Bl8w&s=10' },
];

const timelineSteps = [
  {
    number: '01',
    icon: Store,
    title: 'Elegir un plan desde Beneficios o Contacto',
    description: 'Explora los planes y selecciona el que mejor se adapte a las necesidades de tu negocio.',
    bullets: ['Beneficios', 'Contacto'],
  },
  {
    number: '02',
    icon: BadgeCheck,
    title: 'Completar el formulario de registro',
    description: 'Registra tus datos para activar tu acceso exclusivo como mayorista.',
    bullets: ['Datos de empresa', 'Validación de cuenta'],
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Seleccionar el método de pago',
    description: 'Elige tu método de pago preferido y confirma la suscripción.',
    bullets: ['Pago seguro', 'Renovación automática'],
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'La membresía queda activa',
    description: 'Una vez confirmada, tus beneficios quedan habilitados desde el primer momento.',
    bullets: ['Descuentos activos', 'Soporte habilitado'],
  },
];

const faqItems: FaqItem[] = [
  {
    question: '¿La membresía tiene permanencia?',
    answer: 'No hay una permanencia obligatoria para que mantengas tu membresía activa mientras la renueves o la uses según tu plan.',
  },
  {
    question: '¿Puedo cambiar de plan?',
    answer: 'Sí, puedes actualizar tu membresía en cualquier momento desde el panel de suscripción o al contactar con nuestro equipo.',
  },
  {
    question: '¿Qué ocurre cuando vence?',
    answer: 'Tu acceso a los beneficios se mantiene hasta que finalice el periodo vigente. Luego puedes renovarlo fácilmente.',
  },
  {
    question: '¿El descuento se aplica automáticamente?',
    answer: 'Sí. Una vez activa tu membresía, los descuentos aplican automáticamente en tus compras mayoristas.',
  },
  {
    question: '¿Puedo cancelar la renovación automática?',
    answer: 'Sí, puedes desactivar la renovación automática desde tu perfil o solicitar asistencia para hacerlo.',
  },
  {
    question: '¿Necesito RUC?',
    answer: 'Para procesos de mayorista suele requerirse un RUC o documento de empresa para validar la membresía.',
  },
];

export const BenefitPage = () => {
  const plans = useMemo(() => getPlanOptions(), []);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlan['id']>('bronze');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleOpenMembershipModal = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    setIsMembershipModalOpen(true);
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageSection className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-black/55">Mayoristas</p>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.14em] text-black sm:text-4xl lg:text-[2.7rem]">
              Beneficios pensados para crecer junto a tu negocio
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base lg:text-lg">
              Descubre los planes, los descuentos y las ventajas exclusivas de pertenecer a la red de mayoristas de EZZETA.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
          {[
            { label: 'Planes', href: '#planes' },
            { label: 'Beneficios', href: '#beneficios' },
            { label: 'Marcas', href: '#marcas' },
            { label: 'Cómo ser mayorista', href: '#como-ser-mayorista' },
            { label: 'Preguntas frecuentes', href: '#preguntas-frecuentes' },
          ].map((item) => (
            <a key={item.href} href={item.href} className="rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black/70 transition-colors duration-200 hover:border-red-600 hover:text-red-600">
              {item.label}
            </a>
          ))}
        </div>
      </PageSection>

      <PageSection id="planes" className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <SectionTitle eyebrow="Planes" title="Conoce nuestros planes" align="center" className="mx-auto max-w-2xl" />
        <p className="text-center text-sm text-black/70 sm:text-base">
          Elige la membresía que mejor se adapte a tu negocio.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="group flex h-full flex-col rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-red-600/70 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-xl sm:h-12 sm:w-12 sm:text-2xl">
                    {plan.icono}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-black sm:text-xl">{plan.nombre}</h3>
                </div>
                <span className="rounded-xl border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-black/60">
                  {plan.duracion}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-semibold text-red-600 sm:text-4xl">S/{plan.precio}</p>
                <p className="mt-2 text-sm text-black/70">{plan.descuento}% de descuento</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-black/70">
                {plan.beneficios.slice(0, 3).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-red-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleOpenMembershipModal(plan)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-black bg-black px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-red-600 hover:bg-red-600"
              >
                Suscribirme
                <ArrowRight size={16} />
              </button>
            </motion.article>
          ))}
        </div>
      </PageSection>

      <PageSection id="beneficios" className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <SectionTitle eyebrow="Beneficios" title="Beneficios Mayorista" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {benefitCards.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group rounded-[1.4rem] border border-black/10 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/60 hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)] sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-red-600 sm:h-11 sm:w-11">
                  <Icon size={16} className="sm:h-[18px] sm:w-[18px]" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-black sm:text-lg">{benefit.title}</h3>
                <p className="mt-2 text-sm text-black/70">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </PageSection>

      <PageSection id="marcas" className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <SectionTitle eyebrow="Marcas" title="EZZETA, más de lo que esperas" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brandPartners.map((brand, index) => (
            <motion.a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-red-600/70 sm:p-5"
            >
              <div className="flex h-40 sm:min-h-40 items-center justify-center rounded-[1.2rem] bg-white p-4">
                <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-black">{brand.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-black/50">Marca aliada</p>
                </div>
                <span className="rounded-xl border border-black bg-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors group-hover:border-red-600 group-hover:bg-red-600">
                  Visitar
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </PageSection>

      <PageSection id="como-ser-mayorista" className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <SectionTitle eyebrow="Proceso" title="¿Cómo ser mayorista?" />
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-[1.35rem] border border-black/10 bg-white p-4 transition-colors hover:border-red-600/60 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-black sm:h-11 sm:w-11 sm:text-base">
                    {step.number}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-red-600 sm:h-11 sm:w-11">
                    <Icon size={16} className="sm:h-[18px] sm:w-[18px]" />
                  </div>
                </div>
                <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold text-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">{step.description}</p>
                <ul className="mt-3 sm:mt-4 space-y-2 text-sm text-black/70">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-red-600" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </PageSection>

      <PageSection id="preguntas-frecuentes" className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <SectionTitle eyebrow="Ayuda" title="Preguntas frecuentes" />
        <div className="mt-6 sm:mt-8 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = activeFaq === index;

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="overflow-hidden rounded-[1.15rem] border border-black/10 bg-white transition-colors hover:border-red-600/50"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                >
                  <span className="pr-2 text-sm leading-relaxed font-medium text-black">{item.question}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 text-black/60 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-5 pb-5 text-sm leading-relaxed text-black/70">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </PageSection>

      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        initialPlanId={selectedPlanId}
        initialFlowStep="account"
      />
    </div>
  );
};

export default BenefitPage;
