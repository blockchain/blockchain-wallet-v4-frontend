import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Flex,
  IconCheckCircle,
  IconCreditCard,
  IconLockClosed,
  IconShield,
  Input,
  Logo,
  Padding,
  PaletteColors,
  SemanticColors,
  SpinningLoader,
  Text
} from '@blockchain-com/constellation'

import { Card } from 'components/Card'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { StandardRow } from 'components/Rows'
import { actions, selectors } from 'data'
import { useRemote } from 'hooks'

import { UpdateSecurityCodeComponent } from './types'

const UpdateSecurityCode: UpdateSecurityCodeComponent = ({ backToEnterAmount }) => {
  const dispatch = useDispatch()
  const [cvv, setCvv] = useState<string | null>(null)
  const { data: order } = useRemote(selectors.components.buySell.getBSOrder)
  const {
    hasData: cvvHasData,
    hasError: cvvHasError,
    isLoading: cvvLoading
  } = useRemote(selectors.components.buySell.getCvvStatus)
  const method = useSelector(selectors.components.buySell.getBSPaymentMethod)

  const updateCvv = () => {
    const paymentId = order?.attributes?.paymentId
    if (cvv && paymentId) {
      dispatch(actions.components.buySell.updateCardCvv({ cvv, paymentId }))
    }
  }

  useEffect(() => {
    let timeout
    if (cvvHasData) {
      timeout = setTimeout(() => {
        dispatch(actions.components.buySell.setStep({ step: 'CHECKOUT_CONFIRM' }))
      }, 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [cvvHasData, dispatch])

  if (!method) {
    backToEnterAmount()
    return null
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='update-security-code-flyout' mode='back' onClick={backToEnterAmount}>
        <FormattedMessage id='buttons.security' defaultMessage='Security' />
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column'>
          <Padding horizontal={2.5}>
            <Flex justifyContent='center'>
              <div style={{ transform: 'scale(2.5) translateY(-1rem)' }}>
                <Logo
                  doubleVariant='badge'
                  primaryContent={{
                    altText: 'Credit Card Icon',
                    backgroundColor: PaletteColors['grey-100'],
                    icon: <IconCreditCard color={PaletteColors['grey-900']} size='medium' />
                  }}
                  secondaryContent={{
                    altText: 'Shield Icon',
                    backgroundColor: PaletteColors['white-000'],
                    icon: <IconShield color={SemanticColors.body} size='small' />
                  }}
                  size='large'
                />
              </div>
            </Flex>
            <Text as='p' variant='title2' textAlign='center'>
              <FormattedMessage id='copy.security_code' defaultMessage='Security Code' />
            </Text>
            <Padding horizontal={1.5} bottom={2.5}>
              <Text as='p' variant='body1' textAlign='center' color={SemanticColors.overlay}>
                <FormattedMessage
                  id='copy.re_enter_security_code'
                  defaultMessage='Please re-enter the 3 digit CVV code associated with the card below'
                />
              </Text>
            </Padding>
            <Padding bottom={1}>
              <div style={{ height: '97.5px' }}>
                <Input
                  id='primary'
                  label='CVV Code'
                  placeholder='000'
                  state={cvvHasError ? 'error' : 'default'}
                  type='number'
                  // @ts-ignore
                  autoComplete='cc-csc'
                  aria-label='Card Security Code'
                  aria-placeholder='CVC'
                  postfix={
                    cvvHasData ? (
                      <IconCheckCircle color={SemanticColors.success} size='medium' />
                    ) : (
                      <IconLockClosed color={SemanticColors.muted} size='medium' />
                    )
                  }
                  onChange={(e) => setCvv(e.currentTarget.value)}
                  helperText={
                    cvvHasError ? (
                      <FormattedMessage
                        id='copy.invalid_cvv_code'
                        defaultMessage='The code entered is either invalid or expired. Try Again.'
                      />
                    ) : (
                      <></>
                    )
                  }
                />
              </div>
            </Padding>
            <Card backgroundColor='grey-050' borderWidth={1} borderRadius='lg'>
              <StandardRow
                topLeftText={method.card?.label}
                bottomLeftText={
                  <FormattedMessage
                    id='modals.simplebuy.card_ending_in'
                    defaultMessage='Card Ending in {lastFour}'
                    values={{
                      lastFour: method.card?.number
                    }}
                  />
                }
              />
            </Card>
          </Padding>
        </Flex>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Button
          as='button'
          disabled={!cvv || cvv.length < 3}
          icon={
            cvvLoading && <SpinningLoader borderWidth='xsmall' size='small' variant='monotone' />
          }
          size='default'
          state='initial'
          text={
            !cvvLoading && <FormattedMessage id='copy.update_card' defaultMessage='Update Card' />
          }
          type='submit'
          variant='primary'
          width='full'
          onClick={updateCvv}
        />
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default UpdateSecurityCode
