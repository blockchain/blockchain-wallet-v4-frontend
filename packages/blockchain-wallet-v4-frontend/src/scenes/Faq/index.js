import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import Questions from './Questions/index'

import Faq from './template.js'

class FaqContainer extends React.Component {
  constructor (props) {
    super(props)

    this.filterFaq = this.filterFaq.bind(this)
  }

  filterFaq (questions) {
    // imagine canBuy and canAccessExchange are from this.props, which came from mapStateToProps
    const canBuy = true
    const canAccessExchange = true

    return questions.filter(q => {
      if (!canAccessExchange && q.filter === 'exchange') return
      if (!canBuy && q.filter === 'buy') return
      if (this.props.countryCode.data === 'US' && q.filter === 'exchange') return
      return q
    })
  }

  render () {
    const filteredQuestions = this.filterFaq(this.props.questions)
    return <Faq questions={filteredQuestions} />
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state),
  questions: Questions
})

export default connect(mapStateToProps, undefined)(FaqContainer)
