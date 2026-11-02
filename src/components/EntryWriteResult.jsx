import React from 'react';

export default function EntryWriteResult({ message, onSelect }) {
  return <div className="entry-write-result">
    <p>{message.text}</p>
    <div className={`entry-write-card ${message.compact ? 'is-compact' : ''}`}>
      {!message.compact && <h3>已为生成相关内容</h3>}
      <div className="entry-write-list">
        {message.writes.map(entry => <button type="button" key={entry.id} onClick={() => onSelect(entry.id)} aria-label={`打开词条 ${entry.name}`}>
          <span className="entry-write-icon"><img src="/assets/file.png" alt="" /></span>
          <span className="entry-write-info"><strong><span className="entry-write-name">{entry.name}</span><small>{entry.status}</small></strong><span>{message.compact ? entry.status === '新建' ? '已创建词条草稿' : '已更新词条草稿' : `位置：${entry.type}`}</span></span>
          <img className="entry-write-arrow" src="/assets/chevron.png" alt="" />
        </button>)}
      </div>
    </div>
  </div>;
}
