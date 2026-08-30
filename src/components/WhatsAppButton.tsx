import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { HOTEL_CONTACT } from '../data/rooms';
import { trackAnalyticsEvent } from '../firebase';

interface WhatsAppButtonProps {
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ customMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userText, setUserText] = useState('');

  const defaultMsg = customMessage || HOTEL_CONTACT.defaultWhatsAppMessage;
  const directLink = `https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = userText.trim() || defaultMsg;
    trackAnalyticsEvent('contact_whatsapp', {
      method: 'custom_form',
      message_length: messageToSend.length
    });
    window.open(`https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodeURIComponent(messageToSend)}`, '_blank');
    setUserText('');
    setIsOpen(false);
  };

  const handleDirectClick = () => {
    trackAnalyticsEvent('contact_whatsapp', {
      method: 'direct_link'
    });
  };

  return (
    <div id="whatsapp-floating-container" className="fixed bottom-10 right-5 sm:bottom-12 sm:right-7 md:bottom-14 md:right-8 z-50 flex flex-col items-end">
      {/* Interactive Popup Box */}
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-emerald-600 px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  HP
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Hotel París Jaén - Recepción</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  En línea ahora
                </p>
              </div>
            </div>
            <button
              id="close-whatsapp-popup"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-stone-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-stone-200 text-stone-800 text-xs shadow-xs">
              <p className="font-medium text-emerald-800 mb-1">¡Hola! Bienvenido a Hotel París Jaén 🏨</p>
              <p className="text-stone-600">
                ¿Deseas consultar disponibilidad de habitaciones o hacer una consulta? Escríbenos directamente a nuestro WhatsApp oficial:
              </p>
              <div className="mt-2 text-[11px] font-mono text-stone-500 bg-stone-100 p-1.5 rounded text-center">
                {HOTEL_CONTACT.phoneFormatted}
              </div>
            </div>

            <form onSubmit={handleSendCustom} className="space-y-2 pt-1">
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder={defaultMsg}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                id="btn-submit-whatsapp-msg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar mensaje a WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Footer Quick Action */}
          <div className="bg-stone-100 px-4 py-2 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-500">
            <span>Atención rápida 24/7</span>
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDirectClick}
              className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              Abrir directo
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-3">
        {/* Label Tooltip */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 bg-stone-900/90 text-white text-xs font-medium py-1.5 px-3 rounded-full shadow-lg backdrop-blur-xs border border-stone-700 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>¿Consultas? Escríbenos</span>
          </div>
        )}

        <button
          id="btn-whatsapp-floating"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-white ring-4 ring-emerald-500/20"
          aria-label="Contactar por WhatsApp a Hotel París Jaén"
          title="WhatsApp Hotel París Jaén (+51 996 063 817)"
        >
          {isOpen ? (
            <X className="w-7 h-7 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          ) : (
            <>
              {/* Pulse ring */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              {/* WhatsApp SVG Icon */}
              <svg
                className="w-7 h-7 fill-current relative z-10"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.89 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
