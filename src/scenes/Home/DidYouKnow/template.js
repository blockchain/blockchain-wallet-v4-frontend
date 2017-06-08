
import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DidYouKnow = (props) => {
  return (
    <div className='container-fluid padding-20 border-box'>
      <div className='row flex-row flex-between flex-center padding-bottom-20'>
        <span className='f-16 em-400 capitalize'>Did you know?</span>
        <span className={'f-13 em-400 upper ' + props.info.category.color}>{props.info.category.name}</span>
      </div>
      <div className='row flex-column flex-start flex-center padding-15 border-box border'>
        <div className='row flex-row flex-start flex-center padding-vertical-10'>
          <i className={props.info.icon + ' padding-right-15'} styleName='icon' />
          <span className='f-24 em-300 blue'>{props.info.title}</span>
        </div>
        <div className='row'>
          <span className='f-16 em-300 alt-font'>{props.info.description}</span>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(DidYouKnow, style)
