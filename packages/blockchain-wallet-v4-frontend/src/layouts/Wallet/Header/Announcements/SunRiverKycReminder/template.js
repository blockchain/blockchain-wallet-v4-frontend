import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  padding: 12px 25px;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme['marketing-primary']};
  overflow: hidden;
  ${media.mobile`
    display: none;
  `};
`

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
    <Wrapper>
      <ItemWrapper>
        <Icon name='xlm' color='white' weight={600} size='20px' />
        <Text
          style={{ marginLeft: '15px' }}
          color='white'
          size='14px'
          weight={300}
        >
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
    </Wrapper>
  )
}

SunRiverKycReminder.propTypes = {
  handleClick: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired
}

export default SunRiverKycReminder
