import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const FaqRow = (props) => {
  console.log(props)
  return (
    <div className='row justify-content-between border-bottom' styleName='faq-row'>
      <div className='col-12'>
        <div className='d-flex flex-row justify-content-between h6' onClick={props.clickDetails}>
          {props.component.title}
          <i className='d-flex margin-right-20 icon-down_arrow' styleName={(!props.detailsDisplayed ? 'rotated' : '')} />
        </div>
        <div className={`d-flex flex-row justify-content-start ${(!props.detailsDisplayed ? ' hidden' : '')}`} styleName='description'>
          {props.component.description}
        </div>
      </div>
    </div>
  )
}

FaqRow.propTypes = {
  component: PropTypes.shape({
    title: PropTypes.object.isRequired,
    description: PropTypes.object.isRequired
  })
}

export default CSSModules(FaqRow, style)
