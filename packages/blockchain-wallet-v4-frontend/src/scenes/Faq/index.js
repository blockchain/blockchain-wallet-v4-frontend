import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import Questions from './Questions/index'

import { and, equals, filter } from 'ramda'

import Faq from './template.js'

class FaqContainer extends React.Component {
  constructor (props) {
    super(props)

    this.filterFaq = this.filterFaq.bind(this)
  }

  filterFaq (questions) {
    // canBuy, canAccessExchange, etc.. will eventually come from this.props
    const canBuy = false
    const canAccessExchange = true

    const filterQuestion = q => {
      if (and(!canAccessExchange, equals(q.filter, 'exchange'))) return
      if (and(!canBuy, equals(q.filter, 'buy'))) return
      if (and(equals(this.props.countryCode.data, 'US'), equals(q.filter, 'exchange'))) return
      return q
    }

    return filter(filterQuestion, questions)
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
