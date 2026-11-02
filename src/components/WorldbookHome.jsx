import React, { useEffect, useState } from 'react';
import '../home.css';
import { demoScenarios, getDemoScenario } from '../utils/demoScenarios';

const filters = ['已加入', '全部', '灵异', '科幻', '历史', '武侠', '悬疑', '现代都市', '萌系治愈', '潮流文化', '虚拟偶像世界'];
const examples = [
  { id: 'rulin', name: '儒林外史', category: '历史', description: '唐僧师徒西天取经，一路历经九九八十一难，降妖伏魔，终成正果。' },
  { id: 'goose', name: '鹅鸭杀', category: '潮流文化', description: '在看似平静的鹅群中寻找隐藏的鸭子，用角色能力、线索与合作揭开真相。' },
  { id: 'backrooms', name: '后室', category: '灵异', description: '无尽延伸的黄色走廊、未知的层级与实体，构成一个迷失于现实之外的世界。' },
  { id: 'tragic', name: '悲惨世界', category: '历史', description: '命运、信念与时代交织，记录人物在苦难中的选择和对希望的追寻。' },
  { id: 'zelda', name: '塞尔达传说', category: '科幻', description: '探索海拉鲁的辽阔天地，寻找古老遗迹，与伙伴一起揭开王国的秘密。' },
  { id: 'tragic-2', cover: 'tragic', name: '悲惨世界', category: '现代都市', description: '从角色经历出发，梳理命运交织的故事、人物关系与重要事件。' },
  { id: 'flowers', name: '镜花缘', category: '武侠', description: '奇国异俗、百花传说与远行见闻，共同构成瑰丽奇幻的东方世界。' },
  { id: 'journey', name: '西游记', category: '武侠', description: '唐僧师徒西天取经，一路历经九九八十一难，降妖伏魔，终成正果。' },
  { id: 'alice', name: '爱丽丝梦游仙境', category: '萌系治愈', description: '跟随爱丽丝进入奇妙仙境，在不可思议的角色与规则中展开冒险。' },
  { id: 'goose-2', cover: 'goose', name: '鹅鸭杀 · 角色设定', category: '悬疑', description: '用独特的角色身份和能力编织悬疑故事，串联行动、线索与人物关系。' },
  { id: 'alice-2', cover: 'alice', name: '仙境来信', category: '虚拟偶像世界', description: '为角色建立完整的身份、性格和成长经历，让每一次登场都有故事。' },
  { id: 'backrooms-2', cover: 'backrooms', name: '后室 · 探索手册', category: '灵异', description: '记录层级特征、通行路线与未知实体，为下一次探索保存线索。' },
];
const features = [
  ['整理世界和角色', '将视频与文稿，提炼为统一的设定与素材', 'organize'],
  ['邀请同好一起完善', '多人补充设定和创意，让角色和世界越做越完整', 'collaborate'],
  ['创作资料随时可查', '角色性格、人物关系和重要设定集中保存，不怕记错', 'search'],
  ['后续创作直接使用', '在创作工具中调用角色和世界设定，减少跑偏和冲突', 'use'],
];

export default function WorldbookHome({ onCreate, onOpenDraft, demoScenario, onDemoScenarioChange }) {
  const hasDraft = ['recharge', 'platform'].includes(demoScenario);
  const personalCredits = getDemoScenario(demoScenario).personalCredits || 0;
  const [filter, setFilter] = useState('全部');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState('');
  const [joined, setJoined] = useState(() => {
    try { const value = JSON.parse(localStorage.getItem('star-joined-examples')); return Array.isArray(value) ? value : []; }
    catch { return []; }
  });
  useEffect(() => {
    if (!preview) return;
    const previous = document.activeElement;
    const dialog = document.getElementById('home-preview');
    dialog?.querySelector('button')?.focus();
    function onKey(event) {
      if (event.key === 'Escape') setPreview(null);
      if (event.key === 'Tab') {
        const buttons = [...dialog.querySelectorAll('button')];
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [preview]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(timer);
  }, [notice]);
  const visible = examples.filter(item => (filter === '全部' || (filter === '已加入' ? joined.includes(item.id) : item.category === filter)) && item.name.includes(query.trim()));
  function toggleJoined(item) {
    const next = joined.includes(item.id) ? joined.filter(id => id !== item.id) : [...joined, item.id];
    setJoined(next);
    try { localStorage.setItem('star-joined-examples', JSON.stringify(next)); }
    catch { setNotice('浏览器存储空间不足'); }
  }
  return <div className="home-page">
    <header className="global-header">
      <div className="brand"><img src="/assets/logo.png" alt="抖音" className="douyin-logo" /><img src="/assets/worldbook-logo.png" alt="世界书" className="worldbook-logo" /></div>
      <div className="header-actions">
        <button className="credits-button" onClick={() => setNotice(`当前星光余额 ${personalCredits}`)} aria-label={`星光余额 ${personalCredits}`}><img className="icon" src="/assets/credits.png" width="14" height="14" alt="" /><span>{personalCredits}</span></button>
        <button className="icon-button" aria-label="通知" onClick={() => setNotice('暂无新通知')}><img className="icon" src="/assets/bell.png" width="16" height="16" alt="" /></button>
        <button className="avatar-button" aria-label="个人信息" onClick={() => setNotice('世界书创作者')}><img src="/assets/avatar.png" alt="我的头像" /></button>
      </div>
    </header>
    <main className="home-scroll">
      <div className="home-container">
        <section className="home-hero" aria-labelledby="home-title">
          <img className="home-book-outline" src="/assets/home/book-outline.png" alt="" />
          <h1 id="home-title">世界书</h1>
          <p className="home-subtitle">把零散素材和灵感整理成一份可反复使用和迭代的「创作说明书」邀请同好一起完善，后续创作随时查看、直接使用</p>
          {!hasDraft && <div className="home-create-options">
            {[['world', '从一个故事或设定开始', '塑造若干角色和关系网、搭建世界设定、构思情节', '示例世界'], ['character', '从一个角色开始', '塑造独立角色形象、丰富角色设定、放大角色名场面', '示例角色']].map(([mode, title, description, example]) => <div className={`home-create-card ${mode}`} key={mode}>
              <span className="home-create-icon"><img src={`/assets/home/create-${mode}.png`} alt="" /></span>
              <div className="home-create-copy"><h2>{title}</h2><p>{description} <button className="home-example-link" onClick={() => setPreview({ id: `example-${mode}`, name: example, description: mode === 'world' ? '将世界背景、角色档案、剧情事件与关系网整理在一起，让创作有据可循。' : '集中记录角色的身份、性格、经历与关联人物，让角色的每一次行动都有依据。', cover: mode === 'world' ? 'journey' : 'alice' })}><span className="home-example-icon" aria-hidden="true" />{example}</button></p></div>
              <button className="home-create-button" aria-label={mode === 'world' ? '从故事或设定去创建' : '从角色去创建'} onClick={() => onCreate(mode)}>去创建</button>
            </div>)}
          </div>}
        </section>
        {hasDraft ? <section className="home-projects" aria-label="我的项目">
          <h2>我的项目</h2>
          <div className="home-book-grid">
            <button className="home-new-project" onClick={() => onCreate('world')}><span aria-hidden="true">＋</span>新建项目</button>
            <button className="home-draft-card home-book-card" onClick={onOpenDraft} aria-label="打开灵笼草稿">
              <span className="home-draft-cover"><img src="/assets/home/linglong.webp" alt="灵笼封面" /><span className="home-draft-badge">草稿</span></span>
              <span className="home-book-info"><span className="home-book-title"><strong>灵笼</strong></span><span className="home-draft-meta">创建时间：2026年7月8日<br />内容分类：科幻</span></span>
            </button>
          </div>
        </section> : <section className="home-features" aria-label="世界书功能">
          {features.map(([title, description, image]) => <article key={image}><h2>{title}</h2><p>{description}</p><img src={`/assets/home/feature-${image}.png`} alt={title} /></article>)}
        </section>}
        <section className="home-library" aria-label="发现世界书">
          <div className="home-library-toolbar">
            <nav className="home-filters" aria-label="世界书分类">{filters.map(name => <button key={name} className={filter === name ? 'active' : ''} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name}</button>)}</nav>
            <label className="home-search"><img src="/assets/search.png" alt="" /><input aria-label="搜索世界书" placeholder="搜索" value={query} onChange={event => setQuery(event.target.value)} /></label>
          </div>
          <div className="home-book-grid">{visible.map(item => <button className="home-book-card" key={item.id} onClick={() => setPreview(item)} aria-label={`查看世界书 ${item.name}`}>
            <img src={`/assets/home/${item.cover || item.id}.png`} alt={`${item.name}封面`} />
            <span className="home-book-info"><span className="home-book-title"><strong>{item.name}</strong><small>312篇词条</small></span><span className="home-book-description">{item.description}</span></span>
          </button>)}</div>
          {!visible.length && <p className="home-empty">{filter === '已加入' && !query ? '还没有加入的世界书，打开感兴趣的世界书加入吧。' : '没有找到相关世界书'}</p>}
        </section>
      </div>
    </main>
    <aside className="demo-scenario-switcher" aria-label="演示场景">
      <div className="demo-scenario-row"><div role="group" aria-label="切换演示场景">{demoScenarios.map((scenario, index) => <button type="button" key={scenario.id} aria-pressed={demoScenario === scenario.id} onClick={() => onDemoScenarioChange(scenario.id)}>{index + 1}. {scenario.label}</button>)}</div></div>
    </aside>
    {notice && <div className="toast" role="status">{notice}</div>}
    {preview && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setPreview(null); }}><div id="home-preview" className="modal home-preview" role="dialog" aria-modal="true" aria-labelledby="home-preview-title">
      <button className="modal-close" aria-label="关闭弹窗" onClick={() => setPreview(null)}>×</button>
      <img className="home-preview-cover" src={`/assets/home/${preview.cover || preview.id}.png`} alt="" />
      <h2 id="home-preview-title">{preview.name}</h2><p className="modal-description">{preview.description}</p>
      <p className="local-note">示例展示世界设定、角色档案、剧情事件与关系网的组织方式。</p>
      <div className="modal-actions">{!preview.id.startsWith('example-') && <button className="secondary-button" onClick={() => toggleJoined(preview)}>{joined.includes(preview.id) ? '取消加入' : '加入世界书'}</button>}<button className="primary-button" onClick={() => onCreate('world')}>从空白世界书开始</button></div>
    </div></div>}
  </div>;
}
