import { shuffle, insertAtRandom, insertAfter } from './utils.js'

/**
 * 答题控制器
 */
export function createQuiz(questions, config, onComplete) {
  // 按顺序出题，不再随机打乱
  const mainQuestions = [...questions.main]
  const victGateQ1 = questions.special.find((q) => q.id === config.victGate.questionId)
  const victGateQ2 = questions.special.find((q) => q.id === 'vict_gate_q2')

  // 酒鬼门问题固定插入到第 5 题之后（索引 4 后面）
  let queue = insertAfter(mainQuestions, mainQuestions[4]?.id, victGateQ1)
  if (!queue.some(q => q.id === victGateQ1.id)) {
    queue = [...mainQuestions, victGateQ1]
  }

  let current = 0
  let answers = {}
  let isVictim = false
  let isLocked = false

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

      btn.addEventListener('click', () => selectOption(q, opt, btn))
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

  function selectOption(question, option, btnEl) {
    if (isLocked) return
    isLocked = true

    if (btnEl) btnEl.classList.add('selected')

    setTimeout(() => {
      if (question.id === config.victGate.questionId) {
        const hasvictGateQ2 = queue.some(q => q.id === 'vict_gate_q2')
        const willTrigger = option.value === config.victGate.triggerValue

        if (hasvictGateQ2 && !willTrigger) {
          queue = queue.filter(q => q.id !== 'vict_gate_q2')
          isVictim = false
        } else if (!hasvictGateQ2 && willTrigger) {
          queue = insertAfter(queue, question.id, victGateQ2)
        }
      }

      for (let i = current + 1; i < queue.length; i++) {
        delete answers[queue[i].id]
      }

      answers[question.id] = option.value

      if (question.id === 'vict_gate_q2') {
        isVictim = option.value === config.victGate.VictimTriggerValue
      }

      current++
      if (current >= totalCount()) {
        onComplete(answers, isVictim)
      } else {
        renderQuestion()
      }

      isLocked = false
    }, 200)
  }

  function start() {
    current = 0
    answers = {}
    isVictim = false
    // 按顺序重置队列
    const resetMain = [...questions.main]
    let newQueue = insertAfter(resetMain, resetMain[4]?.id, victGateQ1)
    if (!newQueue.some(q => q.id === victGateQ1.id)) {
      newQueue = [...resetMain, victGateQ1]
    }
    queue = newQueue
    renderQuestion()
  }

  if (els.prevBtn) els.prevBtn.addEventListener('click', goPrev)
  if (els.nextBtn) els.nextBtn.addEventListener('click', goNext)

  return { start, renderQuestion, goPrev, goNext }
}