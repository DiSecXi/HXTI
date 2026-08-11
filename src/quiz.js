import { shuffle, insertAtRandom, insertAfter } from './utils.js'

/**
 * 答题控制器
 */
export function createQuiz(questions, config, onComplete) {
  const mainQuestions = shuffle(questions.main)
  const drinkGateQ1 = questions.special.find((q) => q.id === config.drinkGate.questionId)
  const drinkGateQ2 = questions.special.find((q) => q.id === 'drink_gate_q2')

  let queue = insertAtRandom(mainQuestions, drinkGateQ1)
  let current = 0
  let answers = {}
  let isDrunk = false

  const els = {
    fill: document.getElementById('progress-fill'),
    text: document.getElementById('progress-text'),
    qText: document.getElementById('question-text'),
    options: document.getElementById('options'),
    prevBtn: document.getElementById('btn-prev'),   // [改] 获取上一题按钮
    nextBtn: document.getElementById('btn-next'),   // [改] 获取下一题按钮
  }

  function totalCount() {
    return queue.length
  }

  function updateProgress() {
    const pct = (current / totalCount()) * 100
    els.fill.style.width = pct + '%'
    els.text.textContent = `${current} / ${totalCount()}`
  }

  function renderQuestion() {
    const q = queue[current]
    els.qText.textContent = q.text

    els.options.innerHTML = ''
    q.options.forEach((opt) => {
      const btn = document.createElement('button')
      btn.className = 'btn btn-option'
      btn.textContent = opt.label

      // [改] 回退时高亮之前已选的答案
      if (answers[q.id] === opt.value) {
        btn.classList.add('selected')
      }

      btn.addEventListener('click', () => selectOption(q, opt))
      els.options.appendChild(btn)
    })

    // [改] 控制"上一题"按钮：第 1 题开始显示
    if (els.prevBtn) {
      els.prevBtn.style.display = current > 0 ? 'inline-block' : 'none'
    }

    // [改] 控制"下一题"按钮：只有下一题已答过才显示（防止跳题）
    if (els.nextBtn) {
      const canGoNext = current < queue.length - 1 &&
                        queue[current + 1] &&
                        answers[queue[current + 1].id] !== undefined
      els.nextBtn.style.display = canGoNext ? 'inline-block' : 'none'
    }

    updateProgress()
  }

  // [改] 上一题
  function goPrev() {
    if (current > 0) {
      current--
      renderQuestion()
    }
  }

  // [改] 下一题（仅用于回退后向前翻阅）
  function goNext() {
    const canGoNext = current < queue.length - 1 &&
                      queue[current + 1] &&
                      answers[queue[current + 1].id] !== undefined
    if (canGoNext) {
      current++
      renderQuestion()
    }
  }

  function selectOption(question, option) {
    // [改] 先处理酒鬼门追问的插入/移除（应对回退后重新选择的情况）
    if (question.id === config.drinkGate.questionId) {
      const hasDrinkGateQ2 = queue.some(q => q.id === 'drink_gate_q2')
      const willTrigger = option.value === config.drinkGate.triggerValue

      if (hasDrinkGateQ2 && !willTrigger) {
        queue = queue.filter(q => q.id !== 'drink_gate_q2')
        isDrunk = false
      } else if (!hasDrinkGateQ2 && willTrigger) {
        queue = insertAfter(queue, question.id, drinkGateQ2)
      }
    }

    // [改] 截断当前题之后的所有答案（防止跳题 + 回退重选后清除旧答案）
    for (let i = current + 1; i < queue.length; i++) {
      delete answers[queue[i].id]
    }

    answers[question.id] = option.value

    // [改] 酒鬼状态重新判定（支持回退修改）
    if (question.id === 'drink_gate_q2') {
      isDrunk = option.value === config.drinkGate.drunkTriggerValue
    }

    current++
    if (current >= totalCount()) {
      onComplete(answers, isDrunk)
    } else {
      renderQuestion()
    }
  }

  function start() {
    current = 0
    answers = {}
    isDrunk = false
    queue = insertAtRandom(shuffle(questions.main), drinkGateQ1)
    renderQuestion()
  }

  // [改] 绑定导航按钮点击事件
  if (els.prevBtn) els.prevBtn.addEventListener('click', goPrev)
  if (els.nextBtn) els.nextBtn.addEventListener('click', goNext)

  return { start, renderQuestion, goPrev, goNext }
}