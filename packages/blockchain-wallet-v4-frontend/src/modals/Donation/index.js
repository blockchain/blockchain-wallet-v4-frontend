import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, actions as reduxFormActions } from 'redux-form'
import { convertFromUnit, getDecimals } from 'services/ConversionService'
import { singleForm } from 'providers/FormProvider'
import modalEnhancer from 'providers/ModalEnhancer'

import { actions, selectors } from 'data'
import Donation from './template.js'

class DonationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleSlide = this.handleSlide.bind(this)

    this.props.reduxFormActions.initialize('donation', { percentage: 0.05, charity: 'Global Giving', coin: undefined })
  }

  handleSelect (value) {
    this.props.reduxFormActions.change('donation', 'charity', value)
  }

  handleClick () {
    const { amount, percentage, charity, network, unit } = this.props

    const donation = convertAmountInDonation(amount, percentage, network, unit)
    console.log(donation)

    const output = selectCharityOutput(charity)
    console.log(output)

    // this.props.reduxFormActions.change('donation', 'coin', )

    // this.props.modalActions.closeModal()
  }

  handleBack () {
    this.props.modalActions.closeModal()
  }

  handleSlide (event) {
    this.props.reduxFormActions.change('donation', 'percentage', event.target.value)
  }

  render () {
    console.log(this.props)
    const { amount, percentage, network, unit } = this.props
    console.log(amount, percentage)
    const donation = convertAmountInDonation(amount, percentage, network, unit)
    console.log(donation)

    return <Donation
      {...this.props}
      donation={donation}
      handleBack={this.handleBack}
      handleSelect={this.handleSelect}
      handleClick={this.handleClick}
      handleSlide={this.handleSlide}
    />
  }
}

const convertAmountInDonation = (amount, percentage, network, unit) => {
  const donation = parseFloat(amount) * parseFloat(percentage || 0)
  return convertFromUnit(network, donation, unit).getOrElse({ amount: 0 }).amount
}

const selectCharityOutput = charity => {
  switch (charity) {
    case 'Global Giving': return 'address1'
    case 'World Land Trust': return 'address2'
    case 'Tech Soup': return 'address3'
    default: return 'address0'
  }
}

const mapStateToProps = (state) => {
  const selectorDonation = formValueSelector('donation')

  return {
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
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
  singleForm('donation'),
  modalEnhancer('Donation'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(DonationContainer)
