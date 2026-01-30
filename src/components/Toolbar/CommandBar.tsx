'use client';

import { useState, useRef, useEffect } from "react";
import { Mic, Send, MicOff, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";

export default function CommandBar() {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef<any>(null);

    const { nodes, edges, setNodes, setEdges } = useStore(useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        setNodes: state.setNodes,
        setEdges: state.setEdges,
    })));

    useEffect(() => {
        if ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert("Speech recognition not supported in this browser.");
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: input,
                    currentFlow: { nodes, edges },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate flow");
            }

            const data = await response.json();

            if (data.nodes) setNodes(data.nodes);
            if (data.edges) setEdges(data.edges);

            setInput("");
        } catch (error) {
            console.error("AI Error:", error);
            alert("Failed to update flow. See console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl items-center">
                <button
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-colors border group ${isListening
                            ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse"
                            : "bg-white/5 hover:bg-teal-accent/20 text-teal-accent border-white/5 hover:border-teal-accent/30"
                        }`}
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-2 font-medium outline-none"
                    placeholder={isListening ? "Listening..." : "Describe a flow or say 'Add a trigger'..."}
                />

                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-3 rounded-xl bg-teal-accent hover:bg-teal-600 text-white transition-colors shadow-lg shadow-teal-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
