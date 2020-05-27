import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { IconButton, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: auto;

  ${media.atLeastTablet`
    margin-top: 0;
  `}

  ${media.mobile`
    flex-shrink: 0;
  `}
`
const Divider = styled.div`
  height: 18px;
  border-left: 1px solid ${props => props.theme.whiteFade400};
`
const ActionButton = styled(IconButton)`
  position: relative;
  border: none;
  background-color: transparent;
  margin: 0px 6px;

  &:last-child {
    margin-right: 0px;
    padding-right: 0px;
  }

  & > span {
    color: ${props => props.theme.whiteFade700};
    font-size: 20px;
  }
  & > div > span {
    color: ${props => props.theme.whiteFade700};
    font-size: 14px;
  }

  &:hover {
    background-color: transparent;
    color: ${props => props.theme.whiteFade900};

    & > span {
      color: ${props => props.theme.whiteFade900};
    }
    & > div > span {
      color: ${props => props.theme.whiteFade900};
    }
  }

  ${media.tabletL`
    & > span {
      color: ${props => props.theme.whiteFade900};
      font-size: 20px;
    }
    & > div > span {
      color: ${props => props.theme.whiteFade900};
      font-size: 14px;
    }

    &:hover {
      background-color: transparent;
      color: ${props => props.theme.whiteFade900};

      & > span {
        color: ${props => props.theme.whiteFade900};
      }
      & > div > span {
        color: ${props => props.theme.whiteFade900};
      }
    }
  `}

  ${media.mobile`
    padding: 10px 10px;
    div:last-of-type {
      font-size: 13px;
    }
    & > span {
      display: none;
    }

  `};
`

const ButtonText = styled(Text)`
  margin-left: 6px;
`

const SendRequest = ({ showModal, sendAvailable, requestAvailable }) => {
  return (
    <Wrapper>
      <Divider />
      <ActionButton
        data-e2e='sendButton'
        disabled={!sendAvailable}
        name='send'
        onClick={() => showModal('SEND')}
        width='70px'
      >
        <ButtonText size='16px' weight={600} color='blue900'>
          <FormattedMessage
            id='layouts.wallet.menutop.send'
            defaultMessage='Send'
          />
        </ButtonText>
      </ActionButton>
      <Divider />
      <ActionButton
        data-e2e='requestButton'
        disabled={!requestAvailable}
        name='request'
        onClick={() => showModal('REQUEST')}
        width='70px'
      >
        <ButtonText size='16px' weight={600} color='blue900'>
          <FormattedMessage
            id='layouts.wallet.menutop.request'
            defaultMessage='Request'
          />
        </ButtonText>
      </ActionButton>
    </Wrapper>
  )
}

SendRequest.propTypes = {
  sendAvailable: PropTypes.bool.isRequired,
  requestAvailable: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired
}

export default SendRequest
