import { shuffle, insertAtRandom, insertAfter } from './utils.js'

/**
 * 答题控制器
 */
export function createQuiz(questions, config, onComplete) {
  // 按顺序出题，不再随机打乱
  const mainQuestions = [...questions.main]
  const drinkGateQ1 = questions.special.find((q) => q.id === config.drinkGate.questionId)
  const drinkGateQ2 = questions.special.find((q) => q.id === 'drink_gate_q2')

  // 酒鬼门问题固定插入到第 5 题之后（索引 4 后面）
  let queue = insertAfter(mainQuestions, mainQuestions[4]?.id, drinkGateQ1)
  if (!queue.some(q => q.id === drinkGateQ1.id)) {
    queue = [...mainQuestions, drinkGateQ1]
  }

  let current = 0
  let answers = {}
  let isDrunk = false

  const els = {
    fill: document.getElementById('progress-fill'),
    text: document.getElementById('progress-text'),
    qText: document.getElementById('question-text'),
    options: document.getElementById('options'),
    prevBtn: document.getElementById('btn-prev'),
    nextBtn: document.getElementById('btn-next'),
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

      if (answers[q.id] === opt.value) {
        btn.classList.add('selected')
      }

      btn.addEventListener('click', () => selectOption(q, opt))
      els.options.appendChild(btn)
    })

    if (els.prevBtn) {
      els.prevBtn.style.display = current > 0 ? 'inline-block' : 'none'
    }

    if (els.nextBtn) {
      const canGoNext = current < queue.length - 1 &&
                        queue[current + 1] &&
                        answers[queue[current + 1].id] !== undefined
      els.nextBtn.style.display = canGoNext ? 'inline-block' : 'none'
    }

    updateProgress()
  }

  function goPrev() {
    if (current > 0) {
      current--
      renderQuestion()
    }
  }

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

    for (let i = current + 1; i < queue.length; i++) {
      delete answers[queue[i].id]
    }

    answers[question.id] = option.value

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
    // 按顺序重置队列
    const resetMain = [...questions.main]
    let newQueue = insertAfter(resetMain, resetMain[4]?.id, drinkGateQ1)
    if (!newQueue.some(q => q.id === drinkGateQ1.id)) {
      newQueue = [...resetMain, drinkGateQ1]
    }
    queue = newQueue
    renderQuestion()
  }

  if (els.prevBtn) els.prevBtn.addEventListener('click', goPrev)
  if (els.nextBtn) els.nextBtn.addEventListener('click', goNext)

  return { start, renderQuestion, goPrev, goNext }
}