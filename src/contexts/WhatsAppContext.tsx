import { createContext, useContext, useState, type ReactNode } from 'react';
import { WHATSAPP_DEFAULT_MESSAGE } from '../constants';

interface WhatsAppContextType {
  message: string;
  setMessage: (msg: string) => void;
  resetMessage: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState(WHATSAPP_DEFAULT_MESSAGE);
  const resetMessage = () => setMessage(WHATSAPP_DEFAULT_MESSAGE);

  return (
    <WhatsAppContext.Provider value={{ message, setMessage, resetMessage }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp deve ser usado dentro de um WhatsAppProvider');
  }
  return context;
};
