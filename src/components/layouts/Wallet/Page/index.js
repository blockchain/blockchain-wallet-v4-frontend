import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isNil } from 'ramda'

import { actions, selectors } from 'data'
import Page from './template.js'

class WalletLayoutContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.scrollUpdateDelay = 500
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount () {
    if (!isNil(this.props.scroll)) { this.props.scrollActions.resetScroll() }
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
  }

  handleScroll () {
    if (this.timeout) { clearTimeout(this.timeout) }
    this.timeout = setTimeout(() => {
      const element = ReactDOM.findDOMNode(this)
      const xOffset = element.scrollLeft
      const yOffset = element.scrollTop
      const xMax = element.scrollWidth - element.offsetWidth
      const yMax = element.scrollHeight - element.offsetHeight
      this.props.scrollActions.updateScroll(xOffset, yOffset, xMax, yMax)
    }, this.scrollUpdateDelay)
  }

  render () {
    return <Page {...this.props} handleScroll={this.handleScroll} />
  }
}

const mapStateToProps = (state) => {
  return {
    scroll: selectors.scroll.selectScroll
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    scrollActions: bindActionCreators(actions.scroll, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletLayoutContainer)
