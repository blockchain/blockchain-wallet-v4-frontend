import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import React from 'react'
import styled from 'styled-components'

import {
  DisplayTitle,
  NumberContainer,
  NumberDescription,
  NumberWrapper,
  RowNumber,
  Subcontent,
  SubTitle
} from '../template.rejected.styles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Title = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`

const ShortTitleContainer = styled.div`
  max-width: 154px;
  margin-top: 20px;
`

const SubcontentContainer = styled(FlyoutWrapper)`
  border-top: 1px solid ${props => props.theme.grey000};
`

const Template: React.FC<Props> = props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <Icon cursor name='cart' size='32px' color='blue600' />
        <Title color='grey800' size='24px' weight={600}>
          <ShortTitleContainer>
            <FormattedMessage
              id='modals.simplebuy.cryptoselect'
              defaultMessage='Buy Crypto. Sell for Cash.'
            />
          </ShortTitleContainer>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </Title>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.kycrequired'
            defaultMessage='We’ve made it just as easy to buy and sell Crypto straight from your Wallet. Every Buy & Sell happens in seconds or less.'
          />
        </Text>
      </FlyoutWrapper>

      <SubcontentContainer>
        <Subcontent color='grey600' weight={500}>
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
                <FormattedMessage
                  id='buttons.buy_crypto'
                  defaultMessage='Buy Crypto'
                />
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
        </Subcontent>

        <Button
          fullwidth
          size='16px'
          height='48px'
          nature='primary'
          data-e2e='handleVerified'
          onClick={() => {
            props.identityVerificationActions.verifyIdentity(
              2,
              false,
              'KycRequiredStep'
            )
            if (props.order) {
              props.simpleBuyActions.setStep({
                step: 'CHECKOUT_CONFIRM',
                order: props.order
              })
            }
          }}
          style={{ marginTop: '16px' }}
          type='button'
        >
          <FormattedMessage
            id='modals.confirm.confirm.verify_identity'
            defaultMessage='Verify My Identity'
          />
        </Button>
      </SubcontentContainer>
    </Wrapper>
  )
}

export default Template
