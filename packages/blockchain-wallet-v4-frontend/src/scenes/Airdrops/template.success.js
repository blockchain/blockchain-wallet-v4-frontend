import { Button, Icon, Text } from 'blockchain-info-components'
import { Cartridge } from '@blockchain-com/components'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import React from 'react'
import styled from 'styled-components'

const { KYC_STATES } = model.profile

export const Container = styled.div`
  display: flex;
  > div {
    margin-right: 24px;
    &:last-child {
      margin-right: 0px;
    }
  }
`
const Box = styled.div`
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme['grey000']};
  max-width: 300px;
`
const Copy = styled(Text)`
  margin-top: 8px;
  line-height: 1.5;
`
const Footer = styled.div`
  margin-top: 42px;
`
const AirdropBox = styled(Box)`
  background-image: url('/img/airdrop-welcome.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/airdrop-welcome.png') 1x,
    url('/img/airdrop-welcome@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
`
const CustomCartridge = styled(Cartridge)`
  text-transform: none;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 14px;
  margin-left: 0px;
`
const GreyCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['grey000']};
  color: ${props => props.theme['grey600']};
`
const ErrorCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['red000']};
  color: ${props => props.theme['red600']};
`
const SuccessCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme['green000']};
  color: ${props => props.theme['green600']};
`

const AirdropEligibleButton = ({ kycState, identityVerificationActions }) => {
  switch (kycState) {
    case KYC_STATES.PENDING:
    case KYC_STATES.UNDER_REVIEW:
      return (
        <GreyCartridge>
          <FormattedMessage
            id='scenes.airdrop.pending'
            defaultMessage='Eligibility Pending'
          />
        </GreyCartridge>
      )
    case KYC_STATES.REJECTED:
    case KYC_STATES.EXPIRED:
      return (
        <ErrorCartridge>
          <FormattedMessage
            id='scenes.airdrop.ineligible'
            defaultMessage='Ineligible KYC State: {kycState}'
            values={{ kycState }}
          />
        </ErrorCartridge>
      )
    case KYC_STATES.VERIFIED:
      return (
        <>
          <SuccessCartridge>
            <FormattedMessage
              id='scenes.airdrop.eligible'
              defaultMessage='Eligible'
            />
          </SuccessCartridge>
          <Text size='12px' style={{ marginTop: '8px' }} color='grey600'>
            Lorem ipsum dolor sit amet
          </Text>
        </>
      )
    default:
      return (
        <Button
          nature='green'
          fullwidth
          onClick={() => identityVerificationActions.verifyIdentity(2)}
        >
          <FormattedMessage
            id='scenes.airdrops.success.completeprofile'
            defaultMessage='Complete My Profile'
          />
        </Button>
      )
  }
}

const Success = props => {
  return (
    <Container>
      <AirdropBox>
        <Icon name='parachute' color='green600' size='32px' />
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.airdrops.success.getfreecrypto'
            defaultMessage='Get Free Crypto'
          />
        </Text>
        <Copy size='14px' color='grey600' weight={500}>
          <FormattedMessage
            id='scenes.airdrops.success.upgrade'
            defaultMessage='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus efficitur quam est, id finibus turpis sodales eget.'
          />
        </Copy>
        <Footer>
          <AirdropEligibleButton {...props} />
        </Footer>
      </AirdropBox>
    </Container>
  )
}

export default Success
