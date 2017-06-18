import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { isNil } from 'ramda'

import { translate } from 'services/translationService'
import { selectors } from 'data'
import Translate from './template.js'

const TranslateContainer = (props) => {
  let translation = translate(props.translate, props.language).getOrElse('???')

  return (
    <Translate className={props.className} value={translation} />
  )
}

TranslateContainer.propTypes = {
  key: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.object
}

function mapStateToProps (state) {
  let preferredLanguage = selectors.core.settings.getLanguage(state)
  // Fallback
  if (isNil(preferredLanguage)) {
    preferredLanguage = navigator.languages && navigator.languages[0] || // Chrome / Firefox
                        navigator.language ||   // All browsers
                        navigator.userLanguage; // IE <= 10
    preferredLanguage = preferredLanguage.substring(0, 2)
  }

  return {
    language: preferredLanguage
  }
}

export default connect(mapStateToProps)(TranslateContainer)
