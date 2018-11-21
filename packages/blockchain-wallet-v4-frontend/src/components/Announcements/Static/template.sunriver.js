import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
`
const Action = styled(Text)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const SunRiverKycReminder = props => {
  const { goToKyc } = props

  return (
    <React.Fragment>
      <ItemWrapper>
        <Icon name='xlm' color='white' weight={600} size='20px' />
        <Text style={{ marginLeft: '15px' }} color='white' size='14px'>
          <FormattedMessage
            id='layouts.wallet.header.announcements.sunriverkycremdinder.title'
            defaultMessage='Complete your identity verification to claim your XLM.'
          />
        </Text>
      </ItemWrapper>
      <ItemWrapper>
        <Action color='white' size='16px' weight={400} onClick={goToKyc}>
          <FormattedMessage
            id='layouts.wallet.header.announcements.sunriverkycremdinder.completenow'
            defaultMessage='Complete Now'
          />
        </Action>
      </ItemWrapper>
    </React.Fragment>
  )
}

SunRiverKycReminder.propTypes = {
  goToKyc: PropTypes.func.isRequired
}

export default SunRiverKycReminder
