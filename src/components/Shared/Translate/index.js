import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { isNil } from 'ramda'

import { translate } from 'services/translationService'
import { selectors } from 'data'
import Translate from './template.js'

const TranslateContainer = (props) => {
  let translation = translate(props.translate, props.language, props.data).getOrElse('???')

  return (
    <Translate className={props.className} styleName={props.styleName} value={translation} />
  )
}

TranslateContainer.propTypes = {
  translate: PropTypes.string.isRequired,
  className: PropTypes.string,
  styleName: PropTypes.string,
  data: PropTypes.object
}

function mapStateToProps (state) {
  let language = selectors.core.settings.getLanguage(state)
  // Fallback to preferences
  if (isNil(language)) {
    language = selectors.preferences.getCulture(state)
  }
  // Fallback to browser default
  if (isNil(language)) {
    // We chec
    language = (navigator.languages && navigator.languages[0]) || // Chrome / Firefox
                        navigator.language ||   // All browsers
                        navigator.userLanguage // IE <= 10
  }
  // Fallback to english
  if (isNil(language)) {
    language = 'en-GB'
  }

  return {
    language: language
  }
}

export default connect(mapStateToProps)(TranslateContainer)
