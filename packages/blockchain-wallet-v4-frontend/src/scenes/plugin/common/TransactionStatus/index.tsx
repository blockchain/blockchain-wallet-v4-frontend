import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 178px 24px 17px 24px;
  width: 312px;
  height: 405px;
  background: ${(props) => props.theme.black};
`

const IconWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 120px;
  border-radius: 50%;
  background: ${(props) => props.theme.white};
`

const Content = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 192px;
`

const TextWrapper = styled(Text)`
  width: 220px;
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.white};
`

type TransactionStatusProps = {
  closePopup: () => void
  history: {
    push: (path: string) => void
  }
  messageId: string
  title: string
}

// Common wrapper for success/canceled transaction component
const TransactionStatus: React.FC<TransactionStatusProps> = (props) => {
  const { children, closePopup, history, messageId, title } = props
  const datae2e = title.split(' ').join('')

  const goToActitiviesTab = () => {
    closePopup()
    // TODO: finalize path
    history.push('/activities')
  }

  return (
    <Wrapper>
      <Content>
        <IconWrapper>{children}</IconWrapper>
        <TextWrapper>
          <FormattedMessage id={`${messageId}_title`} defaultMessage={title} />
        </TextWrapper>
      </Content>
      <Button
        height='48px'
        width='100%'
        data-e2e={`${datae2e}ButtonContinue`}
        onClick={goToActitiviesTab}
      >
        <Text color='black' weight={600} size='16px' lineHeight='24px'>
          <FormattedMessage id='plugin.send.button_continue' defaultMessage='Continue' />
        </Text>
      </Button>
    </Wrapper>
  )
}

export default TransactionStatus
