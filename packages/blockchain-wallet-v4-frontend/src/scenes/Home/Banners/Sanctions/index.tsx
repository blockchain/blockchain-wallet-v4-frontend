import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconWarningTriangle } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { BannerButton } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.orange900};
  border-radius: 8px;
  padding: 20px;
  ${media.atLeastLaptop`
    height: 96px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const CentralRow = styled(Row)`
  flex: 1;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
`

const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
`

const Sanctions = () => (
  <Wrapper>
    <Row>
      <PendingIconWrapper>
        <Icon label='alert' color='orange400' size='lg'>
          <IconWarningTriangle />
        </Icon>
      </PendingIconWrapper>
    </Row>
    <CentralRow>
      <Column>
        <Text size='20px' weight={600} color='grey800'>
          <FormattedMessage
            id='scenes.home.banner.sanctions_notifications.title'
            defaultMessage='Your Account has Restrictions Due to European Sanctions'
          />
        </Text>
        <Text size='16px' weight={500} color='grey800'>
          <FormattedMessage
            id='modals.sanctions_notifications.description'
            defaultMessage='Currently, trading is not allowed for balances over €10.000 due to regulatory sanctions. However, you can still hold or withdraw.'
          />
        </Text>
      </Column>
    </CentralRow>

    <Link
      href='https://ec.europa.eu/commission/presscorner/detail/en/ip_22_2332'
      target='_blank'
      rel='noopener noreferrer'
    >
      <BannerButton
        nature='primary'
        data-e2e='learnMoreSanctionsBanner'
        height='48px'
        size='16px'
        disabled={false}
      >
        <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
      </BannerButton>
    </Link>
  </Wrapper>
)

export default Sanctions
