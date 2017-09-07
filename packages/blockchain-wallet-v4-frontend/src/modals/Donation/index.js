import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, actions as reduxFormActions } from 'redux-form'
import { convertFromUnit, getDecimals } from 'services/ConversionService'
import { singleForm } from 'providers/FormProvider'

import { actions, selectors } from 'data'
import Donation from './template.js'

class DonationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleSlide = this.handleSlide.bind(this)
    this.props.reduxFormActions.initialize('donationForm', { percentage: '0.05', charity: 'Global Giving' })
  }

  handleSelect (value) {
    console.log(value)
    this.props.reduxFormActions.change('donationForm', 'charity', value)
  }

  handleClick () {
    console.log('ADD THE COIN IN THE TRANSACTION')
  }

  handleBack () {
    this.props.modalActions.closeModal()
  }

  handleSlide (event) {
    console.log(event.target.value)
    this.props.reduxFormActions.change('donationForm', 'percentage', event.target.value)
  }

  render () {
    const { amount, network, unit, percentage, charity } = this.props
    const donation = parseFloat(amount) * percentage
    const newCoinValue = convertFromUnit(network, donation, unit).getOrElse({ amount: 0 })

    return <Donation
      {...this.props}
      charity={charity}
      percentage={percentage}
      donation={newCoinValue.amount}
      handleBack={this.handleBack}
      handleSelect={this.handleSelect}
      handleClick={this.handleClick}
      handleSlide={this.handleSlide}
    />
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('sendBitcoin')
  const selectorDonation = formValueSelector('donationForm')

  return {
    amount: selector(state, 'amount'),
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
    currency: selectors.core.settings.getCurrency(state),
    rates: selectors.core.btcRates.getBtcRates(state),
    decimals: getDecimals('bitcoin', selectors.core.settings.getBtcCurrency(state)),
    percentage: selectorDonation(state, 'percentage'),
    charity: selectorDonation(state, 'charity')
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  singleForm('donationForm')
)

export default enhance(DonationContainer)
