import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const ConfirmWordsForm = ({ handleBackArrow }) => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <Header>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
            onClick={handleBackArrow}
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.recoveryphrase.confirmwords.header'
              defaultMessage='Confirm Your Phrase'
            />
          </Text>
        </Header>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.recoveryphrase.confirmwords.body'
            defaultMessage='Please enter the words that match the numbers you see below.'
          />
        </Text>
      </FlyoutWrapper>
    </Wrapper>
  )
}

export default ConfirmWordsForm
