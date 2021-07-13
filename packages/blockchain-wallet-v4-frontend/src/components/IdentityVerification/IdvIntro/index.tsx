import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { actions } from 'data'

import { Border, FlexStartRow, IconBackground, TopText } from '../../../modals/Swap/components'

const BackLink = styled(Link)`
  text-align: center;
  margin-top: 16px;
  display: block;
`

const IdvIntro: React.FC<Props> = (props) => {
  return (
    <>
      <FlyoutWrapper>
        <TopText spaceBetween marginBottom>
          <Icon name='arrow-switch-thick' color='blue600' size='24px' />
          <Icon name='close' color='grey600' role='button' cursor onClick={props.handleClose} />
        </TopText>
        <Text size='24px' color='grey900' weight={600}>
          {props.title}
        </Text>
        <Text size='16px' color='grey600' weight={500} style={{ marginTop: '10px' }}>
          {props.subTitle}
        </Text>
      </FlyoutWrapper>
      <Border />
      <FlyoutWrapper>
        <Text size='20px' color='grey800' weight={600} style={{ marginBottom: '8px' }}>
          {props.subHeaderTitle}
        </Text>
        <Text size='14px' color='grey600' weight={500} style={{ marginBottom: '30px' }}>
          {props.subHeaderCopy}
        </Text>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              1
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage id='scenes.verifyemail.title' defaultMessage='Verify Your Email' />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.swap_confirm'
                defaultMessage='Confirm your email address to protect your Blockchain.com Wallet.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '28px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              2
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              <FormattedMessage
                id='copy.swap_add_name'
                defaultMessage='Add Your Name and Address'
              />
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              <FormattedMessage
                id='copy.swap_name_address'
                defaultMessage='We need to know your name and address to comply with local laws.'
              />
            </Text>
          </div>
        </FlexStartRow>
        <FlexStartRow style={{ marginBottom: '62px' }}>
          <IconBackground size='32px' style={{ marginRight: '16px' }}>
            <Text color='blue600' size='20px' weight={600}>
              3
            </Text>
          </IconBackground>
          <div>
            <Text color='grey900' size='14px' weight={600} lineHeight='150%'>
              {props.resultTitle}
            </Text>
            <Text size='12px' lineHeight='150%' weight={500}>
              {props.resultCopy}
            </Text>
          </div>
        </FlexStartRow>
        <Button
          nature='primary'
          data-e2e='swapVerify'
          height='48px'
          onClick={() =>
            props.idvActions.verifyIdentity({
              needMoreInfo: false,
              origin: 'Unknown',
              tier: props.selectedTier
            })
          }
          fullwidth
        >
          <FormattedMessage id='buttons.verify_now' defaultMessage='Verify Now' />
        </Button>
        {props.goBack && (
          <BackLink data-e2e='goBack' onClick={props.goBack} weight={500} size='14px'>
            <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
          </BackLink>
        )}
      </FlyoutWrapper>
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  idvActions: bindActionCreators(actions.components.identityVerification, dispatch)
})
const connector = connect(undefined, mapDispatchToProps)

const enhance = compose(connector)

type OwnProps = {
  goBack?: () => void
  handleClose: () => void
  resultCopy: React.ReactElement<any, any>
  resultTitle: React.ReactElement<any, any>
  selectedTier: number
  subHeaderCopy: React.ReactElement<any, any>
  subHeaderTitle: React.ReactElement<any, any>
  subTitle: React.ReactElement<any, any>
  title: React.ReactElement<any, any>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(IdvIntro)
