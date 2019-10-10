import React, { useState } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const InnerWrapperWidth = 280
const CopyWrapperWidth = 200
const WrapperPaddingX = 30
const WrapperPaddingY = 20

const PitCalloutWrapper = styled(Wrapper)`
  width: auto;
  top: 50%;
  right: -20px;
  position: absolute;
  flex-direction: column;
  transform: translateY(-50%);
  padding: ${WrapperPaddingY}px ${WrapperPaddingX}px;
  transition: transform 0.8s 0.7s, opacity 0.8s 0.7s;
  &.active {
    transform: translateY(-50%)
      translateX(${InnerWrapperWidth + WrapperPaddingX - 20}px);
    .footer {
      opacity: 1;
    }
  }
  @media (max-width: 1052px) {
    display: none;
  }
`
const InnerWrapper = styled.div`
  width: ${InnerWrapperWidth}px;
`
const CopyWrapper = styled.div`
  width: ${CopyWrapperWidth}px;
  padding-left: ${WrapperPaddingX}px;
`
const Copy = styled.div`
  margin: 8px 0 16px 0;
`
const FooterLink = styled(Link)`
  opacity: 0;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`
const GoLink = styled.div`
  margin-left: 8px;
  border: 2px solid ${props => props.theme['gray-1']};
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 8px;
  span {
    transform: rotate(-90deg);
    font-weight: 600;
  }
`

const PitCallout = ({ abTestR, domainsR }) => {
  const [isCalloutVisible, showCallout] = useState(false)
  const domain = prop(
    'thePit',
    domainsR.getOrElse({ thePit: 'https://pit.blockchain.com' })
  )
  const campaign = ''

  return campaign === 'original' ? null : (
    <PitCalloutWrapper className={isCalloutVisible && 'active'}>
      <Link
        href={`${domain}${
          campaign === 'pit_signup' ? '/trade/signup' : ''
        }?utm_source=web_wallet&utm_medium=wallet_signup&utm_campaign=${campaign}`}
        rel='noopener noreferrer'
        target='_blank'
      >
        <InnerWrapper>
          <CopyWrapper>
            <Text color='gray-6' size='20px' weight={600}>
              <FormattedMessage
                id='components.pitcallout.tradeinthepit'
                defaultMessage='Trade in The PIT.'
              />
            </Text>
            <Copy>
              <Text color='textBlack' size='12px' weight={500}>
                <FormattedMessage
                  id='components.pitcallout.tradecrypto'
                  defaultMessage='Trade crypto & fiat in The PIT, Blockchain’s new lightning fast exchange.'
                />
              </Text>
            </Copy>
          </CopyWrapper>
          <Image
            width='100%'
            onLoad={() => showCallout(true)}
            name='pit-macbook-gold'
            srcset={{
              'pit-macbook-gold2': '2x',
              'pit-macbook-gold3': '3x'
            }}
          />
          <FooterLink
            href={`${domain}${
              campaign === 'pit_signup' ? '/trade/signup' : ''
            }?utm_source=web_wallet&utm_medium=wallet_signup&utm_campaign=${campaign}`}
            className='footer'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Text color='blue' weight={600}>
              Check It Out
            </Text>
            <GoLink>
              <Icon name='down-arrow-filled' color='brand-secondary' />
            </GoLink>
          </FooterLink>
        </InnerWrapper>
      </Link>
    </PitCalloutWrapper>
  )
}

export default PitCallout
