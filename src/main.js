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

  function ding() {
    xzgAudio.currentTime = 0
    xzgAudio.play().catch(() => {})
    xzgCount++
    if (countEl) countEl.textContent = xzgCount
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
