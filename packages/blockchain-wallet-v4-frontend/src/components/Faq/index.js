import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { any, assoc, contains, curry, filter, map, path, toLower } from 'ramda'

import FaqContent from './FaqContent'
import { getData } from './selectors'
import Faq from './template.js'

class FaqContainer extends React.PureComponent {
  render () {
    const { data, handleTrayRightToggle } = this.props
    const { search } = data

    // Search for matching messages in the component subtree starting
    const containsRecursive = curry((search, x) => {
      if (path(['props', 'defaultMessage'], x)) {
        return contains(toLower(search), toLower(this.context.intl.messages[x.props.id] || x.props.defaultMessage))
      } else if (path(['props', 'children'], x)) {
        return any(containsRecursive(search), path(['props', 'children'], x))
      } else {
        return false
      }
    })

    const filterContent = (contentPart) => {
      if (search) {
        const filteredGroupQuestions = filter(q =>
          containsRecursive(search, q.question) || containsRecursive(search, q.answer)
        )(contentPart.groupQuestions)
        return assoc('groupQuestions', filteredGroupQuestions, contentPart)
      } else {
        return contentPart
      }
    }

    return (
      <Faq filteredContent={map(filterContent, FaqContent)} handleTrayRightToggle={handleTrayRightToggle}/>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

FaqContainer.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default connect(mapStateToProps, undefined)(FaqContainer)
