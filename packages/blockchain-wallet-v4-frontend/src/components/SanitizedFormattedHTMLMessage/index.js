import React from 'react'
import PropTypes from 'prop-types'
import { FormattedHTMLMessage } from 'react-intl'
import sanitizeHtml from 'sanitize-html'

class SanitizedFormattedHTMLMessage extends React.Component {
  clean (dirty) {
    return sanitizeHtml(dirty, { allowedTags: ['span', 'a'] })
  }

  render () {
    const { id, defaultMessage } = this.props
    const clean = this.clean(defaultMessage)
    return clean
    // return clean ? <FormattedHTMLMessage id={id} defaultMessage={clean} /> : null
  }
}

SanitizedFormattedHTMLMessage.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired
}

export default SanitizedFormattedHTMLMessage
