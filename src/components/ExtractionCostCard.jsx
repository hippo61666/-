import React from 'react';
import { estimateExtractionCost } from '../utils/extractionPricing';

export default function ExtractionCostCard({ request, onReselect, onConfirm, busy, freeCredits, personalCredits = 0, recharging }) {
  const isVideo = file => file.source === 'douyin' || file.type?.startsWith('video/') || /\.(mp4|mov|mkv|avi|webm|m4v)$/i.test(file.name);
  const videos = request.files.filter(isVideo).length;
  const images = request.files.filter(file => !isVideo(file) && (file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|heic)$/i.test(file.name))).length;
  const other = request.files.length - videos - images;
  const description = [videos && `${videos} 个视频`, images && `${images} 张图片`, other && `${other} 份文档`].filter(Boolean).join('、');
  const allowance = request.quotedFreeCredits ?? freeCredits;
  const payableCredits = Math.max(0, estimateExtractionCost(request.files) - allowance);
  const needsRecharge = payableCredits > (request.quotedPersonalCredits ?? personalCredits);
  const inactive = request.confirmed || request.superseded || busy || recharging;
  return <div className={`extraction-cost-card ${request.confirmed ? 'is-confirmed' : ''}`} role="group" aria-label="星光消耗确认">
    <h3><img src="/assets/extraction-cost.png" width={20} height={20} alt="" />文件提炼</h3>
    <p>共提炼 {description}，需消耗 {estimateExtractionCost(request.files)} 星光{needsRecharge ? `。${allowance > 0 ? `剩余 ${allowance} 限免星光不足抵扣` : '星光余额不足'}，请充值后继续` : allowance > 0 ? `。你有 ${allowance} 限免星光可用于抵扣` : ''}</p>
    <div className="extraction-cost-footer">
      {request.superseded && <span role="status">已重新选择文件</span>}
      <span className={`extraction-payable ${inactive ? 'is-disabled' : ''}`} aria-disabled={inactive} aria-label={`抵扣后消耗 ${payableCredits} 星光`} title={`抵扣后消耗 ${payableCredits} 星光`}>
        <img src="/assets/extraction-payable-credit.png" width={12} height={12} alt="" />
        <strong>{payableCredits}</strong>
      </span>
      <button type="button" className="secondary-button" disabled={inactive} onClick={() => onReselect(request.id)}>重新选择文件</button>
      <button type="button" className="primary-button extraction-confirm" disabled={inactive} onClick={() => onConfirm(request.id)}>{needsRecharge ? '充值并确认' : '确认'}<img src="/assets/confirm-enter.png" width={14} height={14} alt="" /></button>
    </div>
  </div>;
}
