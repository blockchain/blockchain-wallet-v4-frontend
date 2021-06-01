import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  BankWaitIndicator,
  BankWrapper,
  Hr,
  LinkOptionsWrapper,
  LinkViaDesktop,
  ModalNavWithCloseIcon,
  ScanWithPhone,
  Section
} from '../../components'
import { Props as _P, SuccessStateType as _SS } from '.'

type Props = _SS & _P

const Success = (props: Props) => {
  const media = props.account?.attributes?.media
  const logo = (media && media.length && media[0].source) || ''
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon handleClose={props.handleClose}>
        <FormattedMessage
          id='copy.confirm_with_your_bank'
          defaultMessage='Confirm with your bank'
        />
      </ModalNavWithCloseIcon>
      <LinkOptionsWrapper>
        <ScanWithPhone logo={logo as string} qrCode={props.order?.attributes?.qrcodeUrl as string}>
          <FormattedMessage
            id='modals.brokerage.confirm_via_mobile'
            defaultMessage='Confirm via mobile'
          />
        </ScanWithPhone>
        <Hr />
        <Section>
          <LinkViaDesktop authUrl={props.order?.attributes?.authorisationUrl as string}>
            <FormattedMessage
              id='modals.brokerage.confirm_via_desktop'
              defaultMessage='Confirm via desktop'
            />
          </LinkViaDesktop>
          <BankWaitIndicator qrCode={props.order?.attributes?.qrcodeUrl as string} />
        </Section>
      </LinkOptionsWrapper>
    </BankWrapper>
  )
}

export default Success
