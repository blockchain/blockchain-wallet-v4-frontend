import React from 'react'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'

import {
  BankWaitIndicator,
  BankWrapper,
  Hr,
  LinkOptionsWrapper,
  LinkViaDesktop,
  ModalNavWithCloseIcon,
  ScanWithPhone,
  Section
} from '../../../../components'
import { OwnProps, Props as _P, SuccessStateType } from '.'

const { YAPILY_CONT_IN_BROWSER } = model.analytics.FIAT_DEPOSIT_EVENTS

type Props = OwnProps & SuccessStateType & _P

const Success = (props: Props) => {
  const media = props.account?.attributes?.media
  const logo = (media && media.length && media[0].source) || ''
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon {...props}>
        <FormattedMessage id='copy.connect_to_your_bank' defaultMessage='Connect to your bank' />
      </ModalNavWithCloseIcon>
      <LinkOptionsWrapper>
        <ScanWithPhone
          logo={logo as string}
          qrCode={props.account?.attributes?.qrcodeUrl as string}
        >
          <FormattedMessage
            id='modals.brokerage.link_via_mobile'
            defaultMessage='Link via mobile'
          />
        </ScanWithPhone>
        <Hr />
        <Section>
          <LinkViaDesktop
            authUrl={props.account?.attributes?.authorisationUrl as string}
            onClick={() => {
              props.analyticsActions.logEvent(YAPILY_CONT_IN_BROWSER)
            }}
          >
            <FormattedMessage
              id='modals.brokerage.link_via_desktop'
              defaultMessage='Link via desktop'
            />
          </LinkViaDesktop>
          <BankWaitIndicator qrCode={props.account?.attributes?.qrcodeUrl as string} />
        </Section>
      </LinkOptionsWrapper>
    </BankWrapper>
  )
}

export default Success
