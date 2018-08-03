import React from 'react'
import PropTypes from 'prop-types'
import { getRemotePropType, getElementsPropType } from 'utils/proptypes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

class FirstStepContainer extends React.Component {
  componentDidMount () {
    this.props.actions.firstStepInitialized()
  }

  handleRefresh = () => {
    this.props.actions.firstStepInitialized()
  }

  render () {
    const { actions, data } = this.props
    return data.cata({
      Success: value => (
        <Success
          elements={value.elements}
          initialValues={value.initialValues}
          hasOneAccount={value.hasOneAccount}
          disabled={value.disabled}
          minimum={value.minimum}
          maximum={value.maximum}
          formError={value.formError}
          currency={value.currency}
          sourceCoin={value.sourceCoin}
          targetCoin={value.targetCoin}
          handleMaximum={actions.firstStepMaximumClicked}
          handleMinimum={actions.firstStepMinimumClicked}
          onSubmit={actions.firstStepSubmitClicked}
          handleSwap={actions.firstStepSwapClicked}
        />
      ),
      Failure: message => (
        <DataError onClick={this.handleRefresh} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const AccountPropType = PropTypes.shape({
  address: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  archived: PropTypes.bool.isRequired,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired
})

FirstStepContainer.propTypes = {
  data: getRemotePropType(
    PropTypes.shape({
      elements: getElementsPropType(AccountPropType).isRequired,
      formError: PropTypes.string,
      hasOneAccount: PropTypes.bool.isRequired,
      disabled: PropTypes.bool.isRequired,
      sourceCoin: PropTypes.string.isRequired,
      targetCoin: PropTypes.string.isRequired,
      initialValues: PropTypes.shape({
        source: AccountPropType.isRequired,
        target: AccountPropType.isRequired
      }).isRequired
    })
  )
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
