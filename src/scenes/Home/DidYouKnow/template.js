
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DidYouKnow = (props) => {
  return (
    <div className='container-fluid' styleName='did-you-know'>
      <div className='row padding-bottom-20 justify-content-between'>
        <div className='col-auto h6 text-capitalize'>
          <FormattedMessage id='scenes.home.didyouknow.title' defaultMessage='Did you know?' />
        </div>
        <div className='col-auto'>
          <span className={'h6 text-uppercase ' + props.info.category.color}>{props.info.category.name}</span>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 padding-20 border'>
          <div className='row padding-bottom-10'>
            <div className='col-12'>
              <i className={`h3 padding-right-10 ${props.info.icon}`} styleName='icon' />
              <span className='h6'>{props.info.title}</span>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <span>{props.info.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DidYouKnow.propTypes = {
  info: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })
}

export default CSSModules(DidYouKnow, style)
