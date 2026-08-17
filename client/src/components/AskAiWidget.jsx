import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiChatAlt2 } from "react-icons/hi";
import { IoClose, IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import axiosInstance from "../config/axiosInstance";

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
);

const CourseMiniCard = ({ course, navigate }) => (
    <div
        onClick={() => navigate("/course/description", { state: { data: course } })}
        className="flex items-center gap-3 p-2 rounded-lg bg-zinc-600/50 hover:bg-zinc-600 cursor-pointer transition-all duration-200 mt-2"
    >
        <img
            src={course?.thumbNail?.secure_url}
            alt={course?.title}
            className="w-12 h-12 rounded-md object-cover flex-shrink-0"
        />
        <div className="min-w-0">
            <p className="text-sm font-semibold text-yellow-500 truncate">{course?.title}</p>
            <p className="text-xs text-gray-400 truncate">{course?.category}</p>
        </div>
    </div>
);

const AskAiWidget = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Hi! I'm your course assistant. Ask me anything — like \"I want to learn React\" or \"best courses for data science\".",
            courses: [],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage = { role: "user", text: trimmed, courses: [] };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axiosInstance.post("/ask-ai", { query: trimmed });
            const { aiResponse, courses } = res.data;

            setMessages((prev) => [
                ...prev,
                { role: "ai", text: aiResponse, courses: courses || [] },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "Sorry, something went wrong. Please try again later.",
                    courses: [],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat Panel */}
            <div
                className={`fixed bottom-36 right-5 w-[380px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col z-[9999] transition-all duration-300 origin-bottom-right ${
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-4 pointer-events-none"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 rounded-t-2xl bg-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <FaRobot className="text-zinc-900 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm leading-tight">Ask AI</h3>
                            <p className="text-gray-400 text-xs">Course Assistant</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-700"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                    msg.role === "user"
                                        ? "bg-yellow-500 text-zinc-900 rounded-br-md"
                                        : "bg-zinc-700 text-white rounded-bl-md"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                {msg.courses && msg.courses.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {msg.courses.map((course) => (
                                            <CourseMiniCard key={course._id} course={course} navigate={navigate} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-700 rounded-2xl rounded-bl-md">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-3 py-3 border-t border-zinc-700 rounded-b-2xl">
                    <div className="flex items-center gap-2 bg-zinc-700 rounded-xl px-3 py-1.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about any course..."
                            disabled={loading}
                            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400 disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="text-zinc-900 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg p-2 transition-all duration-200 flex-shrink-0"
                        >
                            <IoSend size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`fixed bottom-20 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                    isOpen
                        ? "bg-zinc-700 hover:bg-zinc-600 rotate-0"
                        : "bg-yellow-500 hover:bg-yellow-400 hover:scale-110 hover:shadow-yellow-500/30 hover:shadow-xl"
                }`}
            >
                {isOpen ? (
                    <IoClose className="text-white text-2xl" />
                ) : (
                    <HiChatAlt2 className="text-zinc-900 text-2xl" />
                )}
            </button>
        </>
    );
};

export default AskAiWidget;
