import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ExtractionUploadCard from './components/ExtractionUploadCard';
import AgentProgress from './components/AgentProgress';
import ExtractionCostCard from './components/ExtractionCostCard';
import ExtractionResult, { extractionResult, resultToText } from './components/ExtractionResult';
import ReplyActions from './components/ReplyActions';
import EntryDocument from './components/EntryDocument';
import EntryWriteResult from './components/EntryWriteResult';
import EntryConversation from './components/EntryConversation';
import PublishButton from './components/PublishButton';
import RechargeContent from './components/RechargeContent';
import WorldbookHome from './components/WorldbookHome';
import { planEntryWrite, applyEntryWrite, mockEntries } from './utils/mockEntries';
import { estimateExtractionCost } from './utils/extractionPricing';
import { getDemoScenario, createRechargeDemoMessages, rechargeDemoFile } from './utils/demoScenarios';
import { isWriteCommand, isDraftConfirmation, startEntryDraft, refineEntryDraft, draftReply, planDraftWrite } from './utils/entryConversation';
import './styles.css';

const storageKey = 'star-worldbook-v1';
const starter = {
  name: '未命名',
  summary: '',
  source: '',
  entries: [],
  introduction: '',
  sections: {},
  files: [],
  published: false,
  freeCredits: 1500,
  personalCredits: 0,
  hasSpentFreeCredits: false,
};

function createBlankBook(scenarioId = 'free', openDraft = false) {
  const scenario = getDemoScenario(scenarioId);
  const book = { ...starter, id: crypto.randomUUID(), entries: [], sections: {}, files: [], demoScenario: scenarioId, freeCredits: scenario.credits, personalCredits: scenario.personalCredits || 0 };
  if (!openDraft) return book;
  const writes = mockEntries.filter(entry => ['mock-world', 'mock-mark', 'mock-ranbing', 'mock-return'].includes(entry.id));
  return { ...applyEntryWrite(book, writes), hasSpentFreeCredits: scenarioId === 'recharge', files: [rechargeDemoFile] };
}

function Icon({ name, size = 16, className = '' }) {
  return <img className={`icon ${className}`} src={`/assets/${name}.png`} width={size} height={size} alt="" draggable="false" />;
}

function IconButton({ name, label, onClick, className = '', size = 16, ...props }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} {...props}><Icon name={name} size={size} /></button>;
}

const sectionNames = ['简介', '核心设定', '相关角色', '重要词条', '角色关系'];
const introductionTemplate = '<p><strong>定义描述：</strong></p><p>用于说明该世界的基本运行规则，包括世界如何形成、力量从何而来、角色如何成长，以及不同能力之间如何相互制衡。是整个世界观所有设定、剧情、角色能力的底层运行依据。</p><p><strong>示例：</strong></p><p>《西游记》的世界由天、地、人、幽冥等多重空间共同构成，秩序核心是以玉皇大帝统摄的天庭体系、以如来佛祖为代表的佛门体系，以及人间王朝、山川洞府、龙宫地府等地方性势力共同运转。凡人、神仙、妖怪、龙族、鬼魂都处在同一套因果与修行规则中，身份不同，受到的约束也不同。</p>';
function escapeText(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
const categories = [
  { name: '概览', icon: 'overview' },
  { name: '世界设定', icon: 'world' },
  { name: '剧情事件', icon: 'down' },
  { name: '角色档案', icon: 'characters' },
  { name: '关系网', icon: 'relationships' },
];
const prompts = [
  { title: '从我的抖音作品开始', description: '从视频里梳理出设定，一起搭出世界', prompt: '我想从我的抖音作品开始创建世界书。' },
  { title: '我有完整的 IP 作品或资料', description: '从正片、剧本或设定集中整理作品设定', prompt: '我已有成熟 IP 内容，帮我提炼成完整世界观', action: 'extract-files' },
  { title: '我只有一个点子', description: '帮我找到最值得展开的线索，边聊边搭出世界', prompt: '我只有一个点子，想和你一起把它展开成一个世界。' },
];

function WorldbookEditor({ onHome, demoScenario = 'free', guidedDemo = false, openDraft = false }) {
  const [book, setBook] = useState(() => createBlankBook(demoScenario, openDraft));
  const [active, setActive] = useState(() => openDraft ? '角色档案' : '概览');
  const [activeEntry, setActiveEntry] = useState(() => openDraft ? 'mock-mark' : null);
  const [editing, setEditing] = useState(true);
  const [rename, setRename] = useState(false);
  const [nameDraft, setNameDraft] = useState(book.name);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const [modal, setModal] = useState(null);
  const [rechargeRequestId, setRechargeRequestId] = useState(null);
  const [entryName, setEntryName] = useState('');
  const [entryType, setEntryType] = useState('世界设定');
  const [toast, setToast] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => openDraft ? createRechargeDemoMessages(book) : []);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [agentBusy, setAgentBusy] = useState(false);
  const [notice, setNotice] = useState(true);
  const [chatMenu, setChatMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(guidedDemo);
  const [attached, setAttached] = useState([]);
  const [moreMenu, setMoreMenu] = useState(false);
  const [publishName, setPublishName] = useState(book.name === '未命名' ? '' : book.name);
  const [publishSummary, setPublishSummary] = useState(book.summary);
  const fileInput = useRef(null);
  const coverInput = useRef(null);
  const inputRef = useRef(null);
  const documentRef = useRef(null);
  const chatRef = useRef(null);
  const chatScrollInitialized = useRef(false);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const sourceFiles = useRef(new Map());
  const agentTimers = useRef(new Set());
  const agentLock = useRef(false);
  const actionLocks = useRef(new Set());

  useEffect(() => () => {
    agentTimers.current.forEach(clearTimeout);
    agentTimers.current.clear();
  }, []);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(book)); }
    catch { setToast('浏览器存储空间不足，请导出世界书保存'); }
  }, [book]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: chatScrollInitialized.current ? 'smooth' : 'instant' });
    chatScrollInitialized.current = true;
  }, [messages]);
  useEffect(() => {
    if (!modal) return;
    previousFocus.current = document.activeElement;
    dialogRef.current?.querySelector('input, button')?.focus();
    function onKey(event) {
      if (event.key === 'Escape') setModal(null);
      if (event.key === 'Tab') {
        const nodes = [...dialogRef.current.querySelectorAll('button, input, select, textarea, [tabindex="0"]')];
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [modal]);

  function update(patch) { setBook(current => ({ ...current, ...patch })); }
  function selectCategory(name) {
    setActive(name);
    setActiveEntry(null);
    setSidebarOpen(false);
    documentRef.current?.scrollTo({ top: 0 });
  }
  function selectEntry(entry) {
    setActive(entry.type);
    setActiveEntry(entry.id);
    setSidebarOpen(false);
    documentRef.current?.scrollTo({ top: 0 });
  }
  function openWrittenEntry(id) {
    const entry = book.entries.find(item => item.id === id);
    if (!entry) { setToast('此词条已不可用'); return; }
    selectEntry(entry);
    setAssistantOpen(false);
  }
  function updateEntry(id, patch) {
    setBook(current => ({ ...current, entries: current.entries.map(item => item.id === id ? { ...item, ...patch } : item) }));
  }
  function renderDirectoryEntries(items, parentId = null) {
    const roots = query ? items : items.filter(item => (item.parentId || null) === parentId || (parentId === null && !items.some(parent => parent.id === item.parentId)));
    return roots.map(item => <React.Fragment key={item.id}>
      <button className={`directory-item child ${activeEntry === item.id ? 'selected' : ''}`} onClick={() => selectEntry(item)}><Icon name="file" /><span>{item.name}</span></button>
      {!query && items.some(child => child.parentId === item.id) && <div className="directory-children nested">{renderDirectoryEntries(items, item.id)}</div>}
    </React.Fragment>);
  }
  function saveName() {
    const value = nameDraft.trim();
    if (value) update({ name: value });
    else setNameDraft(book.name);
    setRename(false);
  }
  function openCreate(type = '世界设定') {
    setEntryType(type === '概览' || type === '关系网' ? '世界设定' : type);
    setEntryName('');
    setModal('create');
  }
  function createEntry(event) {
    event.preventDefault();
    if (!entryName.trim()) return;
    const entry = { id: crypto.randomUUID(), type: entryType, name: entryName.trim(), content: '' };
    update({ entries: [...book.entries, entry] });
    setCollapsed(current => ({ ...current, [entryType]: false }));
    selectEntry(entry);
    setModal(null);
    setToast('词条已创建');
  }
  function addFiles(event) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    const files = registerFiles(selected);
    setAttached(current => [...current, ...files]);
    setToast(`已添加 ${files.length} 个文件`);
    event.target.value = '';
  }
  function uploadCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setToast('请选择图片文件'); return; }
    if (file.size > 3 * 1024 * 1024) { setToast('请选择小于 3 MB 的图片'); return; }
    const reader = new FileReader();
    reader.onload = () => update({ cover: reader.result });
    reader.readAsDataURL(file);
    event.target.value = '';
  }
  function submitMessage(event) {
    event.preventDefault();
    if (!input.trim() || agentLock.current) return;
    const value = input.trim();
    const confirmsDraft = pendingDraft?.ready && isDraftConfirmation(value);
    if (isWriteCommand(value) || confirmsDraft) {
      const instruction = value.split(/[：:]/)[0];
      const namedOther = book.entries.some(entry => instruction.includes(entry.name) && entry.id !== pendingDraft?.id);
      const useDraft = pendingDraft && !namedOther;
      const payload = value.match(/[：:]\s*([\s\S]+)/)?.[1]?.trim();
      const writes = useDraft ? planDraftWrite(book, payload ? refineEntryDraft(pendingDraft, payload) : pendingDraft) : planEntryWrite(book, value, activeEntry);
      setMessages(current => [...current, { id: crypto.randomUUID(), role: 'user', text: value, files: attached }]);
      if (!writes.length) {
        respondAfterProcessing({ text: '请先创建或打开一个词条，再告诉我需要写入的内容。也可以输入“写入词条”，导入完整的示例词条。' });
        setInput('');
        setAttached([]);
        setChatMenu(false);
        return;
      }
      const compact = writes.length === 1;
      respondAfterProcessing({ kind: 'entry-write-result', text: compact ? `已为你${writes[0].status === '新建' ? '创建' : '更新'}「${writes[0].name}」词条草稿，可以打开确认内容，再继续补充设定。` : `已为你写入${writes.length}个词条，请打开词条进行内容确认`, writes, compact, platformCovered: Boolean(useDraft) || book.entries.length > 0 }, false, null, () => {
        setBook(current => applyEntryWrite(current, writes));
        if (useDraft) setPendingDraft(null);
        setCollapsed(current => ({ ...current, [writes[0].type]: false }));
        setActive(writes[0].type);
        setActiveEntry(writes[0].id);
        documentRef.current?.scrollTo({ top: 0 });
      });
      setInput('');
      setAttached([]);
      setChatMenu(false);
      return;
    }
    const startsAnother = /(创建|新建|新增|再.*建)/.test(value) && /(角色|人物|词条|设定|事件|世界|故事)/.test(value);
    const startingDraft = !pendingDraft || startsAnother ? startEntryDraft(book, value, activeEntry) : null;
    if (pendingDraft || startingDraft) {
      const draft = startingDraft || refineEntryDraft(pendingDraft, value);
      setPendingDraft(draft);
      setMessages(current => [...current, { id: crypto.randomUUID(), role: 'user', text: value, files: attached }]);
      respondAfterProcessing(draftReply(draft, book));
      setInput('');
      setAttached([]);
      setChatMenu(false);
      return;
    }
    if (/(提炼|解析|资料|\bIP\b)/i.test(value)) {
      startExtraction(value);
      return;
    }
    let reply;
    if (value.includes('抖音')) reply = '可以先把你想整理的作品链接、视频文字稿或故事梗概发给我。你最希望先梳理世界背景、角色，还是剧情事件？';
    else reply = '先试着用三句话描述你的世界：故事发生在哪里、主角想要什么、有什么阻碍？你可以将这些想法写入「简介」，再逐步创建世界设定与角色档案。当前助手为本地引导演示。';
    setMessages(current => [...current, { id: crypto.randomUUID(), role: 'user', text: value, files: attached }]);
    respondAfterProcessing({ text: reply });
    setInput('');
    setAttached([]);
    setChatMenu(false);
  }
  function respondAfterProcessing(response, analyzeFiles = false, replaceId = null, onComplete = null) {
    agentLock.current = true;
    setAgentBusy(true);
    const id = replaceId || crypto.randomUUID();
    const progress = {
      id, state: 'running', phase: 0, startedAt: Date.now(), platformCovered: response.platformCovered,
      steps: [
        { icon: 'agent-brain', text: '深度思考中' },
        { icon: 'agent-search', text: analyzeFiles ? '正在分析文件' : '正在梳理需求' },
        { icon: 'agent-plan', text: '正在规划生成路径' },
      ],
    };
    const reply = { ...response, id, role: 'assistant', progress };
    setMessages(current => replaceId ? current.map(message => message.id === replaceId ? reply : message) : [...current, reply]);
    const duration = analyzeFiles ? 1400 : 900;
    for (let phase = 1; phase <= 3; phase++) {
      const timer = setTimeout(() => {
        agentTimers.current.delete(timer);
        setMessages(current => current.map(message => message.id === id ? {
          ...message, progress: { ...message.progress, phase: Math.min(phase, 2), ...(phase === 3 ? { state: 'complete', finishedAt: Date.now() } : {}) },
        } : message));
        if (phase === 3) { onComplete?.(); agentLock.current = false; setAgentBusy(false); }
      }, duration * phase);
      agentTimers.current.add(timer);
    }
  }
  function registerFiles(selected) {
    const files = selected.map(file => {
      const id = crypto.randomUUID();
      sourceFiles.current.set(id, file);
      return { id, name: file.name, path: file.webkitRelativePath || file.name, size: file.size, type: file.type, lastModified: file.lastModified, source: 'local' };
    });
    setBook(current => ({ ...current, files: [...current.files, ...files] }));
    return files;
  }
  function startExtraction(text = prompts[1].prompt) {
    if (agentLock.current) return;
    setMessages(current => [...current, { id: crypto.randomUUID(), role: 'user', text, files: [] }]);
    respondAfterProcessing({ kind: 'file-request', text: '可以的，你直接把需要解析总结的材料内容发过来就行～\n我能先拆解核心信息，再给你精简总结。', files: attached, submitted: false });
    setInput('');
    setAttached([]);
    setChatMenu(false);
    setAssistantOpen(true);
  }
  function handleStarterPrompt(prompt) {
    if (prompt.action === 'extract-files') startExtraction(prompt.prompt);
    else { setInput(prompt.prompt); inputRef.current?.focus(); }
  }
  function updateFileRequest(requestId, transform) {
    setMessages(current => current.map(message => message.id === requestId && !message.submitted ? transform(message) : message));
  }
  function collectExtractionFiles(requestId, selected) {
    const request = messages.find(message => message.id === requestId);
    if (!request || request.submitted) return;
    const seen = new Set(request.files.filter(file => file.source !== 'douyin').map(file => `${file.path || file.name}:${file.size}:${file.lastModified}`));
    const unique = selected.filter(file => {
      const key = `${file.webkitRelativePath || file.name}:${file.size}:${file.lastModified}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!unique.length) { if (selected.length) setToast('这些文件已经添加'); return; }
    const files = registerFiles(unique);
    updateFileRequest(requestId, message => ({ ...message, files: [...message.files, ...files] }));
  }
  function collectDouyinWork(requestId, url) {
    const request = messages.find(message => message.id === requestId);
    if (!request || request.submitted) return;
    if (request.files.some(file => file.url === url)) { setToast('这个作品已经添加'); return; }
    const work = { id: crypto.randomUUID(), name: '抖音作品 · ' + url, url, source: 'douyin' };
    updateFileRequest(requestId, message => ({ ...message, files: [...message.files, work] }));
  }
  function removeExtractionFile(requestId, fileId) {
    updateFileRequest(requestId, message => ({ ...message, files: message.files.filter(file => file.id !== fileId) }));
  }
  function removeAllExtractionFiles(requestId) {
    updateFileRequest(requestId, message => ({ ...message, files: [] }));
  }
  function reorderExtractionFile(requestId, fileId, direction) {
    updateFileRequest(requestId, message => {
      const files = [...message.files];
      const index = files.findIndex(file => file.id === fileId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= files.length) return message;
      files.splice(target, 0, files.splice(index, 1)[0]);
      return { ...message, files };
    });
  }
  function submitExtractionFiles(requestId) {
    const request = messages.find(message => message.id === requestId);
    if (!request || request.submitted || !request.files.length || agentLock.current || actionLocks.current.has(requestId)) return;
    actionLocks.current.add(requestId);
    setMessages(current => current.map(message => message.id === requestId ? { ...message, submitted: true } : message));
    respondAfterProcessing({ kind: 'cost-confirmation', requestId, files: [...request.files], confirmed: false, quotedFreeCredits: book.freeCredits, quotedPersonalCredits: book.personalCredits }, true);
  }
  function reselectExtractionFiles(costId) {
    const cost = messages.find(message => message.id === costId);
    if (!cost || cost.confirmed || cost.superseded || agentLock.current || actionLocks.current.has(costId)) return;
    actionLocks.current.add(costId);
    setMessages(current => current.map(message => message.id === costId ? { ...message, superseded: true } : message));
    respondAfterProcessing({ kind: 'file-request', text: '可以重新调整文件，确认后我会重新核算星光消耗。', files: [...cost.files], submitted: false });
  }
  function confirmExtractionCost(costId, rechargedCredits = 0) {
    const cost = messages.find(message => message.id === costId);
    if (!cost || cost.confirmed || cost.superseded || agentLock.current || actionLocks.current.has(costId)) return;
    const payableCredits = Math.max(0, estimateExtractionCost(cost.files) - book.freeCredits);
    if (payableCredits > book.personalCredits + rechargedCredits) {
      setRechargeRequestId(costId);
      setModal('recharge');
      return;
    }
    actionLocks.current.add(costId);
    if (estimateExtractionCost(cost.files) >= book.freeCredits) setNotice(false);
    setMessages(current => current.map(message => message.id === costId ? { ...message, confirmed: true, quotedFreeCredits: message.quotedFreeCredits ?? book.freeCredits, quotedPersonalCredits: message.quotedPersonalCredits ?? book.personalCredits } : message));
    const deductCredits = () => setBook(current => {
      const freeCredits = Math.max(0, current.freeCredits - estimateExtractionCost(cost.files));
      return { ...current, freeCredits, personalCredits: current.personalCredits - Math.max(0, estimateExtractionCost(cost.files) - current.freeCredits), hasSpentFreeCredits: current.hasSpentFreeCredits || freeCredits < current.freeCredits };
    });
    if (rechargedCredits > 0) {
      setBook(current => ({ ...current, personalCredits: current.personalCredits + rechargedCredits }));
      setModal(null);
      setRechargeRequestId(null);
      setToast(`充值成功，已到账 ${rechargedCredits} 星光`);
    } else deductCredits();
    respondAfterProcessing({ kind: 'extraction-result', costId, result: extractionResult }, true, null, rechargedCredits > 0 ? deductCredits : null);
  }
  function completeDemoRecharge(credits) {
    if (modal !== 'recharge' || !Number.isInteger(credits) || credits <= 0) return;
    if (!rechargeRequestId) {
      setBook(current => ({ ...current, personalCredits: current.personalCredits + credits }));
      setModal(null);
      setToast(`充值成功，已到账 ${credits} 星光`);
      return;
    }
    confirmExtractionCost(rechargeRequestId, credits);
  }
  async function copyReply(message) {
    try {
      const node = chatRef.current?.querySelector(`[data-message-id="${message.id}"]`);
      const text = message.writes ? [message.text, ...message.writes.map(entry => `${entry.name}（${entry.status}）\n位置：${entry.type}\n${entry.content}`)].join('\n\n') : message.kind === 'entry-conversation' ? [...message.paragraphs, ...(message.bullets || []).map(text => `• ${text}`), message.closing].filter(Boolean).join('\n\n') : message.result ? resultToText(message.result) : Array.from(node?.querySelectorAll('p, h3, .extraction-upload-header li, .extraction-file-info strong, .message-file') || []).map(item => item.innerText).filter(Boolean).join('\n\n');
      await navigator.clipboard.writeText(text);
      setToast('回复已复制');
    } catch { setToast('复制失败，请选择文字后复制'); }
  }
  function retryReply(messageId) {
    const message = messages.find(item => item.id === messageId);
    if (!message || message.role !== 'assistant' || agentLock.current) return;
    respondAfterProcessing({ ...message, feedback: null }, message.kind === 'cost-confirmation' || message.kind === 'extraction-result', message.id);
  }
  function feedbackReply(messageId, feedback) {
    setMessages(current => current.map(message => message.id === messageId ? { ...message, feedback: message.feedback === feedback ? null : feedback } : message));
  }
  function publish(event) {
    event.preventDefault();
    if (!publishName.trim()) return;
    update({ name: publishName.trim(), summary: publishSummary.trim(), published: true, publishedAt: new Date().toISOString() });
    setNameDraft(publishName.trim());
    setEditing(false);
    setModal(null);
    setToast('已在本地保存发布版本');
  }
  function exportBook() {
    const content = [`# ${book.name}`, book.summary, `来源：${book.source}`, '', '## 简介', book.introduction || '', ...sectionNames.slice(1).flatMap(name => ['', `## ${name}`, book.sections[name] || '']), ...book.entries.flatMap(entry => ['', `## ${entry.type} · ${entry.name}`, entry.content])].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${book.name}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMoreMenu(false);
    setToast('世界书已导出');
  }
  function startNewChat() {
    agentTimers.current.forEach(clearTimeout);
    agentTimers.current.clear();
    agentLock.current = false;
    actionLocks.current.clear();
    setAgentBusy(false);
    setPendingDraft(null);
    setMessages([]); setInput(''); setAttached([]); setChatMenu(false); inputRef.current?.focus();
  }
  const entry = book.entries.find(item => item.id === activeEntry);
  const showOverview = active === '概览';
  const displayedEntries = book.entries.filter(item => item.type === active);
  const hasExtraction = messages.some(message => message.kind === 'file-request');
  const hasExtractionResult = messages.some(message => message.kind === 'extraction-result');
  const rechargeRequest = messages.find(message => message.id === rechargeRequestId);
  const rechargeRequired = rechargeRequest ? Math.max(0, estimateExtractionCost(rechargeRequest.files) - book.freeCredits - book.personalCredits) : 0;

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="global-header">
        <button className="brand home-link" aria-label="返回世界书首页" onClick={onHome}>
          <img src="/assets/logo.png" alt="抖音" className="douyin-logo" />
          <img src="/assets/worldbook-logo.png" alt="世界书" className="worldbook-logo" />
        </button>
        <div className="header-actions">
          <button className="mobile-nav-button icon-button" onClick={() => { setSidebarCollapsed(false); setSidebarOpen(!sidebarOpen); }} aria-label="打开世界书目录"><Icon name="workspace" /></button>
          <button className="mobile-assistant-button icon-button" onClick={() => setAssistantOpen(!assistantOpen)} aria-label="打开 AI 助手"><Icon name="new-chat" /></button>
          <button className="credits-button" onClick={() => setModal('credits')} aria-label={`星光余额 ${book.personalCredits}`}><Icon name="credits" size={14} /><span>{book.personalCredits}</span></button>
          <IconButton name="bell" label="通知" onClick={() => setModal('notifications')} />
          <button className="avatar-button" onClick={() => setModal('account')} aria-label="个人信息"><img src="/assets/avatar.png" alt="我的头像" /></button>
        </div>
      </header>

      <div className="workspace">
        {sidebarOpen && <button className="mobile-backdrop" aria-label="关闭目录" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="世界书目录">
          <div className="sidebar-toolbar">
            <IconButton name="workspace" label="世界书管理" onClick={() => setModal('books')} />
            <div className="book-switcher">
              <img src="/assets/mini-cover.png" alt="" className="mini-cover" />
              {rename ? <input className="rename-input" aria-label="世界书名称" autoFocus value={nameDraft} maxLength={40} onChange={event => setNameDraft(event.target.value)} onBlur={saveName} onKeyDown={event => { if (event.key === 'Enter') saveName(); if (event.key === 'Escape') { setNameDraft(book.name); setRename(false); } }} /> : <button className="book-name" title="点击重命名" onClick={() => { setNameDraft(book.name); setRename(true); }}>{book.name}</button>}
              <IconButton name="switch" label="切换世界书" onClick={() => setModal('books')} />
            </div>
            <IconButton name="layout" label="收起目录" onClick={() => { if (innerWidth < 640) setSidebarOpen(false); else setSidebarCollapsed(true); }} />
          </div>
          <div className="directory">
            <div className="directory-heading"><span>世界书目录</span><IconButton name="search" label="搜索目录" onClick={() => setSearching(!searching)} size={15} /></div>
            {searching && <div className="directory-search"><Icon name="search" size={14} /><input autoFocus aria-label="搜索词条" placeholder="搜索词条" value={query} onChange={event => setQuery(event.target.value)} /><button className="plain-button" aria-label="清空搜索" onClick={() => setQuery('')}>×</button></div>}
            <nav>
              {categories.map(category => {
                const children = book.entries.filter(item => item.type === category.name && (!query || item.name.toLowerCase().includes(query.toLowerCase())));
                if (query && !children.length && !category.name.includes(query)) return null;
                return <div className="directory-group" key={category.name}>
                  <button className={`directory-item ${active === category.name && !activeEntry ? 'selected' : ''}`} onClick={() => selectCategory(category.name)}>
                    {category.name === '剧情事件' ? <span className="collapse-icon" onClick={event => { event.stopPropagation(); setCollapsed(current => ({ ...current, [category.name]: !current[category.name] })); }}><Icon name={category.icon} className={collapsed[category.name] ? 'rotated' : ''} /></span> : <Icon name={category.icon} />}
                    <span>{category.name}</span>
                  </button>
                  {!collapsed[category.name] && children.length > 0 && <div className="directory-children">
                    {renderDirectoryEntries(children)}
                  </div>}
                </div>;
              })}
              {query && !book.entries.some(item => item.name.includes(query)) && !categories.some(item => item.name.includes(query)) && <p className="search-empty">未找到相关词条</p>}
            </nav>
          </div>
          <div className="sidebar-footer"><button className="library-button" onClick={() => setModal('library')}><Icon name="folder" /><span>资料库</span></button><IconButton name="help" label="使用帮助" onClick={() => setModal('help')} /></div>
        </aside>

        <main className={`main-panel ${entry ? 'has-entry' : ''}`} aria-label="世界书编辑区">
          <div className="document-background" />
          <div className="document-toolbar">
            <div className="document-tabs" role="tablist" aria-label="内容分类">
              <button className={`document-tab ${active === '世界设定' && !entry ? 'active' : ''}`} role="tab" aria-selected={active === '世界设定' && !entry} onClick={() => selectCategory('世界设定')}><Icon name="world-tab" size={12} /><span>世界设定</span></button>
              {entry ? <button className="document-tab active" role="tab" aria-selected="true" onClick={() => selectEntry(entry)}><span>{entry.name}</span></button> : <button className={`document-tab ${showOverview ? 'active' : ''}`} role="tab" aria-selected={showOverview} onClick={() => selectCategory('概览')}><Icon name="overview-tab" size={12} /><span>概览</span></button>}
              <IconButton name="plus" label="新增词条" size={14} className="add-entry-button" onClick={() => openCreate(active)} />
            </div>
            <div className="edit-actions">{entry && <div className="more-wrapper"><IconButton name="more" label="更多文档操作" size={14} onClick={() => { setMoreMenu(!moreMenu); }} />{moreMenu && <div className="dropdown document-menu"><button onClick={exportBook}>导出为 Markdown</button><button onClick={() => { setMoreMenu(false); openCreate(active); }}>新增词条</button></div>}</div>}<button className="secondary-button" onClick={() => { setEditing(!editing); setToast(editing ? '内容已自动保存在本地' : '已进入编辑模式'); }}>{editing ? '退出编辑' : '编辑'}</button><PublishButton published={book.published} onClick={() => { setPublishName(book.name === '未命名' ? '' : book.name); setPublishSummary(book.summary); setModal('publish'); }} /></div>
          </div>
          {!entry && <div className="document-subbar"><span>{active}</span><div className="more-wrapper"><IconButton name="more" label="更多文档操作" size={14} onClick={() => setMoreMenu(!moreMenu)} />{moreMenu && <div className="dropdown document-menu"><button onClick={exportBook}>导出为 Markdown</button><button onClick={() => { setMoreMenu(false); openCreate(active); }}>新增词条</button></div>}</div></div>}
          <div className="outline-rail" aria-label="文档章节导航">{Array.from({ length: entry?.blocks?.length || 11 }, (_, index) => <button key={index} className={index === 0 ? 'current' : ''} aria-label={`跳转到${entry?.blocks?.[index]?.heading || sectionNames[Math.min(4, Math.floor(index / 2))]}`} onClick={() => document.getElementById(entry ? `entry-section-${index}` : `section-${Math.min(4, Math.floor(index / 2))}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span /></button>)}</div>
          <div className="document-scroll" ref={documentRef}>
            {showOverview ? <article className="document">
              <div className="document-heading">
                <button className="cover-button" aria-label="上传世界书封面" title="上传封面" disabled={!editing} onClick={() => coverInput.current?.click()}><img className={book.cover ? 'uploaded-cover' : ''} src={book.cover || '/assets/cover.png'} alt={book.cover ? '世界书封面' : ''} /></button>
                <div className="document-heading-text">
                  <h1 contentEditable={editing} suppressContentEditableWarning role={editing ? 'textbox' : undefined} aria-label="编辑世界书标题" onBlur={event => { const value = event.currentTarget.textContent.trim(); update({ name: value || '未命名' }); }} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } }}>{book.name}</h1>
                  <div className="document-meta"><span>概述：<span className={book.summary ? '' : 'muted'}>{book.summary || '暂无概述'}</span></span><i /><span>来源：{book.source || '暂无来源'}</span></div>
                </div>
              </div>
              <section id="section-0" className="intro-section">
                <h2>简介</h2>
                <div className={`introduction ${book.introduction ? 'has-content' : ''}`} contentEditable={editing} suppressContentEditableWarning role={editing ? 'textbox' : undefined} aria-label="编辑简介" onFocus={event => { event.currentTarget.dataset.before = event.currentTarget.innerText; }} onBlur={event => { if (event.currentTarget.innerText !== event.currentTarget.dataset.before) update({ introduction: event.currentTarget.innerText.trim() }); }} dangerouslySetInnerHTML={{ __html: book.introduction ? escapeText(book.introduction) : introductionTemplate }} />
              </section>
              {sectionNames.slice(1).map((name, index) => <section className="empty-section" id={`section-${index + 1}`} key={name}><h2 onClick={event => { if (editing) event.currentTarget.nextElementSibling?.focus(); }}>{name}</h2><div className="section-content" contentEditable={editing} suppressContentEditableWarning role={editing ? 'textbox' : undefined} aria-label={`编辑${name}`} data-placeholder={`点击补充${name}`} onBlur={event => update({ sections: { ...book.sections, [name]: event.currentTarget.innerText.trim() } })}>{book.sections[name] || ''}</div></section>)}
            </article> : entry ? <EntryDocument key={entry.id} entry={entry} editing={editing} onUpdate={patch => updateEntry(entry.id, patch)} /> : <article className="document category-document"><h1>{active}</h1><p className="category-description">{{ 世界设定: '在这里搭建世界的规则，让每一段故事都有据可循。', 剧情事件: '记录故事中的重要事件，串联你的世界。', 角色档案: '让每一个角色，都拥有自己的故事。', 关系网: '记录角色之间的联系，梳理世界中的关系。' }[active]}</p><div className="entry-list">{displayedEntries.map(item => <button key={item.id} onClick={() => selectEntry(item)}><Icon name="file" /><span>{item.name}</span><Icon name="arrow" /></button>)}</div><button className="secondary-button create-category-entry" onClick={() => openCreate(active)}><Icon name="plus" size={14} />新建{active === '关系网' ? '关系词条' : active === '世界设定' ? '设定' : active === '角色档案' ? '角色' : '事件'}</button></article>}
          </div>
        </main>

        <aside className={`assistant-panel ${assistantOpen ? 'is-open' : ''}`} aria-label="世界书 AI 助手">
          <div className="assistant-toolbar"><div className="chat-menu-wrapper"><button className="new-conversation" onClick={() => setChatMenu(!chatMenu)}>新对话<Icon name="chevron" size={14} /></button>{chatMenu && <div className="dropdown chat-menu"><button onClick={startNewChat}>开始新对话</button><button onClick={() => { setChatMenu(false); setModal('assistant'); }}>关于世界书助手</button></div>}</div><IconButton name="new-chat" label="开始新对话" size={14} onClick={startNewChat} /><button className="close-mobile-assistant plain-button" aria-label="关闭 AI 助手" onClick={() => setAssistantOpen(false)}>×</button></div>
          <div className={`assistant-conversation ${messages.length ? 'with-messages' : ''} ${hasExtraction ? 'with-extraction' : ''} ${hasExtractionResult ? 'with-extraction-result' : ''}`} ref={chatRef}>
            {messages.length ? <div className="messages">{messages.map(message =>
              <div className={`message ${message.role} ${message.role === 'assistant' ? 'extraction-response' : ''}`} key={message.id} data-message-id={message.id}>
                {message.progress && <AgentProgress progress={message.progress} />}
                {message.progress?.state !== 'running' && <>
                  {message.kind === 'cost-confirmation' ? <ExtractionCostCard request={message} busy={agentBusy} freeCredits={book.freeCredits} personalCredits={book.personalCredits} recharging={modal === 'recharge' && rechargeRequestId === message.id} onReselect={reselectExtractionFiles} onConfirm={confirmExtractionCost} /> : message.kind === 'extraction-result' ? <ExtractionResult message={message} /> : message.kind === 'entry-write-result' ? <EntryWriteResult message={message} onSelect={openWrittenEntry} /> : message.kind === 'entry-conversation' ? <EntryConversation message={message} /> : <>
                    <p>{message.text}</p>
                    {message.kind === 'file-request' ? <ExtractionUploadCard request={message} sourceFiles={sourceFiles.current} onFiles={collectExtractionFiles} onWork={collectDouyinWork} onRemove={removeExtractionFile} onRemoveAll={removeAllExtractionFiles} onReorder={reorderExtractionFile} onSubmit={submitExtractionFiles} /> : message.files?.map(file => <span className="message-file" key={file.id}><Icon name={file.source === 'douyin' ? 'upload-douyin' : 'folder'} size={14} />{file.name}</span>)}
                  </>}
                  {message.role === 'assistant' && <ReplyActions message={message} busy={agentBusy} onCopy={copyReply} onRetry={retryReply} onFeedback={feedbackReply} />}
                </>}
              </div>
            )}</div> : <div className="assistant-welcome"><div className="welcome-copy"><h2>Hi～为你的作品创建「世界书」吧</h2><p>「世界书」会帮你整理和记住作品里的世界观、角色和剧情，方便查设定、续写故事或做二创。</p></div><div className="starter-prompts">{prompts.map(prompt => <button className="starter-card" key={prompt.title} onClick={() => handleStarterPrompt(prompt)}><span><strong>{prompt.title}</strong><small>{prompt.description}</small></span><Icon name="arrow" /></button>)}</div></div>}
          </div>
          <div className="composer-area">
            {notice && book.freeCredits > 0 && getDemoScenario(demoScenario).credits > 0 && book.demoScenario !== 'platform' && <div className="credit-notice"><span className="free-badge"><img src="/assets/free-credit-label.png" width={18.9} height={9.35} alt="限免" /></span><span>{book.hasSpentFreeCredits ? <>剩余 <strong>{book.freeCredits}</strong> 限免星光</> : <>恭喜获得 <strong>{book.freeCredits}</strong> 限免星光，可用于创建当前世界书</>}</span><button className="notice-close plain-button" aria-label="关闭限免提示" onClick={() => setNotice(false)}>×</button></div>}
            <form className="composer" onSubmit={submitMessage}>
              {attached.length > 0 && <div className="attached-files">{attached.map(file => <span key={file.id}><Icon name="file" size={12} />{file.name}<button type="button" aria-label={`移除附件 ${file.name}`} onClick={() => setAttached(current => current.filter(item => item.id !== file.id))}>×</button></span>)}</div>}
              <textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} placeholder="请输入你的想法" aria-label="请输入你的想法" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submitMessage(event); } }} />
              <div className="composer-toolbar"><div className="composer-tools"><IconButton name="attach" label="添加附件" size={14} onClick={() => fileInput.current?.click()} /><span className="tool-divider" /><IconButton name="mention" label="引用世界书词条" size={14} className="mention-button" onClick={() => setModal('mention')} /><button type="button" className="composer-library" onClick={() => setModal('library')}><Icon name="folder" /><span>素材库</span></button></div><button type="submit" className="send-button" disabled={!input.trim() || agentBusy} aria-label="发送消息"><Icon name="send" size={14} /></button></div>
            </form>
          </div>
        </aside>
      </div>
      <input ref={fileInput} type="file" className="visually-hidden" tabIndex={-1} multiple onChange={addFiles} />
      <input ref={coverInput} type="file" className="visually-hidden" tabIndex={-1} accept="image/*" onChange={uploadCover} />
      {toast && <div className={`toast ${toast.startsWith('充值成功') ? 'recharge-success-toast' : ''}`} role="status">{toast.startsWith('充值成功') ? <img src="/assets/toast-success.png" width={20} height={20} alt="" /> : <span className="toast-check">✓</span>}{toast}</div>}
      {modal && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setModal(null); }}><div className={`modal ${modal === 'library' ? 'library-modal' : ''} ${modal === 'recharge' ? 'recharge-modal' : ''}`} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" aria-label="关闭弹窗" onClick={() => setModal(null)}>×</button>
        {modal === 'recharge' && <RechargeContent required={rechargeRequired} balance={book.personalCredits} onPaid={completeDemoRecharge} />}
        {modal === 'create' && <><h2 id="modal-title">新增词条</h2><p className="modal-description">将世界里的每一个细节，记录在这里。</p><form onSubmit={createEntry}><label>词条类型<select value={entryType} onChange={event => setEntryType(event.target.value)}><option>世界设定</option><option>剧情事件</option><option>角色档案</option></select></label><label>词条名称<input value={entryName} onChange={event => setEntryName(event.target.value)} placeholder="为词条起一个名字" maxLength={60} required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>取消</button><button className="primary-button" disabled={!entryName.trim()}>创建词条</button></div></form></>}
        {modal === 'publish' && <><h2 id="modal-title">发布世界书</h2><p className="modal-description">为你的世界起一个名字，补充一句概述。</p><form onSubmit={publish}><label>世界书名称<input value={publishName} onChange={event => setPublishName(event.target.value)} placeholder="请输入世界书名称" maxLength={40} required /></label><label>世界概述<textarea value={publishSummary} onChange={event => setPublishSummary(event.target.value)} placeholder="用一句话介绍你的世界" rows={3} maxLength={200} /></label><p className="local-note">当前为本地演示，发布版本仅保存在此浏览器中。</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>取消</button><button className="primary-button" disabled={!publishName.trim()}>保存发布版本</button></div></form></>}
        {modal === 'library' && <><h2 id="modal-title">资料库</h2><p className="modal-description">管理创作参考资料，或将文件附加到对话中。</p><button className="upload-zone" onClick={() => fileInput.current?.click()}><Icon name="folder" size={24} /><strong>点击添加资料</strong><span>支持图片、视频、文档等文件</span></button>{book.files.length ? <div className="library-files">{book.files.map(file => <div className="library-file" key={file.id}><Icon name="file" /><div><strong>{file.name}</strong><small>{file.size < 1024 ? `${file.size} B` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`}</small></div><button className="secondary-button" onClick={() => { if (!attached.some(item => item.id === file.id)) setAttached(current => [...current, file]); setModal(null); inputRef.current?.focus(); }}>引用</button><button className="plain-button remove-file" aria-label={`删除资料 ${file.name}`} onClick={() => { update({ files: book.files.filter(item => item.id !== file.id) }); setAttached(current => current.filter(item => item.id !== file.id)); }}>×</button></div>)}</div> : <p className="library-empty">还没有资料，从第一份灵感开始吧。</p>}<p className="local-note">当前仅记录文件信息，文件内容不会上传或自动解析。</p></>}
        {modal === 'mention' && <><h2 id="modal-title">引用词条</h2><p className="modal-description">选择词条，把它加入当前对话。</p><div className="mention-list">{book.entries.map(item => <button key={item.id} onClick={() => { setInput(current => `${current}${current ? ' ' : ''}@${item.name} `); setModal(null); inputRef.current?.focus(); }}><Icon name="file" /><span>{item.name}</span><small>{item.type}</small></button>)}</div></>}
        {modal === 'help' && <><h2 id="modal-title">开始创建你的世界书</h2><div className="help-content"><p>点击世界书名称或文档标题，即可重命名。</p><p>在「概览」中编辑简介，补充核心设定、相关角色与重要词条。</p><p>点击顶部「＋」创建词条，通过左侧目录随时查找。</p><p>在右侧输入想法，或添加资料，开始梳理故事。</p><p>所有内容自动保存在此浏览器，可从文档的「更多」菜单导出。</p></div><button className="primary-button help-confirm" onClick={() => setModal(null)}>开始创作</button></>}
        {modal === 'books' && <><h2 id="modal-title">我的世界书</h2><button className="current-book-card" onClick={() => setModal(null)}><img src={book.cover || '/assets/cover.png'} alt="" /><span><strong>{book.name}</strong><small>{book.published ? '已保存发布版本' : '草稿'} · {book.entries.length} 个词条</small></span><span className="current-label">当前</span></button><p className="local-note">当前世界书保存在此浏览器中。</p></>}
        {modal === 'credits' && <><h2 id="modal-title">我的星光</h2><div className="credits-detail"><Icon name="credits" size={24} /><strong>{book.personalCredits}</strong><span>当前星光余额</span></div>{book.freeCredits > 0 && <p className="modal-description">世界书助手限时减免剩余 {book.freeCredits} 星光，用于创作当前世界书。</p>}<p className="local-note">本地演示不会产生费用。</p></>}
        {modal === 'notifications' && <><h2 id="modal-title">通知</h2><div className="notification-empty"><Icon name="bell" size={24} /><p>暂无新通知</p></div></>}
        {modal === 'account' && <><h2 id="modal-title">个人信息</h2><div className="account-detail"><img src="/assets/avatar.png" alt="我的头像" /><strong>世界书创作者</strong><span>把每一个灵感，写成一个世界。</span></div></>}
        {modal === 'assistant' && <><h2 id="modal-title">世界书助手</h2><p className="modal-description">帮你梳理作品的世界观、角色与剧情。</p><p className="help-content">当前页面使用本地引导回复，尚未连接 AI 服务。你可以选择灵感卡片、引用词条，或将想法写入世界书。</p></>}
      </div></div>}
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(() => location.hash);
  const [demoScenario, setDemoScenario] = useState(() => {
    try { return getDemoScenario(localStorage.getItem('star-demo-scenario')).id; }
    catch { return 'free'; }
  });
  function selectDemoScenario(id) {
    setDemoScenario(id);
    try { localStorage.setItem('star-demo-scenario', id); } catch {}
  }
  useEffect(() => {
    const onHashChange = () => setRoute(location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const creating = /^#\/create(?:\/|$)/.test(route);
  const routeParams = new URLSearchParams(route.split('?')[1]);
  const routeScenario = routeParams.get('scenario');
  const openDraft = routeParams.get('draft') === 'linglong' && ['recharge', 'platform'].includes(routeScenario);
  return creating
    ? <WorldbookEditor key={route} demoScenario={getDemoScenario(routeScenario).id} guidedDemo={Boolean(routeScenario)} openDraft={openDraft} onHome={() => { location.hash = '/'; }} />
    : <WorldbookHome demoScenario={demoScenario} onDemoScenarioChange={selectDemoScenario} onCreate={mode => { location.hash = `/create/${mode}?scenario=${demoScenario}`; }} onOpenDraft={() => { location.hash = `/create/world?scenario=${demoScenario}&draft=linglong`; }} />;
}

createRoot(document.getElementById('root')).render(<App />);
