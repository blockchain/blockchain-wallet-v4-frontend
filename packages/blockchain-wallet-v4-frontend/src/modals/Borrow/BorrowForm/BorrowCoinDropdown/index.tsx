import { CoinType } from 'core/types'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { RatesType } from 'data/types'
import React, { Component } from 'react'
import SelectBoxBtcAddresses from 'components/Form/SelectBoxBtcAddresses'

type OwnProps = {
  coin: CoinType
  rates: RatesType
}

type LinkStatePropsType = {
  elements: any
}

type Props = LinkStatePropsType & OwnProps

export class BorrowCoinDropdown extends Component<Props> {
  state = {}

  render () {
    return (
      <Field
        component={SelectBoxBtcAddresses}
        includeAll={false}
        name='collateral'
      />
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  elements: []
})

const mapDispatchToProps = {}

export default connect<LinkStatePropsType, {}, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(BorrowCoinDropdown)
