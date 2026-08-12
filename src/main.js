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

  function onQuizComplete(answers, isDrunk) {
    const scores = calcDimensionScores(answers, questions.main)
    const levels = scoresToLevels(scores, config.scoring.levelThresholds)
    const result = determineResult(levels, dimensions.order, types.standard, types.special, { isDrunk })
    renderResult(result, levels, dimensions.order, dimensions.definitions, config)
    showPage('result')
  }

  const quiz = createQuiz(questions, config, onQuizComplete)

  // 创建音频对象（所有按钮共用）
  const xzgAudio = new Audio(`${import.meta.env.BASE_URL}audio/xinzhigang.mp3`)
  xzgAudio.preload = 'auto'

    // 叠钢计数器
  let xzgCount = 0
  const countEl = document.getElementById('xzg-count')
  const titleEl = document.getElementById('xzg-title')

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
    100: '百炼成钢！',
    1000: '千锤百炼！！',
    10000: '万钢归宗！！！',
    100000: '钢之炼金术师（您就是钢神）',
  }

  function ding() {
    // 克隆音频实例，每次点击都是全新的，互不干扰，连点也能立刻响
    const clone = xzgAudio.cloneNode()
    clone.play().catch(() => {})

    xzgCount++
    if (countEl) countEl.textContent = xzgCount

        // 彩蛋称号
    if (titleEl) {
      let title = xzgTitles[xzgCount]
      // 11-99 之间显示乱杀
      if (!title && xzgCount >= 11 && xzgCount <= 99) {
        title = '乱杀'
      }
      if (title) {
        titleEl.textContent = `· ${title}`
        titleEl.style.animation = 'none'
        titleEl.offsetHeight // 强制重绘
        titleEl.style.animation = 'popIn 0.4s ease'
      }
    }
  }
  
  document.getElementById('btn-start').addEventListener('click', () => {
    ding()
    quiz.start()
    showPage('quiz')
  })

  document.getElementById('btn-restart').addEventListener('click', () => {
    ding()
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
}

init()
