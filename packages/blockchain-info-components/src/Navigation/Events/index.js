import React from 'react'

function _trackEvent (eventName, isButton, props) {
  let properties = Object.assign({}, props || {}, {
    category: isButton ? 'button' : 'link',
    label: eventName
  })

  if (typeof window !== 'undefined' && window.analytics) {
    try {
      window.analytics.track('click', properties)
    } catch (err) {}
  }
}

export function trackEvent (eventName, props) {
  return _trackEvent(eventName, false, props)
}

export function trackButtonEvent (eventName, props) {
  return _trackEvent(eventName, true, props)
}

export const LinkEvent = props => {
  const {
    href,
    target,
    download,
    rel,
    children,
    event,
    eventProps,
    ...rest
  } = props
  return (
    <a
      href={href}
      target={target}
      download={download}
      rel={rel}
      onClick={() => {
        if (event) {
          trackEvent(event, eventProps)
        }
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export default undefined
