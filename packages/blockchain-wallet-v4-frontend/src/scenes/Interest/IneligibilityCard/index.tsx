import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import {
  InterestEligibleType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import { SuccessStateType } from '..'

const AbsoluteWarning = styled(Text)`
  display: flex;
  align-items: center;
  left: 0;
  margin-bottom: 20px;
`
class IneligibiltyWarning extends PureComponent<Props & SuccessStateType> {
  componentDidMount() {
    this.props.interestActions.fetchInterestEligible()
  }

  render() {
    const { instruments, interestEligible } = this.props

    return interestEligible.cata({
      Success: val => {
        const ineligibilityReasonList = instruments.map(instrument => {
          return val[instrument]?.ineligibilityReason
        })
        return (
          <AbsoluteWarning size='12px' weight={500} color='grey600'>
            {ineligibilityReasonList.includes('REGION') && (
              <>
                <Icon
                  name='info'
                  color='grey600'
                  style={{ marginRight: '8px' }}
                />
                <FormattedMessage
                  id='scenes.interest.regionblocked'
                  defaultMessage='Blockchain Interest Account is currently not available in your country or region for some or all cryptos.'
                />
                <Link
                  size='12px'
                  weight={500}
                  target='_blank'
                  href='https://blockchain.zendesk.com/hc/en-us/articles/360043221472'
                  style={{ marginLeft: '4px' }}
                >
                  <FormattedMessage
                    id='buttons.learn_more'
                    defaultMessage='Learn More'
                  />
                </Link>
              </>
            )}
            {ineligibilityReasonList.includes('BLOCKED') && (
              <>
                <FormattedMessage
                  id='scenes.interest.userblocked.bo'
                  defaultMessage='Blockchain Interest Account is currently not available.'
                />{' '}
                <Link
                  size='12px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage
                    id='buttons.contact_support'
                    defaultMessage='Contact Support'
                  />
                </Link>
              </>
            )}
          </AbsoluteWarning>
        )
      },
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  interestEligible: selectors.components.interest.getInterestEligible(state)
})

const mapDispatchToProps = dispatch => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  interestEligible: RemoteDataType<string, InterestEligibleType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(IneligibiltyWarning)
