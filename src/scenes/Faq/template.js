import React from 'react'
import CSSModules from 'react-css-modules'

import FaqRow from './FaqRow'
import Entry1 from './Entry1'
import Entry2 from './Entry2'

import style from './style.scss'

const Faq = (props) => {
  return (
    <section className='container-fluid padding-20 border-box'>

      <div className='row'>
        <span className='f-20 em-300'>Frequently Asked Questions</span>
      </div>

      <FaqRow component={Entry1} {...props} />
      <FaqRow component={Entry2} {...props} />

    </section>
  )
}

export default CSSModules(Faq, style)
