import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const InfoWell = ({ children }) => (
  <div styleName='info-well'>
    {children}
  </div>
)

InfoWell.propTypes = {
  children: PropTypes.string.isRequired
}

export default CSSModules(InfoWell, style)
