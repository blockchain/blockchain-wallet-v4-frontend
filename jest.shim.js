// this is a hack to disable react from complaining about not having a rAF polyfill during test runs
// https://github.com/facebook/jest/issues/4545
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};
