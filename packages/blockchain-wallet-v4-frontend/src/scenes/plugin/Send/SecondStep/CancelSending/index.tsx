import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconClose } from '@blockchain-com/icons'
import TransactionStatus from 'blockchain-wallet-v4-frontend/src/scenes/plugin/common/TransactionStatus'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  position: absolute;
  bottom: -17px;
  left: -24px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 92px;
  width: 312px;
  padding: 24px;
  border-radius: 16px;
  background: ${(props) => props.theme.white};
`

const Buttons = styled(Flex)`
  justify-content: space-between;
  width: 100%;

  #pluginCancelSendingYesButton {
    outline: none;
    border: none;
    background: ${(props) => props.theme.black};

    &:hover {
      background: ${(props) => props.theme.black};
    }
  }
`

type CancelSendingProps = {
  changeCancelSendingPopupVisibility: () => void
  history: { push: (path: string) => void }
}

const CancelSending: React.FC<CancelSendingProps> = ({
  changeCancelSendingPopupVisibility,
  history
}) => {
  const [isCancelConfirmed, setIsCancelConfirmed] = useState<boolean>(false)

  const changeCanceledTransactionPopupVisibility = () => {
    setIsCancelConfirmed(!isCancelConfirmed)
  }

  const cancel = () => {
    changeCancelSendingPopupVisibility()
    changeCanceledTransactionPopupVisibility()
  }

  return (
    <Wrapper>
      <Text color='black' size='16px' lineHeight='24px' weight={600}>
        <FormattedMessage
          id='scenes.plugin.send.second-step.cancel-sending.label'
          defaultMessage='Are you sure?'
        />
      </Text>
      <Buttons>
        <Button
          nature='white-transparent'
          height='48px'
          onClick={changeCancelSendingPopupVisibility}
          data-e2e='pluginCancelSendingNoButton'
        >
          <Text size='16px' lineHeight='24px' color='black' weight={600}>
            <FormattedMessage
              id='scenes.plugin.send.second-step.cancel-sending.button_no_label'
              defaultMessage='No'
            />
          </Text>
        </Button>
        <Button
          onClick={changeCanceledTransactionPopupVisibility}
          id='pluginCancelSendingYesButton'
          height='48px'
          data-e2e='pluginCancelSendingYesButton'
        >
          <Text size='16px' lineHeight='24px' color='white' weight={600}>
            <FormattedMessage
              id='scenes.plugin.send.second-step.cancel-sending.button_yes_label'
              defaultMessage='Yes'
            />
          </Text>
        </Button>
      </Buttons>
      {isCancelConfirmed && (
        <TransactionStatus
          closePopup={cancel}
          history={history}
          messageId='scenes.plugin.send.second-step.cancel-sending.title'
          title='Transaction cancelled'
        >
          <IconClose height='70%' width='70%' color='black' />
        </TransactionStatus>
      )}
    </Wrapper>
  )
}

export default CancelSending
