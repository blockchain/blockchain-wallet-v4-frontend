import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { head, prop } from 'ramda'
import { getData } from './selectors'
import MenuLeft from './template.success'
import Loading from './template.loading'
import Failure from './template.failure'

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
    window.requestAnimationFrame(() => this.setActiveNodeOffsetTop())
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
    const { data } = this.props
    const { offsetTop } = this.state
    return data.cata({
      Success: val => <MenuLeft {...val} offsetTop={offsetTop} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: msg => <Failure msg={msg} />
    })
  }
}

const mapStateToProps = state => ({ data: getData(state) })

export default connect(mapStateToProps)(MenuLeftContainer)
