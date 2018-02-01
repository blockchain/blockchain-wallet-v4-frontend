import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Questions from './Questions/index'

import Faq from './template.js'

class FaqContainer extends React.Component {
  constructor (props) {
    super(props)

    this.filterFaq = this.filterFaq.bind(this)
  }
  componentWillMount () {
    console.log('faq will mount', this.props)
  }

  filterFaq (questions) {
    console.log('filterFaq', )
    return questions.filter(q => {
      return q.country !== 'US'
    })
  }

  render () {
    const filteredQuestions = this.filterFaq(this.props.questions)
    return <Faq questions={filteredQuestions} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  // goalsActions: bindActionCreators(actions.goals, dispatch),
  // routerActions: bindActionCreators(actions.router, dispatch)
})

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state),
  questions: Questions
})

export default connect(mapStateToProps, mapDispatchToProps)(FaqContainer)

// export default FaqContainer
