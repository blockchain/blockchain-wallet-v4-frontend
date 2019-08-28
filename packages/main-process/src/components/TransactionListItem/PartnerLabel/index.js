import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Banner } from 'blockchain-info-components'

const LabelContainer = styled.div`
  margin-top: 5px;
`
const PartnerBanner = styled(Banner)`
  padding: 3px 5px;
`
const capitalize = text => text[0].toUpperCase() + text.substring(1)

const PartnerLabel = props => {
  const { txType, partnerLabel, buySellPartner } = props

  if (partnerLabel === 'shift') {
    return (
      <LabelContainer
        mobileSize='14px'
        size='16px'
        weight={500}
        color={props.type}
        uppercase
      >
        <PartnerBanner>
          {txType === 'sent' ? (
            <FormattedMessage
              id='components.txlistitem.partnerlabel.depositedshapeshift'
              defaultMessage='ShapeShift Deposit'
            />
          ) : (
            <FormattedMessage
              id='components.txlistitem.partnerlabel.receivedshapeshift'
              defaultMessage='Received from ShapeShift'
            />
          )}
        </PartnerBanner>
      </LabelContainer>
    )
  }

  if (partnerLabel === 'buy-sell' && buySellPartner) {
    return (
      <LabelContainer
        mobileSize='14px'
        size='16px'
        weight={500}
        color={props.type}
        uppercase
      >
        <PartnerBanner partnerLabel>
          {txType === 'sent' ? (
            <FormattedMessage
              id='components.txlistitem.partnerlabel.soldvia'
              defaultMessage='Sold via {partner}'
              values={{ partner: capitalize(buySellPartner) }}
            />
          ) : (
            <FormattedMessage
              id='components.txlistitem.partnerlabel.boughtvia'
              defaultMessage='Bought via {partner}'
              values={{ partner: capitalize(buySellPartner) }}
            />
          )}
        </PartnerBanner>
      </LabelContainer>
    )
  }

  return null
}

PartnerLabel.propTypes = {
  txType: PropTypes.string.isRequired,
  buySellPartner: PropTypes.string
}

export default PartnerLabel
