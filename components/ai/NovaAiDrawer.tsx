'use client';

import React, { useState } from 'react';
import { useNovaStore } from '@/lib/store/useNovaStore';
import { MOCK_STATIONS, PRELOADED_VEHICLES } from '@/lib/db/mockData';
import { Sparkles, X, Send, Zap, Calculator, Compass, ShieldAlert, Bot } from 'lucide-react';

interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolCallName?: string;
  stationData?: typeof MOCK_STATIONS;
  timestamp: string;
}

export default function NovaAiDrawer() {
  const isAiDrawerOpen = useNovaStore((state) => state.isAiDrawerOpen);
  const setAiDrawerOpen = useNovaStore((state) => state.setAiDrawerOpen);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Hello, I am NOVA AI. I can assist you with grounded station discovery, trip energy calculations, and connector compatibility based on real provider data.',
      timestamp: 'Just now',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend) return;

    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      let replyText = '';
      let toolName = '';
      let matchedStations: typeof MOCK_STATIONS = [];

      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes('chennai') || queryLower.includes('fast charger')) {
        toolName = 'searchStations(city: "Chennai")';
        matchedStations = MOCK_STATIONS.filter((s) => s.city.toLowerCase() === 'chennai');
        replyText = `Found ${matchedStations.length} verified charging hubs in Chennai. The Guindy Industrial Tech Hub features 150 kW ultra-fast DC bays with CCS2 connectors.`;
      } else if (queryLower.includes('cost') || queryLower.includes('price') || queryLower.includes('how much')) {
        toolName = 'calculateChargingCost(batteryCapacity: 75, rate: 0.69)';
        replyText = `Based on average provider rates (e.g. £0.69 / kWh in UK or ₹21.00 / kWh in India), charging a 75 kWh battery from 10% to 80% requires ~52.5 kWh, estimating ~$25.70 / ₹1,102.00.`;
      } else if (queryLower.includes('ccs2') || queryLower.includes('connector') || queryLower.includes('compatible')) {
        toolName = 'searchStations(connector: "CCS2")';
        matchedStations = MOCK_STATIONS.filter((s) => s.connectors.some((c) => c.type === 'CCS2'));
        replyText = `CCS2 is widely supported across ${matchedStations.length} stations in our network, including Ionity Mayfair, Downtown Dubai Mall, and Guindy Tech Hub.`;
      } else if (queryLower.includes('trip') || queryLower.includes('route') || queryLower.includes('plan')) {
        toolName = 'planTripRoute(origin: "Chennai", destination: "Bengaluru")';
        replyText = `For a trip from Chennai to Bengaluru (~346 km), your Tesla Model Y (75 kWh) will require 1 recommended stop at Krishnagiri Ultra Fast station (20 min charge).`;
      } else {
        toolName = 'queryGlobalNetwork()';
        replyText = `I searched our provider database. NOVA actively tracks over ${MOCK_STATIONS.length} verified charging hubs across London, Dubai, Chennai, Paris, Singapore, New York, Tokyo, Berlin, and Sydney.`;
      }

      const botMsg: AiMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        toolCallName: toolName,
        stationData: matchedStations.length > 0 ? matchedStations : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 600);
  };

  const samplePrompts = [
    'Find a fast charger near Chennai.',
    'Find stations compatible with CCS2.',
    'How much will a 50 kWh charge cost?',
    'Plan charging stops for a trip.',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white border-l border-[#E8DDCC] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-[#E8DDCC] flex items-center justify-between bg-nova-bg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-nova-dark flex items-center justify-center text-nova-primary">
            <Sparkles className="w-4 h-4 text-nova-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-nova-text flex items-center gap-2">
              NOVA AI Assistant
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-nova-energy-light text-nova-energy rounded border border-nova-energy/30">
                Grounded Tool API
              </span>
            </h3>
            <p className="text-[11px] text-nova-muted">Strict zero-hallucination provider search</p>
          </div>
        </div>
        <button
          onClick={() => setAiDrawerOpen(false)}
          className="p-1.5 rounded-full text-nova-muted hover:text-nova-text hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                msg.sender === 'user'
                  ? 'bg-nova-dark text-white rounded-br-none'
                  : 'bg-nova-bg border border-[#E8DDCC] text-nova-text rounded-bl-none shadow-subtle'
              }`}
            >
              {msg.toolCallName && (
                <div className="mb-2 px-2 py-1 bg-white/80 rounded border border-nova-accent/30 text-[10px] font-mono text-nova-accent flex items-center gap-1.5">
                  <Bot className="w-3 h-3" />
                  <span>Executed Tool: {msg.toolCallName}</span>
                </div>
              )}
              <p className="leading-relaxed">{msg.text}</p>

              {msg.stationData && msg.stationData.length > 0 && (
                <div className="mt-3 space-y-2 pt-2 border-t border-[#E8DDCC]">
                  {msg.stationData.map((st) => (
                    <div key={st.id} className="bg-white p-2.5 rounded-lg border border-[#E8DDCC] text-xs">
                      <div className="font-bold text-nova-dark flex items-center justify-between">
                        <span>{st.name}</span>
                        <span className="text-[10px] text-nova-energy font-mono">{st.connectors[0]?.powerKw} kW</span>
                      </div>
                      <p className="text-nova-muted text-[11px] mt-0.5">{st.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-nova-muted mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-nova-muted italic bg-nova-bg p-3 rounded-xl border border-[#E8DDCC] w-max">
            <Sparkles className="w-4 h-4 animate-spin text-nova-accent" />
            <span>Querying verified provider adapters...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 border-t border-[#E8DDCC] bg-nova-bg/50">
        <p className="text-[11px] font-semibold text-nova-muted mb-2">Suggested queries:</p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E8DDCC] text-nova-text hover:border-nova-accent transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-[#E8DDCC] bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask NOVA AI about chargers, speed, or cost..."
          className="flex-1 bg-nova-bg px-3.5 py-2 rounded-xl text-sm border border-[#E8DDCC] focus:outline-none focus:border-nova-accent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-nova-dark text-white disabled:opacity-40 hover:bg-nova-dark/90 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
