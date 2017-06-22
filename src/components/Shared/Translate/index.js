import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { isNil } from 'ramda'

import { translate, convertLanguageToCultureCode } from 'services/translationService'
import { selectors } from 'data'
import Translate from './template.js'

const TranslateContainer = (props) => {
  // let translation = translate(props.translate, props.cultureCode, props.data).getOrElse('???')
  let translation = 'TEST'
  return (
    <Translate
      element={props.element}
      className={props.className}
      value={translation} />
  )
}

TranslateContainer.propTypes = {
  translate: PropTypes.string.isRequired,
  data: PropTypes.object,
  className: PropTypes.string,
  element: PropTypes.string
}

function mapStateToProps (state) {
  // Default settings
  let language = selectors.core.settings.getLanguage(state)
  let cultureCode = (!isNil(language) && language.length === 2) ? convertLanguageToCultureCode(language).getOrElse('en-GB') : language

  // Fallback to preferences
  if (isNil(cultureCode)) {
    cultureCode = selectors.preferences.getCulture(state)
  }
  // Fallback to browser default
  if (isNil(cultureCode)) {
    // We chec
    cultureCode = (navigator.languages && navigator.languages[0]) ||  // Chrome / Firefox
                   navigator.language || // All browsers
                   navigator.userLanguage // IE <= 10
  }
  // Fallback to english
  if (isNil(cultureCode)) {
    cultureCode = 'en-GB'
  }

  return {
    cultureCode
  }
}

export default connect(mapStateToProps)(TranslateContainer)
