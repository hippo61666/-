export const demoScenarios = [
  { id: 'free', label: '限免充足', credits: 1500, hint: '1500 限免星光 · 提炼资料后确认，消耗显示 0' },
  { id: 'recharge', label: '限免不足', credits: 10, hint: '打开灵笼草稿 · 剩余 10 限免星光 · 确认上传后展示星光不足' },
  { id: 'platform', label: '个人星光 / 平台承担', credits: 0, personalCredits: 1200, hint: '去创建新的世界书 · 个人星光 1200 · 提炼扣费，对话写入由平台承担' },
];

export function getDemoScenario(id) {
  return demoScenarios.find(scenario => scenario.id === id) || demoScenarios[0];
}

export const rechargeDemoFile = { id: 'demo-recharge-reference', name: '灵笼补充设定.txt', size: 360, type: 'text/plain', source: 'demo' };

export function createRechargeDemoMessages(book) {
  const completed = response => {
    const id = crypto.randomUUID();
    const finishedAt = Date.now();
    return { ...response, id, role: 'assistant', progress: {
      id, state: 'complete', phase: 2, startedAt: finishedAt - 4000, finishedAt,
      steps: [{ icon: 'agent-brain', text: '深度思考中' }, { icon: 'agent-search', text: '正在分析文件' }, { icon: 'agent-plan', text: '正在规划生成路径' }],
    } };
  };
  return [
    { id: crypto.randomUUID(), role: 'user', text: '帮我整理《灵笼》的世界设定、角色和剧情，并写入词条。' },
    completed({ kind: 'entry-write-result', text: '已整理并写入4个词条：世界设定、马克、冉冰和猎荒小队返回灯塔。内容已保存，可以继续编辑或补充资料。', writes: book.entries.map(entry => ({ ...entry, status: '新建' })) }),
    { id: crypto.randomUUID(), role: 'user', text: '再帮我提炼这份补充资料，继续完善角色设定。' },
    completed({ kind: 'file-request', text: '已添加补充资料，点击确认后，我会核算本次提炼的星光消耗。', files: [rechargeDemoFile], submitted: false }),
  ];
}
