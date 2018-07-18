import React from 'react'
import { injectIntl } from 'react-intl'
import { LinkEvent } from '../Events'

const Link = (props) => {
  let { children, href, ...rest } = props
  let parsedURL = null
  let to = href
  let doReplace = false

  try {
    parsedURL = new URL(to)
  } catch (error) {
    parsedURL = null
  }
  if (parsedURL === null && !href.startsWith('#')) {
    doReplace = true
  }
  // insert locale in front of link only if its relative and locale is not "en"
  if (doReplace && props.intl && props.intl.locale && props.intl.locale !== 'en') {
    to = '/' + props.intl.locale + (href.startsWith('/') ? href : '/' + href)
  }

  let newProps = {
    ...rest,
    href: to
  }
  if (props.event) {
    return <LinkEvent {...newProps}>{children}</LinkEvent>
  } else {
    return <a {...newProps}>{children}</a>
  }
}

export default injectIntl(Link)
