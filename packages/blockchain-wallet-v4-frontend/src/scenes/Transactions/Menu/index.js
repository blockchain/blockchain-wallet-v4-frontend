import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions } from 'data'
import Menu from './template.js'
import { getData } from 'components/Form/SelectBoxBtcAddresses/selectors'

class MenuContainer extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => (
        <Menu
          accounts={value.data}
          coin={this.props.coin}
          handleClickReporting={() => this.props.actions.reportClicked()}
        />
      ),
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.btcTransactions, dispatch)
})

MenuContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH'])
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer)
