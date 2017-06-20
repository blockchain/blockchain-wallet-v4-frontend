import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import style from './style.scss'

const FaqRow = (props) => {
  return (
    <div className='row justify-content-between padding-vertical-40 border-bottom'>
      <div className='col-12'>
        <div className='d-flex flex-row justify-content-between' onClick={props.clickDetails}>
          <Translate className='d-flex h6' translate={props.title} />
          <i className='d-flex margin-right-20 icon-down_arrow' styleName={(!props.detailsDisplayed ? 'rotated' : '')} />
        </div>
        <div className={`d-flex flex-row w-75 justify-content-start padding-top-30 ${(!props.detailsDisplayed ? ' hidden' : '')}`}>
          <Translate translate={props.description} />
        </div>
      </div>
    </div>
  )
}

FaqRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default CSSModules(FaqRow, style)
