import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { MainWrapper, TitleWrapper } from './styles'
import { Props } from '.'
import React from 'react'
import styled from 'styled-components'

const getIcon = tier => {
  switch (tier) {
    case 1:
      return 'silver-approved'
    case 2:
      return 'gold-approved'
    default:
      return 'checkmark-green'
  }
}

const getStatus = tier => {
  switch (tier) {
    case 1:
      return 'Silver Verified'
    default:
      return 'Golden Verified'
  }
}

const IconWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
`

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 32px;
`
const InfoText = styled(Text)`
  width: 100%;
  display: flex;
  text-align: left;
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`
const ImageWrapper = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
`

const Success: React.FC<Props & { close: () => void }> = props => {
  const { close, userTiers } = props

  // @ts-ignore
  const { current } = userTiers.getOrElse({}) || {}

  return (
    <MainWrapper>
      <IconWrapper>
        <DisplayPaymentIcon showBackground>
          <Icon name='sync-regular' color='blue600' size='24px' />
        </DisplayPaymentIcon>
      </IconWrapper>
      <TitleWrapper>
        <Text
          color='grey900'
          size='24px'
          weight={600}
          style={{ justifyContent: 'flex-start' }}
        >
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.successheader'
            defaultMessage='Your Accounts are Connected!'
          />
        </Text>
      </TitleWrapper>
      <InfoWrapper>
        <Icon
          name='checkmark-circle-filled'
          size='24px'
          color='green600'
          role='button'
          style={{ justifyContent: 'flex-start' }}
        />
        <Text
          color='grey600'
          size='16px'
          weight={500}
          style={{ textAlign: 'left', marginLeft: '18px' }}
        >
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.success_info1'
            defaultMessage="Your Blockchain.com Wallet and Exchange are now connected. Seamlessly send funds between platforms to your heart's content."
          />
        </Text>
      </InfoWrapper>
      <InfoWrapper>
        <ImageWrapper>
          <Image name={getIcon(current)} width='24px' />
        </ImageWrapper>
        <Text
          color='grey600'
          size='16px'
          weight={500}
          style={{ textAlign: 'left', marginLeft: '18px' }}
        >
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.success_info2'
            defaultMessage='You are now {status} with Blockchain.com, allowing you to swap, buy & sell, earn interest and borrow BTC.'
            values={{
              status: getStatus(current)
            }}
          />
        </Text>
      </InfoWrapper>

      <InfoText
        color='grey900'
        size='16px'
        weight={600}
        style={{ marginTop: '8px' }}
      >
        <FormattedMessage
          id='modals.onboarding.linkfromexchange.success_remember_title'
          defaultMessage='Remember!'
        />
      </InfoText>
      <InfoText color='grey600' size='16px' weight={500}>
        <FormattedMessage
          id='modals.onboarding.linkfromexchange.success_remember_password_info'
          defaultMessage="You'll still have a separate password for each product."
        />
      </InfoText>

      <InfoWrapper style={{ marginTop: '18px' }}>
        <DisplayPaymentIcon showBackground>
          <Icon
            name='wallet-filled'
            size='18px'
            color='green600'
            role='button'
            style={{ justifyContent: 'flex-start' }}
          />
        </DisplayPaymentIcon>
        <div>
          <Text
            color='grey900'
            size='16px'
            weight={600}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo1_title'
              defaultMessage='To Log In to Your Wallet'
            />
          </Text>
          <Text
            color='grey600'
            size='16px'
            weight={500}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo1_description1'
              defaultMessage='- Use Wallet ID {walletId}'
              values={{
                walletId: props.walletId
              }}
            />
          </Text>
          <Text
            color='grey600'
            size='16px'
            weight={500}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo1_description2'
              defaultMessage='- Wallet’s Password'
            />
          </Text>
        </div>
      </InfoWrapper>

      <InfoWrapper>
        <ImageWrapper>
          <Image name='exchange' width='24px' />
        </ImageWrapper>
        <div>
          <Text
            color='grey900'
            size='16px'
            weight={600}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo2_title'
              defaultMessage='To Log In to Your Exchange'
            />
          </Text>
          <Text
            color='grey600'
            size='16px'
            weight={500}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo2_description1'
              defaultMessage='- Use Email Address: {exchangeEmail}'
              values={{
                exchangeEmail: props.email
              }}
            />
          </Text>
          <Text
            color='grey600'
            size='16px'
            weight={500}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo2_description2'
              defaultMessage='- Exchange’s Password'
            />
          </Text>
        </div>
      </InfoWrapper>

      <InfoText
        color='grey600'
        size='16px'
        weight={500}
        style={{ marginBottom: '24px' }}
      >
        <FormattedHTMLMessage
          id='modals.onboarding.linkfromexchange.success_disclaimer'
          defaultMessage="Having different Exchange and Wallet passwords helps to keep your accounts safe! <a href='https://support.blockchain.com/hc/en-us/articles/360029029911-Your-Wallet-101' rel='noopener noreferrer' target='_blank'>Learn more.</a> about the Wallet."
        />
      </InfoText>

      <Button
        nature='empty-blue'
        height='56px'
        fullwidth
        onClick={close}
        data-e2e='linkDone'
        style={{ marginBottom: '18px' }}
      >
        <Text color='blue600' size='16px' weight={500}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.take_me_to_wallet'
            defaultMessage='Take Me to My Wallet'
          />
        </Text>
      </Button>
      <Button
        nature='primary'
        height='56px'
        fullwidth
        onClick={close}
        data-e2e='linkDone'
      >
        <Text color='white' size='16px' weight={500}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.back_to_exchange'
            defaultMessage='Back to the Exchange'
          />
        </Text>
      </Button>
    </MainWrapper>
  )
}

export default Success
