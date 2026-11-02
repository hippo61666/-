import React, { useId } from 'react';

export default function PublishButton({ published, onClick }) {
  const tooltipId = useId();
  return <div className="publish-button-wrapper">
    <button className="primary-button" aria-describedby={tooltipId} onClick={onClick}>{published ? '更新发布' : '发布'}</button>
    <div id={tooltipId} className="publish-rewards-tooltip" role="tooltip">
      <div className="publish-rewards-copy">
        <strong>发布世界书后，可邀请大家共创并获得星光奖励</strong>
        <p>世界书发布后可以让更多人看到你的世界，加入社区一起丰富角色、剧情与设定。并且平台将根据内容完整度、丰富度等给予星光奖励，助力你持续丰富世界书</p>
      </div>
      <img src="/assets/publish-rewards.png" width={384} height={206} alt="世界书发布后在社区中展示的示例" />
    </div>
  </div>;
}
