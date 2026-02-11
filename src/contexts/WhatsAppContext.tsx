import { createContext, useContext, useState, type ReactNode } from 'react';

interface WhatsAppContextType {
  message: string;
  setMessage: (msg: string) => void;
  resetMessage: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider = ({ children }: { children: ReactNode }) => {
  const defaultMessage = "Olá! Vi um imóvel no site e gostaria de mais informações.";
  const [message, setMessage] = useState(defaultMessage);

  const resetMessage = () => setMessage(defaultMessage);

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
