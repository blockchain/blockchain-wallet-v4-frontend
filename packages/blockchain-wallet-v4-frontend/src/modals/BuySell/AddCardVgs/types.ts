import { BSShowModalOriginType } from 'data/types'

import { IFRAME_ACTION } from '../AddCardCheckoutDotCom/model'

export type AddCardVgsProps = {
  handleClose: () => void
  origin?: BSShowModalOriginType
}

export type ReceiveMessageProps = {
  data:
    | {
        action: IFRAME_ACTION.ADD_CARD
        provider: 'VGS'
        status: 'ERROR' | 'SUCCESS'
        token?: string
      }
    | {
        action: IFRAME_ACTION.REQUEST_BILLING_ADDRESS
        provider: 'VGS'
      }
    | {
        action: IFRAME_ACTION.CHANGE_BILLING_ADDRESS
        provider: 'VGS'
      }
    | {
        action: IFRAME_ACTION.ADD_CVV
        cvv: string
        provider: 'VGS'
      }
    | {
        action: IFRAME_ACTION.BIN_CHANGED
        bin: string
        provider: 'VGS'
        scheme: string
      }
    | {
        action: IFRAME_ACTION.DEEP_LINK
        provider: 'VGS'
        url: string
      }
}

export type VgsComponent = React.FC<AddCardVgsProps>
