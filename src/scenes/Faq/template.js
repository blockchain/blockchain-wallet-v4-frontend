import React from 'react'
import { FormattedMessage } from 'react-intl'

import FaqRow from 'components/shared/FaqRow'
import Question1 from './Question1'
import Question2 from './Question2'
import Question3 from './Question3'
import Question4 from './Question4'
import Question5 from './Question5'
import Question6 from './Question6'
import Question7 from './Question7'
import Question8 from './Question8'

const Faq = () => {
  return (
    <section className='container-fluid col-12 padding-20'>
      <div className='row'>
        <div className='col-12 h5 text-capitalize'>
          <FormattedMessage id='scenes.faq.title' defaultMessage='Frequented asked questions' />
        </div>
      </div>
      <FaqRow component={Question1} />
      <FaqRow component={Question2} />
      <FaqRow component={Question3} />
      <FaqRow component={Question4} />
      <FaqRow component={Question5} />
      <FaqRow component={Question6} />
      <FaqRow component={Question7} />
      <FaqRow component={Question8} />
      <div className='row justify-content-center padding-vertical-40'>
        <div className='col-auto d-flex flex-column justify-content-center'>
          <div className='d-flex justify-content-center font-weight-bold'>
            <FormattedMessage id='scenes.faq.needmorehelp' defaultMessage="Can't find what you're looking for?" />
          </div>
          <a className='d-flex justify-content-center button-secondary full-width text-capitalize margin-top-10' href='https://blockchain.zendesk.com' target='_blank'>
            <FormattedMessage id='scenes.faq.supportcenter' defaultMessage='Support center' />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Faq
