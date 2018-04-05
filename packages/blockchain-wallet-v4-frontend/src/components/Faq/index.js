import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import FaqContent from './FaqContent'

import Faq from './template.js'

class FaqContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      filterText: ''
    }

    this.onFilter = this.onFilter.bind(this)
  }

  onFilter ({target: {value: filterText}}) {
    console.log('')
    this.setState({filterText})
  }

  render () {
    const { faqContent, handleTrayRightToggle } = this.props

    // Bad WIP
    faqContent[0].groupQuestions = this.state.filterText ? faqContent[0].groupQuestions.filter((q) =>
      q.question.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1 ||
      q.answer.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1
    ) : faqContent[0].groupQuestions

    return (
      <Faq filteredContent={faqContent} onFilter={this.onFilter} filterText={this.state.filterText} handleTrayRightToggle={handleTrayRightToggle}/>
    )
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state),
  faqContent: FaqContent
})

export default connect(mapStateToProps, undefined)(FaqContainer)
