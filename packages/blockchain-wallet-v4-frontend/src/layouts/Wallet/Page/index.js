import React from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { debounce } from 'utils/helpers'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100% - 115px);
  width: 100%;
  overflow-y: auto;
  // ff ignores padding when overflow: auto
  @-moz-document url-prefix() {
    height: calc(100% - 175px);
  }
`

class PageContainer extends React.Component {
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.page).addEventListener(
      'scroll',
      debounce(this.updateScroll, 1000)
    )
  }

  componentDidUpdate (prevProps) {
    if (
      prevProps.children.props.computedMatch.url !==
      this.props.children.props.computedMatch.url
    ) {
      ReactDOM.findDOMNode(this).scrollTop = 0
    }
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    ReactDOM.findDOMNode(this.refs.page).removeEventListener(
      'scroll',
      debounce(this.updateScroll, 1000)
    )
  }

  updateScroll = () => {
    const element = ReactDOM.findDOMNode(this)
    const xOffset = element.scrollLeft
    const yOffset = element.scrollTop
    const xMax = element.scrollWidth - element.offsetWidth
    const yMax = element.scrollHeight - element.offsetHeight
    this.props.scrollActions.updateScroll(xOffset, yOffset, xMax, yMax)
  }

  render () {
    return <Wrapper ref='page' children={this.props.children} />
  }
}

const mapDispatchToProps = dispatch => ({
  scrollActions: bindActionCreators(actions.scroll, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(PageContainer)
