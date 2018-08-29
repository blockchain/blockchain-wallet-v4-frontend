import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { actions } from 'data'
// import Pages from './Pages'

class TransactionsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.initializeDashboard()
  }

  render () {
    const { data } = this.props
    // TODO: make pages of sorted data
    return data
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsContainer)
