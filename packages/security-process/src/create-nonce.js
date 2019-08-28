import createEmotion from 'create-emotion'

/* eslint-disable */
__webpack_nonce__ = window.NONCE
/* eslint-enable */

// for react-select
const context = typeof global !== 'undefined' ? global : {}

export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  createGlobalStyle,
  keyframes,
  css,
  sheet,
  caches
} = createEmotion(context, { nonce: window.NONCE })
