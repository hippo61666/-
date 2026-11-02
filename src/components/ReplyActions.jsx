import React from 'react';

export default function ReplyActions({ message, busy, onCopy, onRetry, onFeedback }) {
  const label = message.kind === 'extraction-result' ? '提炼结果' : '回复';
  return <div className="reply-actions" role="group" aria-label={`${label}操作`}>
    <button type="button" aria-label={`复制${label}`} title="复制" onClick={() => onCopy(message)}><img src="/assets/reply-copy.png" alt="" /></button>
    <button type="button" aria-label={`重新生成${label}`} title="重新生成" disabled={busy} onClick={() => onRetry(message.id)}><img src="/assets/reply-retry.png" alt="" /></button>
    <button type="button" aria-label={`${label}有帮助`} title="有帮助" aria-pressed={message.feedback === 'like'} onClick={() => onFeedback(message.id, 'like')}><img src="/assets/reply-like.png" alt="" /></button>
    <button type="button" aria-label={`${label}无帮助`} title="无帮助" aria-pressed={message.feedback === 'dislike'} onClick={() => onFeedback(message.id, 'dislike')}><img src="/assets/reply-dislike.png" alt="" /></button>
  </div>;
}
