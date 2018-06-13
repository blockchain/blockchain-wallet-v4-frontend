// this is a hack to disable react from complaining about not having a requestAnimationFrame (rAF) polyfill during test runs
// check this issue for info/updates ==> https://github.com/facebook/jest/issues/4545
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}
