import React from 'react';
import { blocksToText } from '../utils/mockEntries';

export default function EntryDocument({ entry, editing, onUpdate }) {
  function saveBlock(index, text) {
    const blocks = entry.blocks.map((block, i) => i === index ? { ...block, text } : block);
    onUpdate({ blocks, content: blocksToText(blocks) });
  }
  return <article className="document entry-document" key={entry.id}>
    <header className="entry-heading">
      <h1 contentEditable={editing} suppressContentEditableWarning aria-label="编辑词条标题" onBlur={event => onUpdate({ name: event.currentTarget.textContent.trim() || '未命名词条' })}>{entry.name}</h1>
      <div className="entry-source"><span>{entry.source ? '灵笼动画' : entry.type}</span><i /><span>来源于 {entry.source || '当前世界书'}</span></div>
      <div className="entry-contributors"><span>创建：</span><span className="contributor"><img src="/assets/avatar.png" alt="" />溜溜小鸭几</span><i /><span>贡献：</span><span className="contributor"><img src="/assets/avatar.png" alt="" />溜溜小鸭几</span></div>
    </header>
    {entry.blocks?.length ? <div className="entry-body" role="group" aria-label="编辑词条内容">
      {entry.blocks.map((block, index) => {
        const Heading = `h${block.level || 2}`;
        return <section key={`${entry.id}-${index}`} id={`entry-section-${index}`} className="entry-block">
          <Heading>{block.heading}</Heading>
          <div contentEditable={editing} suppressContentEditableWarning role={editing ? 'textbox' : undefined} aria-label={`编辑${entry.name}${block.heading}`} onBlur={event => saveBlock(index, event.currentTarget.innerText.trim())}>{block.text}</div>
        </section>;
      })}
    </div> : <div className="entry-editor" contentEditable={editing} suppressContentEditableWarning role="textbox" aria-label="编辑词条内容" data-placeholder="在这里记录世界的设定、故事与灵感…" onBlur={event => onUpdate({ content: event.currentTarget.innerText.trim() })}>{entry.content}</div>}
    <p className="autosave">内容自动保存在此浏览器</p>
  </article>;
}
