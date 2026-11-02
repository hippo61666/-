import React, { useEffect, useState } from 'react';

export default function AgentProgress({ progress }) {
  const [expanded, setExpanded] = useState(true);
  const [now, setNow] = useState(Date.now());
  const running = progress.state === 'running';
  useEffect(() => {
    if (!running) { setExpanded(false); return; }
    setExpanded(true);
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [running]);
  const seconds = Math.max(0, Math.floor(((progress.finishedAt || now) - progress.startedAt) / 1000));
  const detailId = `progress-${progress.id}`;
  return <div className={`agent-progress ${running ? 'is-processing' : ''}`}>
    <div className={`agent-progress-summary ${progress.platformCovered ? 'has-platform-notice' : ''}`}>
    <button type="button" className="agent-progress-toggle" aria-expanded={expanded} aria-controls={detailId} onClick={() => setExpanded(value => !value)}>
      <span role="status">{running ? '正在处理' : '已处理'} {seconds}s</span>
      <img src="/assets/chevron.png" width={12} height={12} alt="" className={expanded ? '' : 'is-collapsed'} />
    </button>
    {progress.platformCovered && <span className="platform-covered-notice" title="感谢贡献内容，本次10星光平台承担">感谢贡献内容，本次10星光平台承担</span>}
    </div>
    {expanded && <ol id={detailId} className="agent-progress-steps" aria-label="助手处理步骤">
      {progress.steps.map((step, index) => <li key={step.text} className={running && index === progress.phase ? 'is-current' : ''}>
        <img src={`/assets/${step.icon}.png`} width={14} height={14} alt="" /><span>{step.text}</span>
      </li>)}
    </ol>}
  </div>;
}
