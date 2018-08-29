import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, tap } from 'ramda'

import { getRemotePropType, getElementsPropType } from 'utils/proptypes'
import { actions, model } from 'data'
import { getData } from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const extractFieldValue = (_, value) => value
const preventFormChanges = e => e.preventDefault()

const { EXCHANGE_FORM } = model.components.exchange

class FirstStepContainer extends React.Component {
  componentDidMount () {
    this.props.actions.firstStepInitialized()
  }

  handleRefresh = () => {
    this.props.actions.firstStepInitialized()
  }

  handleChangeFix = fix => {
    this.props.formActions.change(EXCHANGE_FORM, 'fix', fix)
  }

  render () {
    const { actions, data } = this.props
    return data.cata({
      Success: value => (
        <Success
          {...value}
          handleMaximum={actions.firstStepMaximumClicked}
          handleMinimum={actions.firstStepMinimumClicked}
          onSubmit={actions.firstStepSubmitClicked}
          handleSwap={actions.firstStepSwapClicked}
          handleSourceChange={compose(
            actions.changeSource,
            extractFieldValue
          )}
          handleTargetChange={compose(
            actions.changeTarget,
            extractFieldValue
          )}
          handleSourceAmountChange={compose(
            actions.changeSourceAmount,
            extractFieldValue,
            tap(preventFormChanges)
          )}
          handleTargetAmountChange={compose(
            actions.changeTargeteAmount,
            extractFieldValue,
            tap(preventFormChanges)
          )}
          handleSourceFiatAmountChange={compose(
            actions.changeSourceFiatAmount,
            extractFieldValue,
            tap(preventFormChanges)
          )}
          handleTargetFiatAmountChange={compose(
            actions.changeTargetFiatAmount,
            extractFieldValue,
            tap(preventFormChanges)
          )}
          handleSetFixedField={this.handleChangeFix}
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
      availablePairs: PropTypes.arrayOf(PropTypes.string),
      fromElements: getElementsPropType(AccountPropType).isRequired,
      toElements: getElementsPropType(AccountPropType).isRequired,
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
  ).isRequired
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
