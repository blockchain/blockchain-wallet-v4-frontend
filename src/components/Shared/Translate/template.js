import React from 'react'
import PropTypes from 'prop-types'

const Translate = (props) => {
  return (
    <span className={props.className}>{props.value}</span>
  )
}

Translate.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  styleName: PropTypes.string
}

export default Translate
