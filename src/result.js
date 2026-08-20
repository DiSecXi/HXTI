import { drawRadar } from './chart.js'
import { generateShareImage } from './share.js'

const LEVEL_LABEL = { L: '低', M: '中', H: '高' }
const LEVEL_CLASS = { L: 'level-low', M: 'level-mid', H: 'level-high' }

/**
 * 渲染测试结果
 */
export function renderResult(result, userLevels, dimOrder, dimDefs, config) {
  const { primary, secondary, rankings, mode } = result

  // Kicker
  const kicker = document.getElementById('result-kicker')
  if (mode === 'joker') kicker.textContent = '隐藏人格已激活'
  else if (mode === 'Victim') kicker.textContent = '隐藏人格已激活'
  else if (mode === 'fallback') kicker.textContent = '系统强制兜底'
  else kicker.textContent = '你的主类型'

  // 主类型
  document.getElementById('result-code').textContent = primary.code
  document.getElementById('result-name').textContent = primary.cn

  // 匹配度
  document.getElementById('result-badge').textContent =
    `匹配度 ${primary.similarity}%` + (primary.exact != null ? ` · 精准命中 ${primary.exact}/15 维` : '')

  // Intro & 描述
  document.getElementById('result-intro').textContent = primary.intro || ''
  const descEl = document.getElementById('result-desc')
  descEl.textContent = primary.desc || ''

  // 先移除旧字幕（防止重复叠加）
  const oldWaiting = document.querySelector('.result-waiting')
  if (oldWaiting) oldWaiting.remove()

  const waitingEl = document.createElement('p')
  waitingEl.className = 'result-waiting'
  waitingEl.textContent = '战斗学院为您制作了一张海克斯卡牌留作纪念'
  descEl.insertAdjacentElement('afterend', waitingEl)

  // 类型图片（新增）
  const imgEl = document.getElementById('result-image')
  if (imgEl) {
    if (primary.image) {
      imgEl.src = primary.image
      imgEl.style.display = 'block'
    } else {
      imgEl.style.display = 'none'
    }
  }
  // 次要匹配
  const secEl = document.getElementById('result-secondary')
  if (secondary && (mode === 'Victim' || mode === 'fallback')) {
    secEl.style.display = ''
    document.getElementById('secondary-info').textContent =
      `${secondary.code}（${secondary.cn}）· 匹配度 ${secondary.similarity}%`
  } else {
    secEl.style.display = 'none'
  }

  // 雷达图
  /*const canvas = document.getElementById('radar-chart')
  drawRadar(canvas, userLevels, dimOrder, dimDefs)*/

  // 维度详情
  /*const detailEl = document.getElementById('dimensions-detail')
  detailEl.innerHTML = ''
  for (const dim of dimOrder) {
    const level = userLevels[dim] || 'M'
    const def = dimDefs[dim]
    if (!def) continue

    const row = document.createElement('div')
    row.className = 'dim-row'
    row.innerHTML = `
      <div class="dim-header">
        <span class="dim-name">${def.name}</span>
        <span class="dim-level ${LEVEL_CLASS[level]}">${LEVEL_LABEL[level]}</span>
      </div>
      <div class="dim-desc">${def.levels[level]}</div>
    `
    detailEl.appendChild(row)
  }*/
}