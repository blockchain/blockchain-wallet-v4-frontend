import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { IconWarningTriangle, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { selectors } from 'data'
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

const Sanctions = () => {
  const products = useSelector(selectors.custodial.getProductEligibilityForUser).data
  const message = products?.notifications?.length ? products?.notifications[0].message : null

  return (
    <Wrapper>
      <Row>
        <PendingIconWrapper>
          <IconWarningTriangle color={PaletteColors['orange-400']} label='alert' size='large' />
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
            {message || (
              <FormattedMessage
                id='modals.sanctions_notifications.description'
                defaultMessage='Currently, trading is not allowed due to regulatory sanctions.'
              />
            )}
          </Text>
        </Column>
      </CentralRow>

      <Link
        href='https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L:2022:259I:FULL&from=EN'
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
}

export default Sanctions
