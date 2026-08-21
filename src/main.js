import { calcDimensionScores, scoresToLevels, determineResult } from './engine.js'
import { createQuiz } from './quiz.js'
import { renderResult } from './result.js'
import './style.css'

async function loadJSON(path) {
  const res = await fetch(path)
  return res.json()
}

async function init() {
  const [questions, dimensions, types, config] = await Promise.all([
    loadJSON(new URL('../data/questions.json', import.meta.url).href),
    loadJSON(new URL('../data/dimensions.json', import.meta.url).href),
    loadJSON(new URL('../data/types.json', import.meta.url).href),
    loadJSON(new URL('../data/config.json', import.meta.url).href),
  ])

  const pages = {
    intro: document.getElementById('page-intro'),
    quiz: document.getElementById('page-quiz'),
    result: document.getElementById('page-result'),
  }

  function showPage(name) {
    Object.values(pages).forEach((p) => p.classList.remove('active'))
    pages[name].classList.add('active')
    window.scrollTo(0, 0)
  }

    function onQuizComplete(answers, { isVictim, isJoker }) {
    const scores = calcDimensionScores(answers, questions.main)
    const levels = scoresToLevels(scores, config.scoring.levelThresholds)
    const result = determineResult(levels, dimensions.order, types.standard, types.special, { isVictim, isJoker })
    renderResult(result, levels, dimensions.order, dimensions.definitions, config)
    showPage('result')
  }

  const quiz = createQuiz(questions, config, onQuizComplete)

  // 创建音频对象（所有按钮共用）
  const xzgAudio = new Audio(`${import.meta.env.BASE_URL}audio/xinzhigang.mp3`)
  xzgAudio.preload = 'auto'

  // [修复] 补回缺失的三个变量声明
  let xzgCount = 0
  const countEls = document.querySelectorAll('.xzg-count')
  const titleEls = document.querySelectorAll('.xzg-title')

  const xzgTitles = {
    1: 'First Blood',
    2: 'Double Kill',
    3: 'Triple Kill',
    4: 'Quadra Kill',
    5: 'Penta Kill',
    6: 'Hexa Kill',
    7: 'Hepta Kill',
    8: 'Octa Kill',
    9: 'Nona Kill',
    10: 'Deca Kill',
  }

  function getXzgTitle(count) {
    if (count >= 100000) return '钢之炼金术师（您就是钢神）'
    if (count >= 10000) return '万钢归宗！！！'
    if (count >= 1000) return '千锤百炼！！'
    if (count >= 150) return '还在杀？'
    if (count >= 101) return '乱杀'
    if (count >= 100) return '百炼成钢！'
    if (count >= 91) return '杀疯了'
    if (count >= 81) return '杀神'
    if (count >= 71) return '超凡入圣'
    if (count >= 61) return '封神'
    if (count >= 51) return '超神'
    if (count >= 41) return '接近神了'
    if (count >= 31) return '主宰'
    if (count >= 21) return '无人可挡'
    if (count >= 11) return '暴走'
    return xzgTitles[count] || null
  }

  function ding() {
    const clone = xzgAudio.cloneNode()
    clone.play().catch(() => {})

    xzgCount++
    countEls.forEach(el => el.textContent = xzgCount)

    const title = getXzgTitle(xzgCount)
    if (title) {
      titleEls.forEach(el => {
        el.textContent = `· ${title}`
        el.style.animation = 'none'
        el.offsetHeight
        el.style.animation = 'popIn 0.4s ease'
      })
    }
  }

  document.getElementById('btn-start').addEventListener('click', () => {
    quiz.start()
    showPage('quiz')
  })

  document.getElementById('btn-restart').addEventListener('click', () => {
    quiz.start()
    showPage('intro')
  })

  // 首页心之钢图标按钮
  const xzgBtn = document.getElementById('btn-xinzhigang')
  if (xzgBtn) {
    xzgBtn.addEventListener('click', ding)
  }

  // 结果页心之钢图标按钮
  const xzgBtnResult = document.getElementById('btn-xinzhigang-result')
  if (xzgBtnResult) {
    xzgBtnResult.addEventListener('click', ding)
  }

    const btnCopyIntroWx = document.getElementById('btn-copy-intro-wx')
  if (btnCopyIntroWx) {
    btnCopyIntroWx.addEventListener('click', async () => {
      const wx = 'Quantum_Chemistry_SH'
      try {
        await navigator.clipboard.writeText(wx)
        alert('微信号已复制：' + wx)
      } catch (err) {
        const ta = document.createElement('textarea')
        ta.value = wx
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        alert('微信号已复制：' + wx)
      }
    })
  }

  // 分享区复制按钮
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy
      try {
        await navigator.clipboard.writeText(text)
        const original = btn.textContent
        btn.textContent = '已复制！'
        setTimeout(() => btn.textContent = original, 1500)
      } catch (err) {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        const original = btn.textContent
        btn.textContent = '已复制！'
        setTimeout(() => btn.textContent = original, 1500)
      }
    })
  })

  // ========== 随机抽卡 ==========
    const cardImages = [
    './images/img-1-PUA-er.png',
    './images/img-2-COW.png',
    './images/img-3-GRIND.png',
    './images/img-4-NERD.png',
    './images/img-5-SNAKE.png',
    './images/img-6-ROOKIE.png',
    './images/img-7-BOSS.png',
    './images/img-8-VETERAN.png',
    './images/img-9-COPY.png',
    './images/img-10-LUCKY.png',
    './images/img-11-REVIEW-er.png',
    './images/img-12-BOOM.png',
    './images/img-13-GMBL.png',
    './images/img-14-PASS.png',
    './images/img-15-TAILOR.png',
    './images/img-16-TECH.png',
    './images/img-17-YODA.png',
    './images/img-18-SQUID.png',
    './images/img-19-GOURD.png',
    './images/img-20-INDEED.png',
    './images/img-21-MEMER.png',
    './images/img-22-FAKER.png',
    './images/img-23-BALANCE.png',
    './images/img-24-IMPO.png',
    './images/img-25-BABY.png',
    './images/img-26-GHOST.png',
    './images/img-27-SOCL.png',
    './images/img-28-MUM-Like.png',
    './images/img-29-AI.png',
    './images/img-30-VICT.png',
    './images/img-31-EATER.png',
    './images/img-32-Joker.png'
  ]

  const hexCardImg = document.getElementById('hex-card-img')
  const btnRoll = document.getElementById('btn-roll')

  if (hexCardImg && btnRoll) {
    // 进入结果页时先随机一张
    hexCardImg.src = cardImages[Math.floor(Math.random() * cardImages.length)]

    btnRoll.addEventListener('click', () => {
      hexCardImg.src = cardImages[Math.floor(Math.random() * cardImages.length)]
    })
  }

}

init()