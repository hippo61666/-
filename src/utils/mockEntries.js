const worldOverview = '《灵笼》的故事发生在文明崩塌后的末日世界。旧世界的生命实验与生态失衡交织，玛娜生态逐渐覆盖地表。幸存者居住在悬浮于空中的灯塔，依靠猎荒者从遗迹中带回物资，在生存秩序与人性之间寻找出路。';
const rules = '灯塔以资源配给维持运转，居民被划分为不同身份，并受到职业、繁育与情感规则的约束。地面则遵循玛娜生态的生命循环：生物通过生命源质彼此连接，危险往往来自整个生态网络，而非单一敌人。';
const ecology = '地面遗迹中生长着玛娜之花、地蔓藤等特殊生命，噬极兽在其间活动。猎荒者需要观察环境、保护补给路线，并避免将旧世界的经验直接套用到陌生生态中。';

function makeEntry(id, type, name, overview, details, parentId) {
  const blocks = [
    { heading: '概述', level: 2, text: overview },
    ...details.map(([heading, text, level = 3]) => ({ heading, level, text })),
  ];
  return { id: `mock-${id}`, type, name, parentId: parentId ? `mock-${parentId}` : null, blocks, content: blocksToText(blocks), source: '灵笼第一季到第二季动画、灵笼小说', editedBy: '世界书助手' };
}

export function blocksToText(blocks) {
  return blocks.map(block => `${block.heading}\n${block.text}`).join('\n\n');
}

export const mockEntries = [
  makeEntry('world', '世界设定', '世界设定', worldOverview, [['运行法则', rules], ['实体要素', ecology], ['物种', '地吼、蛇狗、双颚兽等噬极兽与玛娜植物共同构成地面生态。它们的行为、感知与生存方式都受到生命源质网络影响。', 4], ['物质分类', '灯塔依赖能源、食物、药品与机械零件维持生存；地面生态则以生命源质连接个体。两套资源体系形成了故事中的主要矛盾。']]),
  makeEntry('species', '世界设定', '物种', '灾变改变了地球上的生命形态。幸存人类、噬极兽与玛娜植物共同组成新的生态格局。', [['噬极兽', '地吼、蛇狗与双颚兽具有不同的行动方式。猎荒行动应先判断目标的活动范围，再选择撤离路线。'], ['玛娜植物', '玛娜之花与地蔓藤连接周围环境，既是生态网络的一部分，也为探索者提供危险信号。']]),
  makeEntry('dihou', '世界设定', '地吼', '地吼是地面生态中的大型噬极兽，强壮的体型与压迫感使其成为猎荒行动中的重大威胁。', [['形态与行为', '厚重的肢体适合在复杂地面上移动，攻击往往伴随猛烈冲撞。发现其踪迹时，应优先保护队伍与物资。'], ['叙事用途', '可用于表现猎荒任务的风险，以及队长在战斗与撤离之间的决策。']], 'species'),
  makeEntry('shegou', '世界设定', '蛇狗', '蛇狗是猎荒者在地面经常遭遇的噬极兽，其灵活的移动方式让狭窄通道与废墟边缘变得危险。', [['行动特征', '通过追踪与突袭逼近目标，适合在废墟环境中形成紧张的追逐场景。'], ['应对策略', '队伍需要维持视野与火力协作，避免单独脱离队形。']], 'species'),
  makeEntry('doublejaw', '世界设定', '双颚兽', '双颚兽以具有辨识度的口部结构与凶猛的攻击方式构成威胁，是地面危险生物的代表之一。', [['攻击方式', '近距离接触风险高，猎荒者应利用地形保持距离，并预留撤退空间。'], ['场景关联', '适合出现在旧城市遗迹、封闭设施与资源争夺的场景中。']], 'species'),
  makeEntry('vine', '世界设定', '地蔓藤', '地蔓藤是玛娜生态中与地面环境紧密连接的植物形态，延伸的藤蔓使废墟呈现出被生命网络覆盖的景象。', [['生态作用', '连接周边生态节点，影响通行与探索路线。它的分布可作为观察环境变化的线索。'], ['探索提示', '不要将密集植被视为普通掩体，应结合周边生物活动判断风险。']], 'species'),
  makeEntry('flower', '世界设定', '玛娜之花', '玛娜之花是新生态的重要象征。它以奇异而美丽的外观，呈现出生命循环背后的危险与未知。', [['生命源质', '玛娜生态围绕生命源质运转，花与周边生物共同形成相互联系的系统。'], ['故事意义', '既能作为地面探索中的视觉线索，也能推动角色重新理解灾变与生命。']], 'species'),
  makeEntry('space', '世界设定', '空间设定', '故事的主要空间由空中的灯塔与被玛娜生态覆盖的地面构成。两者之间的往返决定了幸存者的生存节奏。', [['灯塔空间', '居住区、生产设施与管理区域体现不同身份的生活差异。'], ['地面空间', '城市遗迹、废弃设施与生态区域交错，资源与危险常常同时存在。']]),
  makeEntry('lighthouse', '世界设定', '灯塔', '灯塔是一座悬浮于空中的生存基地，也是幸存者的家园。机械设施、资源配给与严格规则共同支撑其日常运转。', [['社会秩序', rules], ['生存依赖', '能源、食物与设备零件需要持续补充，猎荒者的每一次归来都影响下一阶段的生活。']], 'space'),
  makeEntry('ruins', '世界设定', '地面遗迹', '旧世界留下的城市与设施保存着珍贵物资，也隐藏着灾变前的线索。', [['环境特征', ecology], ['剧情线索', '档案、设备与遗留痕迹可以成为追查灾变原因的入口。']], 'space'),
  makeEntry('mark', '角色档案', '马克', '马克是灯塔猎荒者队长，承担带领队伍前往地面收集物资的职责。他冷静、坚韧，重视同伴的生命，在灯塔规则与个人情感之间经历艰难选择。', [['人物身份', '所属阵营：灯塔；主要职责：组织猎荒行动、保障队伍安全并带回生存物资。'], ['性格与动机', '外表克制，内心富有责任感。面对资源压力与危险环境，他仍试图保护具体的人，而不只是完成任务。'], ['世界设定', worldOverview, 2], ['运行法则', rules], ['实体要素', ecology], ['物种', '地吼、蛇狗、双颚兽与玛娜植物是马克在地面行动时必须面对的生态要素。', 4], ['关联角色', '冉冰是重要同伴，墨城与杰西卡是猎荒队成员。查尔斯代表灯塔内部另一种秩序观。']]),
  makeEntry('ranbing', '角色档案', '冉冰', '冉冰是灯塔猎荒者的重要成员，与马克长期并肩行动。她勇敢、敏锐，能够在严苛的环境中保持对同伴的信任。', [['人物经历', '在灯塔成长，并通过猎荒任务逐渐认识地面世界。与马克共同经历危险，也见证秩序对个人选择的限制。'], ['性格与动机', '行动果断，关心同伴；她的情感选择推动了人物关系与灯塔规则之间的冲突。'], ['关联事件', '「冉冰在灯塔21年的故事」梳理她的成长轨迹；「猎荒小队返回灯塔」呈现她与队伍的协作。']]),
  makeEntry('mocheng', '角色档案', '墨城', '墨城是灯塔猎荒队成员，在地面任务中承担战斗与协作职责。', [['人物特征', '在危险环境中与队友相互支援，体现猎荒队作为一个整体的凝聚力。'], ['关联角色', '与马克、冉冰、杰西卡共同参与猎荒行动。']]),
  makeEntry('charles', '角色档案', '查尔斯', '查尔斯是灯塔权力与信仰体系中的关键人物。他重视秩序与身份，常以制度视角理解个体的价值。', [['人物立场', '维护既有等级与权威，认为严格规则是灯塔持续生存的保障。'], ['核心冲突', '与马克强调同伴与人性的选择形成对照，推动灯塔内部的权力矛盾。']]),
  makeEntry('jessica', '角色档案', '杰西卡', '杰西卡是灯塔猎荒队成员，参与地面物资搜寻，与同伴共同承担生存风险。', [['角色作用', '通过团队行动与日常互动，呈现规则之下普通人的情感与牵挂。'], ['关联场景', '猎荒行动、队伍返回以及灯塔日常生活。']]),
  makeEntry('bai', '角色档案', '白月魁', '白月魁是地面幸存者中的关键人物，拥有丰富的战斗经验与对新生态的认识。', [['人物能力', '冷静判断环境与敌人，行动方式展现出区别于灯塔猎荒者的地面生存经验。'], ['故事作用', '为理解地面生态与灾变线索提供新的视角，拓展马克对世界的认识。']]),
  makeEntry('ranbing-story', '剧情事件', '冉冰在灯塔21年的故事', '以冉冰的成长经历为线索，串联灯塔生活、猎荒任务与她同马克建立的信任。', [['事件脉络', '从灯塔中的成长，到进入猎荒队，再到面对情感与规则的冲突，她逐步形成自己的选择。'], ['人物影响', '帮助理解冉冰的勇气与坚持，也为马克后续的行动提供情感基础。']]),
  makeEntry('return', '剧情事件', '猎荒小队返回灯塔', '马克带领猎荒小队从地面任务返回灯塔。带回的物资与队伍付出的代价共同揭示了生存秩序的压力。', [['事件经过', '搜寻资源、遭遇地面危险、组织撤离并完成物资交接。'], ['后续影响', '资源分配与人员处境引出灯塔内部矛盾，推动角色对规则的反思。']]),
  makeEntry('awakening', '剧情事件', '玛娜生态觉醒', '地面的生态变化让幸存者意识到，灾变后的世界并非静止的废墟，而是持续运转的生命系统。', [['关键线索', '特殊植物、噬极兽与生命源质之间的联系逐渐显现。'], ['剧情影响', '人物需要改变对敌人与环境的理解，探索新的生存可能。']]),
  makeEntry('relationship', '关系网', '马克与冉冰', '马克与冉冰在长期合作中建立深厚信任。他们的关系连接个人情感、团队责任与灯塔规则。', [['关系基础', '共同经历猎荒危险，在行动与选择中相互支撑。'], ['关系冲突', '个人情感与灯塔的严格制度存在张力，成为人物命运的重要推动力。']]),
];

export function planEntryWrite(book, command, currentId) {
  const instruction = command.split(/[：:]/)[0];
  const named = book.entries.filter(entry => instruction.includes(entry.name)).sort((a, b) => b.name.length - a.name.length);
  const mockNamed = mockEntries.filter(entry => instruction.includes(entry.name)).sort((a, b) => b.name.length - a.name.length);
  const current = book.entries.find(entry => entry.id === currentId);
  const requestedName = command.match(/(?:写入(?:到)?词条|导入词条)\s*[「“"]?([^：:「」“”"]+?)[」”"]?\s*[：:]/)?.[1]?.trim();
  const newTarget = requestedName && !/^(当前|这个|所有|全部)$/.test(requestedName) ? { id: crypto.randomUUID(), name: requestedName, type: current?.type || '世界设定' } : null;
  const target = named[0] || mockNamed[0] || (/(当前|这个|此词条)/.test(instruction) ? current : null) || newTarget || (/[：:]/.test(command) ? current : null);
  if (!target && /(当前|这个|此词条)/.test(instruction)) return [];
  const payload = command.match(/[：:]\s*([\s\S]+)/)?.[1]?.trim();
  const previewOrder = ['mock-mark', 'mock-ranbing', 'mock-ranbing-story', 'mock-world'];
  const targets = target ? [target] : [...mockEntries].sort((a, b) => {
    const position = entry => previewOrder.includes(entry.id) ? previewOrder.indexOf(entry.id) : previewOrder.length;
    return position(a) - position(b);
  });
  return targets.map(item => {
    const existing = book.entries.find(entry => entry.type === item.type && entry.name === item.name);
    const mock = mockEntries.find(entry => entry.type === item.type && entry.name === item.name);
    let blocks = mock?.blocks || [{ heading: '概述', level: 2, text: `「${item.name}」是${book.name}中的${item.type}词条，记录相关背景、核心特征与故事线索。` }];
    if (payload) blocks = [{ heading: '概述', level: 2, text: payload }, ...blocks.slice(1)];
    // Explicit imports retain any text already edited by the creator.
    const preserve = !payload && existing?.content?.trim();
    const data = preserve ? { ...existing, editedBy: '世界书助手' } : { ...mock, ...item, blocks, content: blocksToText(blocks), editedBy: '世界书助手' };
    return { ...data, id: existing?.id || item.id, status: existing ? '修改' : '新建' };
  });
}

export function applyEntryWrite(book, writes) {
  const entries = [...book.entries];
  const resolvedIds = new Map();
  for (const write of writes) {
    const index = entries.findIndex(entry => entry.id === write.id || (entry.type === write.type && entry.name === write.name));
    resolvedIds.set(write.id, index >= 0 ? entries[index].id : write.id);
    const { status, ...data } = write;
    if (index >= 0) entries[index] = { ...data, id: entries[index].id };
    else entries.push(data);
  }
  const world = writes.find(entry => entry.id === 'mock-world');
  return {
    ...book,
    ...(world ? {
      name: book.name === '未命名' ? '灵笼' : book.name,
      source: book.source || world.source,
      introduction: book.introduction || world.blocks[0].text,
    } : {}),
    entries: entries.map(entry => entry.parentId ? { ...entry, parentId: resolvedIds.get(entry.parentId) || entry.parentId } : entry),
  };
}
