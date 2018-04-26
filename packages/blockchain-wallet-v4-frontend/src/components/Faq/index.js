import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { any, contains, path, toLower } from 'ramda'
import { selectors } from 'data'
import FaqContent from './FaqContent'

import Faq from './template.js'

class FaqContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      filterText: ''
    }

    this.onFilter = this.onFilter.bind(this)
  }

  onFilter ({target: {value: filterText}}) {
    this.setState({filterText})
  }

  render () {
    const { faqContent, handleTrayRightToggle } = this.props

    // Search for matching messages in the component subtree starting
    const containsRecursive = (x) => {
      const lowerFilterText = toLower(this.state.filterText)
      if (path(['props', 'defaultMessage'], x)) {
        return contains(lowerFilterText, toLower(this.context.intl.messages[x.props.id] || x.props.defaultMessage))
      } else if (path(['props', 'children'], x)) {
        return any(containsRecursive, path(['props', 'children'], x))
      } else {
        return false
      }
    }

    faqContent.map(
      contentPart => {
        contentPart.groupQuestions = this.state.filterText ? contentPart.groupQuestions.filter((q) =>
          containsRecursive(q.question) || containsRecursive(q.answer)
        ) : contentPart.groupQuestions
      }
    )

    return (
      <Faq filteredContent={faqContent} onFilter={this.onFilter} filterText={this.state.filterText} handleTrayRightToggle={handleTrayRightToggle}/>
    )
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state),
  faqContent: FaqContent
})

FaqContainer.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps, undefined)(FaqContainer)
