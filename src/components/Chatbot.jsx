import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = ({ isOpen: propIsOpen, onToggle }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI companion. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const isControlled = propIsOpen !== undefined;
    const isOpen = isControlled ? propIsOpen : internalIsOpen;

    const handleToggle = () => {
        if (isControlled) {
            onToggle && onToggle(!isOpen);
        } else {
            setInternalIsOpen(!isOpen);
        }
    };

    const handleClose = () => {
        if (isControlled) {
            onToggle && onToggle(false);
        } else {
            setInternalIsOpen(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/chat', { message: input });
            const botMessage = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`chatbot-fab ${isOpen ? 'open' : ''}`}
                onClick={handleToggle}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>AI Companion</h3>
                        <button onClick={handleClose} className="close-chat">✕</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-content typing">...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
