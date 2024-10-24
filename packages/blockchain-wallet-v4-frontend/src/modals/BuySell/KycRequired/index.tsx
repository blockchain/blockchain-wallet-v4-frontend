import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { buySell, identityVerification } from 'data/components/actions'

import { IconsContainer, Title } from '../../components'
import {
  NumberContainer,
  NumberDescription,
  NumberWrapper,
  RowNumber,
  SubTitle
} from '../../components/Rejected'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ShortTitleContainer = styled.div`
  max-width: 154px;
  margin-top: 20px;
`
const ContentContainer = styled(FlyoutWrapper)`
  border-top: 1px solid ${(props) => props.theme.grey000};
`
const DisplayTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  display: flex;
  color: ${(props) => props.theme.textBlack};
  width: 100%;
`

const KycRequired = ({ handleClose }: { handleClose: () => void }) => {
  const dispatch = useDispatch()

  const onConfirm = () => {
    dispatch(
      identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'BuySell',
        tier: 2
      })
    )
    dispatch(buySell.destroyCheckout())
  }

  return (
    <Wrapper>
      <FlyoutWrapper>
        <IconsContainer>
          <Icon cursor name='cart' size='32px' color='blue600' />
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={handleClose}
          />
        </IconsContainer>
        <Title color='grey800'>
          <ShortTitleContainer>
            <FormattedMessage id='modals.simplebuy.kycrequired.title' defaultMessage='Buy Crypto' />
          </ShortTitleContainer>
        </Title>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.kycrequired.subtitle'
            defaultMessage='Verify your identity to complete your order.'
          />
        </Text>
      </FlyoutWrapper>

      <ContentContainer>
        <Text color='grey600' weight={500}>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>1</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.confirm.title.verify_identity'
                  defaultMessage='Verify Your Identity'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.kycrequired.verify_identity_description'
                  defaultMessage='To prevent identity theft or fraud, we’ll need a make sure it’s really you by uploading an ID.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>2</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.kycrequired.buy_crypto_description'
                  defaultMessage='Use your Bank, Debit or Credit card to fund any crypto purchase.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
          <RowNumber>
            <NumberWrapper>
              <NumberContainer>3</NumberContainer>
            </NumberWrapper>
            <NumberDescription>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.kycrequired.swap_at_anytime'
                  defaultMessage='Swap at Anytime'
                />
              </DisplayTitle>
              <SubTitle>
                <FormattedMessage
                  id='modals.simplebuy.kycrequired.swap_at_anytime_description'
                  defaultMessage='Instantly exchange your crypto for another without leaving your wallet.'
                />
              </SubTitle>
            </NumberDescription>
          </RowNumber>
        </Text>

        <Button
          fullwidth
          size='16px'
          height='48px'
          nature='primary'
          data-e2e='handleVerified'
          onClick={onConfirm}
          style={{ marginTop: '16px' }}
          type='button'
        >
          <FormattedMessage
            id='modals.confirm.confirm.verify_identity'
            defaultMessage='Verify My Identity'
          />
        </Button>
      </ContentContainer>
    </Wrapper>
  )
}

export default KycRequired
