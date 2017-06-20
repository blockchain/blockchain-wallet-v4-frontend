import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import FaqRow from './FaqRow'
import style from './style.scss'

const Faq = (props) => {
  return (
    <section className='container-fluid padding-20'>
      <div className='row'>
        <div className='col-12'>
          <Translate className='h5' translate='FAQ_FULL' />
        </div>
      </div>
      { props.items.map(function (value, index) {
        return (<FaqRow key={index} title={value.title} description={value.description} />)
      })}
      <div className='row justify-content-center padding-vertical-40'>
        <div className='col-auto d-flex flex-column justify-content-center'>
          <Translate className='d-flex font-weight-bold' translate='NEED_MORE_HELP' />
          <a className='d-flex justify-content-center button-secondary full-width margin-top-10' href='https://blockchain.zendesk.com' target='_blank'>
            <Translate translate='VISIT_SUPPORT' />
          </a>
        </div>
      </div>
    </section>
  )
}

Faq.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }))
}

export default CSSModules(Faq, style)
