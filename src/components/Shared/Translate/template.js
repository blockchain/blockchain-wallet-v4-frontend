import React from 'react'
import PropTypes from 'prop-types'

const Translate = (props) => {
  switch (props.element) {
    case 'h1': return <h1 className={props.className}>{props.value}</h1>
    case 'h2': return <h2 className={props.className}>{props.value}</h2>
    case 'h3': return <h3 className={props.className}>{props.value}</h3>
    case 'h4': return <h4 className={props.className}>{props.value}</h4>
    case 'h5': return <h5 className={props.className}>{props.value}</h5>
    case 'h6': return <h6 className={props.className}>{props.value}</h6>
    case 'p': return <p className={props.className}>{props.value}</p>
    case 'label': return <label className={props.className}>{props.value}</label>
    case 'span': return <span className={props.className}>{props.value}</span>
    default: return <span className={props.className}>{props.value}</span>
  }
}

Translate.propTypes = {
  value: PropTypes.string.isRequired,
  element: PropTypes.string,
  className: PropTypes.string
}

export default Translate
