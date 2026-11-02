import React from 'react';

export const extractionResult = {
  introduction: '提炼已完成。本次从《灵笼》素材中共提炼出56条结构化知识，覆盖以下维度：',
  dimensions: [
    { title: '世界设定', text: '包含世界简介、规则秩序,下设社会现象、世界构成(地点、身份头衔、物品、组织)、教义符号等子维度。' },
    { title: '剧情事件', text: '共8条，含「少年开仓救饥民」「抗疫受封神眷子」「年少加冕任教皇」「北征惨败梦碎走」「流亡办学著新典」等重大事件。' },
    { title: '角色档案', text: '共9条，涉及大卫、林雀、阿迦、玛莲、西蒙等角色。' },
  ],
  ending: '任务已关闭并从任务栏移除。如需导入为社区词条草稿，请直接回复“确认导入”。',
};

export function resultToText(result) {
  return [result.introduction, result.dimensions.map(item => `• ${item.title}：${item.text}`).join('\n'), result.ending].join('\n\n');
}

export default function ExtractionResult({ message }) {
  const result = message.result;
  return <div className="extraction-result">
    <p>{result.introduction}</p>
    <ul>{result.dimensions.map(item => <li key={item.title}><strong>{item.title}：</strong>{item.text}</li>)}</ul>
    <p>{result.ending}</p>
  </div>;
}
