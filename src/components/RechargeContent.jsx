import React, { useState } from 'react';

const packages = [
  { credits: 100, price: 1 },
  { credits: 1000, price: 9, original: 10, recommended: true },
  { credits: 10000, price: 88, original: 100 },
  { credits: 30000, price: 278, original: 300 },
  { credits: 60000, price: 528, original: 600 },
  { credits: 10000, price: 1688, original: 1000, bonus: '加赠16%' },
  { credits: 200000, price: 1288, original: 2000 },
];

export default function RechargeContent({ required, balance = 0, onPaid }) {
  const [selected, setSelected] = useState(() => {
    const index = packages.findIndex(item => item.credits >= required);
    return index < 0 ? packages.length - 1 : index;
  });
  const [custom, setCustom] = useState('');
  const customSelected = selected === 'custom';
  const price = customSelected ? Number(custom) : packages[selected].price;
  const credits = customSelected ? price * 100 : packages[selected].credits;
  const canPay = Number.isInteger(price) && price > 0 && price <= 1000000 && credits >= required;
  return <>
    <header className="recharge-header">
      <div className="recharge-heading"><h2 id="modal-title">充值星光</h2>{required > 0 && <p>本次生成需 {required} 星光，还差 <strong>{required}</strong> 星光</p>}</div>
      <div className="recharge-balance"><span>星光余额</span><strong><img src="/assets/credits.png" width={16} height={16} alt="" />{balance}</strong></div>
    </header>
    <div className="recharge-body">
      <div className="recharge-packages" role="group" aria-label="选择充值档位">
        {packages.map((item, index) => <button type="button" key={index} className={`recharge-package ${selected === index ? 'is-selected' : ''}`} aria-pressed={selected === index} aria-label={`${item.credits} 星光，${item.price} 元`} onClick={() => setSelected(index)}>
          {item.recommended && <small className="recharge-recommended">推荐</small>}
          {item.bonus && <small className="recharge-bonus">{item.bonus}</small>}
          <strong><img src="/assets/credits.png" width={24} height={24} alt="" />{item.credits}</strong>
          <span>¥{item.price}{item.original && <del>¥{item.original}</del>}</span>
        </button>)}
        <button type="button" className={`recharge-package recharge-custom ${customSelected ? 'is-selected' : ''}`} aria-pressed={customSelected} onClick={() => setSelected('custom')}><strong>自定义金额</strong><span>最高100万元</span></button>
        {customSelected && <label className="recharge-custom-input">充值金额（元）<input type="number" min="1" max="1000000" step="1" value={custom} onChange={event => setCustom(event.target.value)} placeholder="请输入充值金额" /></label>}
      </div>
      <div className="recharge-payment">
        <button type="button" className="recharge-qr" aria-label="模拟微信扫码支付成功" disabled={!canPay} onClick={() => onPaid(credits)}><img src="/assets/recharge-qr-demo.png" width={162} height={162} alt="设计稿充值二维码示例" /></button>
        <strong className="recharge-price"><small>¥</small>{price > 0 && price <= 1000000 ? price : '—'}</strong>
        <p className="recharge-methods"><img src="/assets/recharge-payment-methods.png" width={56} height={16} alt="" />使用抖音/支付宝/微信支付</p>
        <p className="recharge-agreement">已阅读并同意《抖音星光服务协议》</p>
        <p className="recharge-demo">点击二维码模拟微信扫码成功，不产生真实支付。{!canPay && '请选择足够抵扣本次费用的充值金额。'}</p>
      </div>
    </div>
  </>;
}
