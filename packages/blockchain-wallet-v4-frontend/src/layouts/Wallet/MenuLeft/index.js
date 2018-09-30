import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { head, prop } from 'ramda'
import { getData } from './selectors'
import MenuLeft from './template'

class MenuLeftContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      offsetTop: 0
    }
  }

  componentDidMount () {
    this.setActiveNodeOffsetTop()
  }

  componentDidUpdate (prevProps) {
    this.setActiveNodeOffsetTop()
  }

  setActiveNodeOffsetTop () {
    try {
      const node = ReactDOM.findDOMNode(this)
      const activeNode = head(node.getElementsByClassName('active'))
      this.setState({ offsetTop: prop('offsetTop', activeNode) })
    } catch (e) {
      throw new Error(e)
    }
  }

  render () {
    const { offsetTop } = this.state
    return <MenuLeft toggled={this.props.toggled} offsetTop={offsetTop} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(MenuLeftContainer)
