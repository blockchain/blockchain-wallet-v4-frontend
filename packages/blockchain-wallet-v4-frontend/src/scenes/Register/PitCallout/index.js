import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { prop } from 'ramda'
import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const popoutKeyFrame = keyframes`
  0%, 10%, 20%, 30%, 70%, 80%, 90%, 100% { right: -40px; }
  40%, 50%, 60% { right: -70px; }
`
const popoutAnimation = css`
  animation: ${popoutKeyFrame} 5s infinite
    cubic-bezier(0.68, -0.55, 0.265, 1.55);
`
const InnerWrapperWidth = 280
const CopyWrapperWidth = 200
const WrapperPaddingX = 30
const WrapperPaddingY = 20

const PitCalloutWrapper = styled(Wrapper)`
  width: auto;
  top: 50%;
  right: -40px;
  position: absolute;
  flex-direction: column;
  transform: translateY(-50%);
  padding: ${WrapperPaddingY}px ${WrapperPaddingX}px;
  ${popoutAnimation};
  transition: all 0.3s;
  &:hover {
    transform: translateY(-50%) translateX(${InnerWrapperWidth - 10}px);
    animation: initial;
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
  const domain = prop(
    'thePit',
    domainsR.getOrElse({ thePit: 'https://pit.blockchain.com' })
  )
  const campaign = abTestR.getOrElse('original')

  return campaign === 'original' ? null : (
    <PitCalloutWrapper>
      <InnerWrapper>
        <CopyWrapper>
          <Text color='gray-6' size='20px' weight={600}>
            Trade Like the Pros.
          </Text>
          <Text color='gray-6' size='20px' weight={600}>
            Trade in The PIT.
          </Text>
          <Copy>
            <Text color='textBlack' size='12px' weight={500}>
              We built a Crypto Exchange. Instantly Exchange over 26 pairs of
              Crypto and Cash.
            </Text>
          </Copy>
        </CopyWrapper>
        <Image
          width='100%'
          name='pit-macbook-gold'
          srcset={{
            'pit-macbook-gold2': '2x',
            'pit-macbook-gold3': '3x'
          }}
        />
        <FooterLink
          href={`${domain}/?utm_source=web_wallet&utm_medium=wallet_signup&utm_campaign=${campaign}`}
          className='footer'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Text color='blue' weight={600}>
            Check It Out
          </Text>
          <GoLink>
            <Icon name='down-arrow-filled' color='brand-secondary' />
          </GoLink>
        </FooterLink>
      </InnerWrapper>
    </PitCalloutWrapper>
  )
}

export default PitCallout
