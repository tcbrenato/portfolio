import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { askGroq } from '../api/chatbot';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis l'assistant IA de Rénato TCHOBO, créateur de solutions digitales au Bénin. Je peux répondre à toutes vos questions sur ses services (développement web, applications mobiles, UI/UX design, SEO, e-commerce), ses tarifs, son expérience et comment le contacter. Que souhaitez-vous savoir ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Message de chargement
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Je réfléchis...',
      isBot: true,
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await askGroq(currentInput);

      // Remplacer le message de chargement par la réponse
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: (Date.now() + 2).toString(),
            text: response,
            isBot: true,
            timestamp: new Date(),
            isLoading: false
          };
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Erreur chatbot:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            id: (Date.now() + 3).toString(),
            text: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
            isBot: true,
            timestamp: new Date(),
            isLoading: false
          };
        }
        return newMessages;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Quels sont les services proposés par Rénato ?',
    'Quel est le prix d\'un site web ?',
    'Comment puis-je contacter Rénato ?',
    'Quelles technologies utilise-t-il ?',
    'Combien de temps prend un projet ?',
    'Propose-t-il du SEO ?'
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300 hover:scale-110 animate-bounce-gentle"
          aria-label="Ouvrir le chat IA"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-96'
        } animate-slide-up`}>
          {/* Header */}
          <div className="bg-primary-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold">Assistant IA Rénato</h3>
                <p className="text-xs text-primary-100">Propulsé par Groq & Llama3</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors duration-200"
                aria-label={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors duration-200"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs ${
                      message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isBot ? 'bg-primary-100' : 'bg-blue-100'
                      }`}>
                        {message.isBot ? (
                          <Bot className="h-4 w-4 text-primary-500" />
                        ) : (
                          <User className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg shadow-sm ${
                        message.isBot 
                          ? 'bg-white text-gray-800 border border-gray-200' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">
                          {message.isLoading ? (
                            <span className="flex items-center space-x-1">
                              <span>Je réfléchis</span>
                              <span className="flex space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </span>
                            </span>
                          ) : (
                            message.text
                          )}
                        </p>
                        <p className={`text-xs mt-1 ${
                          message.isBot ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Questions rapides */}
              {messages.length === 1 && (
                <div className="px-4 pb-2 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Questions suggérées :</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(question);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="text-xs bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200 transition-colors duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question à l'IA..."
                    disabled={isTyping}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Envoyer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Propulsé par Groq & Llama3
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
