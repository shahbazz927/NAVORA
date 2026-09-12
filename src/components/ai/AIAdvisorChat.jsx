import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Compass, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { sendAdvisorChat, buildAdvicePayload } from '../../lib/aiAdvisor';
import { getStudentContext } from '../../data/streamConfig';

// Timed greeting grounded in the user's own saved answers/context — a
// conversational opener, never hardcoded advice.
function buildGreeting(userType, context) {
  const area =
    context?.stream?.label ||
    context?.field?.label ||
    context?.stageLabel ||
    (userType === 'graduate' || userType === 'graduation'
      ? 'Graduate'
      : userType === 'parent'
        ? 'Parent'
        : userType === 'class12'
          ? 'Class 12'
          : userType === 'class10'
            ? 'Class 10'
            : 'student');
  const who = userType === 'parent' ? 'your child' : 'you';
  return `I've read what you shared about ${who} (${area}). Ask me anything — a follow-up on a career, a course, an exam, or what to do next. I'll keep everything grounded in your answers.`;
}

const QUICK_PROMPTS = [
  'What should I do next?',
  'Which of these suits me best?',
  'What are the realistic salaries?',
  'How do I get started?',
];

/**
 * NAVORA AI Career Advisor — interactive chat panel.
 * Grounded in the user's saved questionnaire answers/context. Unlike the
 * one-shot "get my career plan" card, lets the user keep asking follow-ups
 * in a real back-and-forth using the existing /api/advisor/chat backend.
 */
export default function AIAdvisorChat({ userType }) {
  const { answers } = useUser();

  // The assessment stores the normal Graduation journey as "graduation", while
  // the advisor + context engine speak "graduate". Map for consistency.
  const advisorUserType = userType === 'graduation' ? 'graduate' : userType;
  const context = advisorUserType ? getStudentContext(advisorUserType, answers) : null;

  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: buildGreeting(advisorUserType, context) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const lastSendRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (raw = input) => {
    const trimmed = String(raw || '').trim().slice(0, 500);
    if (!trimmed) return;
    const now = Date.now();
    if (now - lastSendRef.current < 1200) return; // rate-limit (F5)
    if (isTyping) return;
    if (messages.length >= 100) return; // bounded history (F9)
    lastSendRef.current = now;

    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setIsTyping(true);

    // Preserve FULL conversation history + profile on EVERY request (backend is stateless)
    const history = next.map((m) => ({ role: m.role, content: m.content }));
    try {
      let enriched = context && typeof context === 'object' ? { ...context } : {};
      try {
        const payload = buildAdvicePayload(advisorUserType, answers);
        if (payload?.resolvedProfile) enriched = { ...enriched, resolvedProfile: payload.resolvedProfile };
        // Ensure stage/stream/selections are preserved even if getStudentContext was null
        if (!enriched.stageLabel && payload?.summary?.stageLabel) enriched.stageLabel = payload.summary.stageLabel;
        if (!enriched.stream && payload?.summary?.streamLabel) enriched.stream = { label: payload.summary.streamLabel };
        if (!enriched.selections?.length && payload?.summary?.selections?.length) enriched.selections = payload.summary.selections;
      } catch {}
      const data = await sendAdvisorChat(history, advisorUserType, enriched);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.message || 'The AI advisor could not respond right now. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="bg-white border border-line rounded-[1.4rem] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-line bg-paper/50">
        <span className="inline-flex w-9 h-9 rounded-xl bg-brand-950 items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-cyan-300" />
        </span>
        <div className="min-w-0">
          <h4 className="font-ui font-bold text-ink leading-tight">Ask a follow-up</h4>
          <p className="text-xs text-ink-3 truncate">Kept grounded in your answers.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="px-5 sm:px-6 py-5 space-y-4 max-h-[26rem] overflow-y-auto">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            {m.role !== 'user' && (
              <span className="mt-1 mr-3 w-7 h-7 rounded-lg bg-brand-950 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-cyan-300" />
              </span>
            )}
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[80%] bg-brand-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm text-[0.92rem] leading-relaxed whitespace-pre-wrap'
                  : 'max-w-[85%] bg-paper border border-line rounded-2xl rounded-bl-md px-4 py-3 text-ink-2 text-[0.92rem] leading-relaxed whitespace-pre-wrap'
              }
            >
              {m.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <span className="mt-1 mr-3 w-7 h-7 rounded-lg bg-brand-950 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-cyan-300" />
            </span>
            <div className="bg-paper border border-line rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-brand-400"
                  style={{ animation: `typingDot 1.2s infinite ${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-5 sm:px-6 pb-2 -mt-1">
          <p className="eyebrow text-ink-3 mb-2">Try asking about</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-3.5 py-1.5 bg-white border border-line rounded-full text-xs font-medium text-ink-2 hover:border-brand-300 hover:text-ink hover:bg-brand-50/50 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 sm:px-6 py-4 border-t border-line">
        <div className="flex items-end gap-2.5">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value.slice(0, 500));
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about careers, courses, exams&hellip;"
              rows={1}
              maxLength={500}
              className="w-full px-4 py-3 bg-surface border border-line rounded-2xl text-[0.92rem] text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 resize-none transition-all leading-relaxed"
            />
          </div>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all shadow-brand shrink-0"
            aria-label="Send message"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="flex items-center gap-1 text-[0.68rem] text-ink-3 mt-2.5">
          <Sparkles className="w-3 h-3" /> Guidance for thinking, not a substitute for professional counselling.
        </p>
      </div>
    </div>
  );
}