import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Text } from 'blockchain-info-components'

import { StepHeader } from '../model'

const Wrapper = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
`

class RequestShowAddress extends React.PureComponent<Props> {
  render () {
    return (
      <Wrapper>
        <StepHeader>
          <Icon
            cursor
            onClick={this.props.handleBack}
            name='arrow-back'
            color='grey600'
            size='24px'
            style={{ marginRight: '20px' }}
          />
          <Text size='24px' color='grey800' weight={600}>
            <FormattedMessage
              id='modals.requestcrypto.showaddress.title'
              defaultMessage='Scan or Share'
            />
          </Text>
        </StepHeader>
        {/* <button */}
        {/*  onClick={() => */}
        {/*    formActions.change( */}
        {/*      REQUEST_FORM, */}
        {/*      'step', */}
        {/*      RequestSteps.COIN_SELECT */}
        {/*    ) */}
        {/*  } */}
        {/* > */}
        {/*  Back */}
        {/* </button> */}
      </Wrapper>
    )
  }
}

type Props = {
  handleBack: () => void
}

export default RequestShowAddress
