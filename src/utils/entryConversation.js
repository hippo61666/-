import { blocksToText } from './mockEntries';

export const isWriteCommand = value => /(写入.*词条|词条.*写入|确认导入|导入.*词条)/.test(value);
export const isDraftConfirmation = value => /^(好的?|好啊|可以|确认|确认写入|开始写入|写入|写入吧|好的[，,]\s*写入吧|没问题|是的|行|就这样)[！!。.\s]*$/.test(value);

export function startEntryDraft(book, value, activeId) {
  const creating = /(创建|新建|新增|增加|再.*建|再.*加)/.test(value);
  const worldIdea = !book.entries.length && !/(提炼|解析|资料|\bIP\b)/i.test(value) && /(世界|故事|点子|城市|末日|未来|魔法|科幻|角色|人物|幸存者)/.test(value);
  if ((creating && /(角色|人物|词条|设定|事件|世界|故事)/.test(value)) || worldIdea) {
    const type = /(角色|人物)/.test(value) ? '角色档案' : /事件/.test(value) ? '剧情事件' : '世界设定';
    return { id: crypto.randomUUID(), name: type === '角色档案' ? '拾荒者' : type === '剧情事件' ? '新事件' : '世界设定', type, notes: worldIdea && !creating ? [value] : [], ready: false };
  }
  if (/(修改|调整|补充|完善|改成|增加|改一下|让[他她它]|[他她它]的|希望.*[他她它]|继续.*词条)/.test(value)) {
    const named = book.entries.filter(entry => value.includes(entry.name)).sort((a, b) => b.name.length - a.name.length)[0];
    const target = named || book.entries.find(entry => entry.id === activeId);
    if (target) return { ...target, notes: [value], ready: true, existing: true };
  }
  return null;
}

export function refineEntryDraft(draft, value) {
  const name = value.match(/(?:名字(?:改成|叫|是|为)|命名为|叫(?:他|她|它)?|改名(?:为|叫))\s*[「“"]?([^，。！？：:\s「」“”"]+)/)?.[1];
  return { ...draft, name: name || draft.name, notes: [...draft.notes, value], ready: true };
}

export function draftReply(draft, book) {
  const world = book.name === '未命名' ? '当前世界' : `「${book.name}」`;
  if (!draft.ready) return {
    kind: 'entry-conversation',
    paragraphs: draft.type === '角色档案' ? [
      `好呀，我们可以在${world}里${book.entries.length ? '再' : ''}创建一个角色。`,
      '你希望他是什么身份？比如幸存者、拾荒者，或者某个组织的成员。',
      '他的核心性格是什么？他和这个世界有什么关系，又处在什么位置？你可以先说几个关键词，我们一起展开。',
    ] : [`好呀，我们一起补充${world}的${draft.type}。`, '这个世界或故事发生在哪里？有哪些特别的规则，主角最希望实现什么？', '也可以先为词条起个名字，再补充背景或故事线索，我会帮你整理成草稿。'],
  };
  const character = draft.type === '角色档案' && !draft.existing;
  return {
    kind: 'entry-conversation',
    paragraphs: [
      character ? `可以，先把这个角色暂定为「${draft.name}」。他可以在${world}的边缘独自生活，捡拾别人不在意的旧物，每件小东西都留着一段旧日记忆。` : `已整理「${draft.name}」的${draft.existing ? '修改' : '草稿'}，继续补充也可以。`,
      '目前收集到的设定：',
    ],
    bullets: character ? [
      `身份与性格：${draft.notes.join('；')}`,
      '日常习惯：独自行动，收集没有交换价值的旧物，靠熟悉的习惯维持生活。',
      '故事线索：对旧世界的记忆与牵挂，可以成为他与其他角色相遇的契机。',
    ] : draft.notes,
    closing: '当前收集了不少设定啦，要不要先写入这些再继续？',
  };
}

export function planDraftWrite(book, draft) {
  const existing = book.entries.find(entry => entry.id === draft.id || (entry.name === draft.name && entry.type === draft.type));
  const notes = draft.notes.join('\n');
  const blocks = draft.existing ? [
    ...(draft.blocks || [{ heading: '概述', level: 2, text: draft.content || '' }]),
    { heading: '补充设定', level: 2, text: notes },
  ] : [
    { heading: '概述', level: 2, text: `「${draft.name}」是${book.name === '未命名' ? '当前世界' : `「${book.name}」`}中的${draft.type}。${notes || '具体设定待补充。'}` },
    ...(draft.type === '角色档案' ? [
      { heading: '性格与日常', level: 2, text: '独自生活与行动，习惯收集没有交换价值的旧物，在熟悉的日常中保存旧世界的记忆。' },
      { heading: '创作设定', level: 2, text: notes || '身份、性格与经历待补充。' },
    ] : []),
  ];
  return [{ ...draft, notes: undefined, ready: undefined, existing: undefined, id: existing?.id || draft.id, blocks, content: blocksToText(blocks), editedBy: '世界书助手', status: existing ? '修改' : '新建' }];
}
