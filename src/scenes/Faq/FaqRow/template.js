import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const FaqRow = (props) => {
  return (
    <div className='row flex-row flex-align-start padding-vertical-40 border-bottom'>
      <div className='col-md-11'>
        <div className='row'>
          <span className='f-16 em-500' onClick={props.clickDetails}>
            {props.component.title}
          </span>
        </div>
        <div className={`row f-16 alt-font padding-top-30 ${(!props.detailsDisplayed ? ' hidden' : '')}`}>
          {props.component.content}
        </div>
      </div>
      <div className='col-md-1 flex-center'>
        <i className='f-16 icon-down_arrow pointer' styleName={(!props.detailsDisplayed ? 'rotated' : '')} onClick={props.clickDetails} />
      </div>
    </div>
  )
}

export default CSSModules(FaqRow, style)
