import './App.css'
import React, { useState } from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

function App() {
  const [display, setDisplay] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI('AIzaSyCUm7NBMqGqLeNoqTUhZk8kEy08FPts8GQ');
  const handleAskQuestion = async (display) => {

    const userMessage = display;
  
    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: userMessage, id: Date.now() }]);
    setDisplay(''); // Clear input right away
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response.text(), 
        id: Date.now() + 1 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, something went wrong. Please try again.', 
        id: Date.now() + 1 
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <motion.div className="intro">Hey there! How can I help you?</motion.div>
      <div className='chat'>
        <div className='input-wrapper'>
          <div className='chat-body'>
            {messages.map(message => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`message ${message.type}`}
              >
                {message.type === 'user' ? (
                  <div className="user-message">
                    <strong>You:</strong> {message.content}
                  </div>
                ) : (
                  <div className="ai-message">
                    <strong>AI:</strong>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div className="message_loading">
                <strong>AI:</strong> Thinking...
              </motion.div>
            )}
        </div>
          <div className='asking'>
            <input 
              className='textbox' 
              placeholder='Ask me anything.' 
              value={display || ''} // Add || '' to handle null
              onChange={(e) => setDisplay(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAskQuestion(display);
                }
              }}
            />
            <button className='send-button' onClick={() => handleAskQuestion(display)}>Ask</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
