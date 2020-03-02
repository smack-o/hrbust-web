(function flexible(window, document) {
  let docEl = document.documentElement
  let dpr = window.devicePixelRatio || 1

  // set 1rem = viewWidth / 3.75
  function setRemUnit() {
    let rem = docEl.clientWidth / 3.75
    window.rem = rem
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    let fakeBody = document.createElement('body')
    let testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
