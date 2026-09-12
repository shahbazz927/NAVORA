import { readFileSync, writeFileSync } from 'node:fs';

const c = readFileSync('server/server.mjs', 'utf8');

// 1. Extract ADVICE_SYSTEM_PROMPT
const startMarker = 'const ADVICE_SYSTEM_PROMPT = `';
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf('`;', startIdx) + 2;
const oldPrompt = c.substring(startIdx, endIdx);
writeFileSync('_oldprompt.txt', oldPrompt);
console.log('System prompt:', startIdx, '-', endIdx, 'len:', oldPrompt.length);

// 2. Extract buildUserPrompt
const start2 = c.indexOf('function buildUserPrompt(body)');
let depth = 0, end2 = start2;
for (let i = start2; i < c.length; i++) {
  if (c[i] === '{') depth++;
  if (c[i] === '}') { depth--; if (depth === 0) { end2 = i + 1; break; } }
}
// Find the function end (the closing brace of the function, not just the first })
// Actually let me just find from 'function buildUserPrompt' to the next '\n\tfunction'
let endFunc = c.indexOf('\n\tfunction', start2);
if (endFunc === -1) endFunc = c.indexOf('\n\tasync function', start2);
if (endFunc > end2) endFunc = end2;
const oldUser = c.substring(start2, endFunc);
writeFileSync('_olduserprompt.txt', oldUser);
console.log('User prompt:', start2, '-', endFunc, 'len:', oldUser.length);

// 3. Extract buildChatSystemPrompt
const start3 = c.indexOf('function buildChatSystemPrompt(context)');
let end3 = c.indexOf('\n\tfunction', start3);
if (end3 === -1) end3 = c.indexOf('\n\tasync function', start3);
const oldChat = c.substring(start3, end3);
writeFileSync('_oldchatprompt.txt', oldChat);
console.log('Chat prompt:', start3, '-', end3, 'len:', oldChat.length);
