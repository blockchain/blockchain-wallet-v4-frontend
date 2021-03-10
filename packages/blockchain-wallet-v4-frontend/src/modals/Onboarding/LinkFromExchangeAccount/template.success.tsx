import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'

import { Props } from '.'
import {
  ButtonWrapper,
  ItemIcon,
  ListWrapper,
  MainWrapper,
  TitleWrapper
} from './styles'

const shouldRenderInfo = (tier: number) => {
  switch (tier) {
    case 1:
      return false
    case 2:
      return true
    default:
      return false
  }
}

const getStatus = tier => {
  switch (tier) {
    case 1:
      return 'Silver Verified'
    case 2:
      return 'Gold Verified'
    default:
      return ''
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
  width: 40px;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
`

const ListText = styled(Text)`
  text-align: left;
  margin-left: 18px;
  margin-top: 8px;
  span {
    text-indent: -12px;
    display: inline-block;
    padding-left: 12px;
  }
`

const Success: React.FC<Props & { close: () => void; data: any }> = props => {
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

      {shouldRenderInfo(current) && (
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
              id='modals.onboarding.linkfromexchange.success_info2'
              defaultMessage='You are now {status} with Blockchain.com, allowing you to swap, buy & sell, earn interest and borrow BTC.'
              values={{
                status: getStatus(current)
              }}
            />
          </Text>
        </InfoWrapper>
      )}

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
        <ItemIcon>
          <Icon
            name='wallet-filled'
            size='32px'
            color='blue600'
            role='button'
            style={{ justifyContent: 'flex-start' }}
          />
        </ItemIcon>
        <ListWrapper>
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

          <ListText color='grey600' size='16px' weight={500}>
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo1_description1'
              defaultMessage='- Use Wallet ID {walletId}'
              values={{
                walletId: props.data.walletGuid
              }}
            />
          </ListText>

          <ListText
            color='grey600'
            size='16px'
            weight={500}
            style={{ textAlign: 'left', marginLeft: '18px' }}
          >
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo1_description2'
              defaultMessage='- Wallet’s Password'
            />
          </ListText>
        </ListWrapper>
      </InfoWrapper>

      <InfoWrapper>
        <ImageWrapper>
          <Image name='exchange' width='40px' />
        </ImageWrapper>
        <ListWrapper>
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
          <ListText color='grey600' size='16px' weight={500}>
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo2_description1'
              defaultMessage='- Use Email Address: {exchangeEmail}'
              values={{
                exchangeEmail: props.data.email
              }}
            />
          </ListText>
          <ListText color='grey600' size='16px' weight={500}>
            <FormattedMessage
              id='modals.onboarding.linkfromexchange.success_subinfo2_description2'
              defaultMessage='- Exchange’s Password'
            />
          </ListText>
        </ListWrapper>
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

      <ButtonWrapper>
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
        <Link
          style={{ width: '100%' }}
          target='_blank'
          rel='noopener noreferrer'
          href='https://exchange.blockchain.com/trade'
        >
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
        </Link>
      </ButtonWrapper>
    </MainWrapper>
  )
}

export default Success
