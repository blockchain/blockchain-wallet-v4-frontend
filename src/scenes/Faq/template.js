import React from 'react'
import CSSModules from 'react-css-modules'

import FaqRow from './FaqRow'
import Entry1 from './Entry1'
import Entry2 from './Entry2'
import Entry3 from './Entry3'
import Entry4 from './Entry4'
import Entry5 from './Entry5'
import Entry6 from './Entry6'
import Entry7 from './Entry7'
import Entry8 from './Entry8'

import style from './style.scss'

const Faq = (props) => {
  return (
    <section className='container-fluid padding-20 border-box'>
      <div className='row'>
        <span className='f-20 em-300'>Frequently Asked Questions</span>
      </div>
      <FaqRow component={Entry1} {...props} />
      <FaqRow component={Entry2} {...props} />
      <FaqRow component={Entry3} {...props} />
      <FaqRow component={Entry4} {...props} />
      <FaqRow component={Entry5} {...props} />
      <FaqRow component={Entry6} {...props} />
      <FaqRow component={Entry7} {...props} />
      <FaqRow component={Entry8} {...props} />
      <div className='row padding-vertical-40'>
        <div className='col-md-3 col-md-offset-4 flex-column flex-justify flex-center'>
          <span className='f-16 em-500'>Can't find what you're looking for?</span>
          <a className='button-primary full-width capitalize margin-top-10' href='https://blockchain.zendesk.com' target='_blank'>Support center</a>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Faq, style)
