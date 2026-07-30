import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Crown,
  CreditCard,
  MessageCircle,
  Package,
  Phone,
  Send,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import { chatbotResponses, type ChatMessage as ChatMessageType } from './chatbotResponses';
import { useAuth } from '../../context/AuthContext';

const createMessage = (sender: 'bot' | 'user', text: string): ChatMessageType => ({
  id: Date.now() + Math.random(),
  sender,
  text,
  date: new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }),
});

const getBotResponse = (query: string) => {
  const normalized = query.toLowerCase();

  if (
    normalized.includes('producto') ||
    normalized.includes('productos') ||
    normalized.includes('ropa') ||
    normalized.includes('camisa') ||
    normalized.includes('camiseta') ||
    normalized.includes('polo') ||
    normalized.includes('casaca') ||
    normalized.includes('chaqueta')
  ) {
    return chatbotResponses.products;
  }

  if (normalized.includes('talla') || normalized.includes('tamaño')) {
    return chatbotResponses.sizes;
  }

  if (normalized.includes('stock') || normalized.includes('disponible')) {
    return chatbotResponses.availability;
  }

  if (
    normalized.includes('envio') ||
    normalized.includes('envíos') ||
    normalized.includes('delivery') ||
    normalized.includes('despacho')
  ) {
    return chatbotResponses.shipping;
  }

  if (normalized.includes('pago') || normalized.includes('pagar') || normalized.includes('tarjeta')) {
    return chatbotResponses.payment;
  }

  if (
    normalized.includes('plan') ||
    normalized.includes('planes') ||
    normalized.includes('membres') ||
    normalized.includes('descuento') ||
    normalized.includes('mayorista')
  ) {
    return chatbotResponses.membership;
  }

  if (normalized.includes('carrito') || normalized.includes('compra')) {
    return chatbotResponses.cart;
  }

  if (normalized.includes('devol') || normalized.includes('cambio')) {
    return chatbotResponses.returns;
  }

  if (normalized.includes('favorito') || normalized.includes('favoritos') || normalized.includes('wishlist')) {
    return chatbotResponses.wishlist;
  }

  if (normalized.includes('horario') || normalized.includes('atienden')) {
    return chatbotResponses.schedule;
  }

  if (normalized.includes('gracias')) {
    return chatbotResponses.thanks;
  }

  if (normalized.includes('adios') || normalized.includes('adiós') || normalized.includes('chau') || normalized.includes('hasta luego')) {
    return chatbotResponses.goodbye;
  }

  return chatbotResponses.unknown;
};

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) return;

    const greeting = user?.username
      ? `Hola ${user.username} 👋

Soy el asistente virtual de Ezzeta.

Veo que perteneces al programa mayorista.

¿En qué puedo ayudarte hoy?`
      : chatbotResponses.welcome;

    setMessages([createMessage('bot', greeting)]);
  }, [messages.length, user?.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, createMessage('bot', text)]);
  };

  const clearConversation = () => {
    const greeting = user?.username
      ? `Hola ${user.username} 👋

Soy el asistente virtual de Ezzeta.

¿En qué puedo ayudarte hoy?`
      : chatbotResponses.welcome;

    setMessages([createMessage('bot', greeting)]);
  };

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    setMessages((prev) => [...prev, createMessage('user', text)]);
    setInput('');

    window.setTimeout(() => {
      addBotMessage(getBotResponse(text));
    }, 500);
  };

  const handleQuickResponse = (type: string) => {
    switch (type) {
      case 'products':
        addBotMessage(chatbotResponses.products);
        break;
      case 'shipping':
        addBotMessage(chatbotResponses.shipping);
        break;
      case 'payment':
        addBotMessage(chatbotResponses.payment);
        break;
      case 'membership':
        addBotMessage(chatbotResponses.membership);
        break;
      case 'advisor':
        window.open('https://wa.me/51933141678?text=Hola,%20necesito%20ayuda%20en%20UomoCattivo', '_blank', 'noopener,noreferrer');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:bottom-6 z-[999] flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl"
        aria-label="Abrir asistente virtual"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-2 right-2 left-2 z-[999] flex flex-col h-[88vh] w-auto flex-col overflow-hidden rounded-2xl border border-red-600 bg-[#101010] shadow-2x1
                      sm:left-auto sm:bottom-24 sm:right-6 sm:h-[650px] sm:w-[380px] sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-black px-4 sm:px-5 py-3 sm:py-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">Asistente Ezzeta</h2>
                <p className="text-xs text-white/50">Siempre disponible</p>
              </div>
              <button
                onClick={clearConversation}
                className="rounded-full p-2 text-white/70 transition hover:bg-white/10"
                aria-label="Limpiar conversación"
              ><Trash2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/70 transition hover:bg-red-600 hover:text-white"
              ><X size={18}/>
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3 sm:grid-cols-2">
              <button
                onClick={() => handleQuickResponse('products')}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs sm:text-sm text-white transition hover:bg-red-600"
              >
                <Package size={18} />
                Productos
              </button>
              <button
                onClick={() => handleQuickResponse('shipping')}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs sm:text-sm text-white transition hover:bg-red-600"
              >
                <Truck size={18} />
                Envíos
              </button>
              <button
                onClick={() => handleQuickResponse('payment')}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs sm:text-sm text-white transition hover:bg-red-600"
              >
                <CreditCard size={18} />
                Pagos
              </button>
              <button
                onClick={() => handleQuickResponse('membership')}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs sm:text-sm text-white transition hover:bg-red-600"
              >
                <Crown size={18} />
                Planes
              </button>
              <a
                href="https://wa.me/51933141678?text=Hola,%20necesito%20ayuda%20en%20UomoCattivo"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-green-600 p-3 font-medium text-white transition hover:bg-green-500"
              >
                <Phone size={18} />
                Hablar por WhatsApp
              </a>
            </div>

            <div className="flex gap-2 border-t border-white/10 bg-black p-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Escribe tu consulta..."
                className="flex-1 min-h-0 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none placeholder:text-white/40"/>

              <button
                onClick={sendMessage}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
                aria-label="Enviar mensaje">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;