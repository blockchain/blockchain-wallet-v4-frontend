import { actions } from 'data'

// Simple redux middleware for stubbing out Segment's analytics
const segmentStub = () => (store) => (next) => (action) => {
  // We only want to set window.analytics once, if it's alraedy set, return next()
  if (window.analytics) return next(action)

  // Typewriter uses window.analytics.track() to track events so here we hijack that
  // and instead we call our own trackEvent action
  // @ts-ignore
  window.analytics = {
    track(key, properties) {
      store.dispatch(actions.analytics.trackEvent({ key, properties }))
    }
  }

  // Always be sure to call next() to continue
  return next(action)
}

export default segmentStub
