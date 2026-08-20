import { shuffle, insertAtRandom, insertAfter } from './utils.js'

/**
 * 答题控制器
 */
export function createQuiz(questions, config, onComplete) {
  // 按顺序出题，不再随机打乱
  const mainQuestions = [...questions.main]

  // VICT gate
  const victGateQ1 = questions.special.find((q) => q.id === config.victGate.questionId)
  const victGateQ2 = questions.special.find((q) => q.id === 'vict_gate_q2')

  // JOKER gate
  const jokerGateQ1 = questions.special.find((q) => q.id === (config.jokerGate?.questionId || 'joker_gate_q1'))
  const jokerGateQ2 = questions.special.find((q) => q.id === 'joker_gate_q2')

  // VICT 插入到第 5 题之后（索引 4 后面）
  let queue = insertAfter(mainQuestions, mainQuestions[4]?.id, victGateQ1)
  if (!queue.some(q => q.id === victGateQ1.id)) {
    queue = [...mainQuestions, victGateQ1]
  }

  // JOKER 插入到第 18 题之后（索引 17 后面）
  queue = insertAfter(queue, mainQuestions[17]?.id, jokerGateQ1)
  if (!queue.some(q => q.id === jokerGateQ1.id)) {
    queue = [...queue, jokerGateQ1]
  }

  let current = 0
  let answers = {}
  let isVictim = false
  let isJoker = false
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
      // ========== VICT gate 处理 ==========
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

      // ========== JOKER gate 处理 ==========
      const jokerQ1Id = config.jokerGate?.questionId || 'joker_gate_q1'
      const jokerTriggerValue = config.jokerGate?.triggerValue || 3
      if (question.id === jokerQ1Id) {
        const hasJokerGateQ2 = queue.some(q => q.id === 'joker_gate_q2')
        const willTriggerJoker = option.value === jokerTriggerValue

        if (hasJokerGateQ2 && !willTriggerJoker) {
          queue = queue.filter(q => q.id !== 'joker_gate_q2')
          isJoker = false
        } else if (!hasJokerGateQ2 && willTriggerJoker) {
          queue = insertAfter(queue, question.id, jokerGateQ2)
        }
      }

      // 清除当前题之后所有已答记录（防止回退后重新选择导致状态混乱）
      for (let i = current + 1; i < queue.length; i++) {
        delete answers[queue[i].id]
      }

      answers[question.id] = option.value

      // VICT 触发判定
      if (question.id === 'vict_gate_q2') {
        isVictim = option.value === config.victGate.VictimTriggerValue
      }

      // JOKER 触发判定
      if (question.id === 'joker_gate_q2') {
        const jokerVictimTriggerValue = config.jokerGate?.VictimTriggerValue || 2
        isJoker = option.value === jokerVictimTriggerValue
      }

      current++
      if (current >= totalCount()) {
        onComplete(answers, { isVictim, isJoker })
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
    isJoker = false

    const resetMain = [...questions.main]

    // 重置 VICT gate
    let newQueue = insertAfter(resetMain, resetMain[4]?.id, victGateQ1)
    if (!newQueue.some(q => q.id === victGateQ1.id)) {
      newQueue = [...resetMain, victGateQ1]
    }

    // 重置 JOKER gate（插入到第 18 题后）
    newQueue = insertAfter(newQueue, resetMain[17]?.id, jokerGateQ1)
    if (!newQueue.some(q => q.id === jokerGateQ1.id)) {
      newQueue = [...newQueue, jokerGateQ1]
    }

    queue = newQueue
    renderQuestion()
  }

  if (els.prevBtn) els.prevBtn.addEventListener('click', goPrev)
  if (els.nextBtn) els.nextBtn.addEventListener('click', goNext)

  return { start, renderQuestion, goPrev, goNext }
}