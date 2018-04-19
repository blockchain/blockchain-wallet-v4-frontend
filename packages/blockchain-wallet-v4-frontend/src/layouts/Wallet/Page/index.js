import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Page from './template.js'

class PageContainer extends React.PureComponent {
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.page).addEventListener('scroll', this.debounce(this.updateScroll.bind(this), 1000))
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
    ReactDOM.findDOMNode(this.refs.page).removeEventListener('scroll', this.debounce(this.updateScroll.bind(this), 1000))
  }

  debounce (func, wait) {
    var timeout
    return function () {
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        timeout = null
        func.apply(this)
      }, wait)
    }
  }

  updateScroll () {
    const element = ReactDOM.findDOMNode(this)
    const xOffset = element.scrollLeft
    const yOffset = element.scrollTop
    const xMax = element.scrollWidth - element.offsetWidth
    const yMax = element.scrollHeight - element.offsetHeight
    this.props.scrollActions.updateScroll(xOffset, yOffset, xMax, yMax)
  }

  render () {
    return <Page ref='page' children={this.props.children} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  scrollActions: bindActionCreators(actions.scroll, dispatch)
})

export default connect(undefined, mapDispatchToProps)(PageContainer)
