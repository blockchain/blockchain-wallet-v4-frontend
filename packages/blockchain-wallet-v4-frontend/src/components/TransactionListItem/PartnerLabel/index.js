import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { contains, any } from 'ramda'

import { Banner } from 'blockchain-info-components'

const LabelContainer = styled.div`
  margin-top: 5px;
`

const PartnerLabel = props => {
  const { txHash, shiftTrades } = props
  const shiftMatch = shiftTrades.map(trade => {
    if (trade.hashIn === txHash) return 'shift-deposit'
    if (trade.hashOut === txHash) return 'shift-receive'
  })
  const isShift = (match) => match === 'shift-deposit' || match === 'shift-receive'

  if (any(isShift)(shiftMatch)) {
    return (
      <LabelContainer mobileSize='14px' size='16px' weight={500} color={props.type} uppercase>
        <Banner partnerLabel>
          {
            contains('shift-deposit', shiftMatch)
              ? <FormattedMessage id='components.txlistitem.partnerlabel.depositedshapeshift' defaultMessage='ShapeShift Deposit' />
              : <FormattedMessage id='components.txlistitem.partnerlabel.receivedshapeshift' defaultMessage='Received from ShapeShift' />
          }
        </Banner>
      </LabelContainer>
    )
  }
  return null
}

PartnerLabel.propTypes = {
  txHash: PropTypes.string.isRequired
}

export default PartnerLabel
