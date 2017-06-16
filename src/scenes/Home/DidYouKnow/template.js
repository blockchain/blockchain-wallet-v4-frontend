
import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DidYouKnow = (props) => {
  return (
    <div className='container-fluid margin-top-20'>
      <div className='row justify-content-between'>
        <div className='col-6'>
          <span className='text-capitalize'>Did you know?</span>
        </div>
        <div className='col-6 right-align'>
          <span className={'f-13 text-uppercase ' + props.info.category.color}>{props.info.category.name}</span>
        </div>
      </div>
      <div className='row padding-top-20'>
        <div className='col border'>
          <div className='row justify-content-between align-items-center'>
            <div className='col-2 col-md-2 col-xl-1'>
              <i className={props.info.icon} styleName='icon' />
            </div>
            <div className='col col-md-10 col-xl-11'>
              <span className='f-24 blue'>{props.info.title}</span>
            </div>
          </div>
          <div className='row'>
            <div className='col margin-bottom-20'>
              <span className='f-16 alt-font'>{props.info.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(DidYouKnow, style)
