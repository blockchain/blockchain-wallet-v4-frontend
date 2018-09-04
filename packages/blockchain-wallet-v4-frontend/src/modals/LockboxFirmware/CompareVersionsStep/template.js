import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { FlatLoader, Text, ModalBody } from 'blockchain-info-components'

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0 10px;
  & > :last-child {
    margin-top: 6px;
  }
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`
const StepInstructions = styled(Text)`
  max-width: 325px;
`

const CompareVersionsStep = props => {
  const { firmwareInfo, latestFirmware } = props

  return (
    <React.Fragment>
      <ModalBody>
        <Header>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.compareversionsstep.title'
              defaultMessage='Checking for Updates...'
            />
          </Text>
        </Header>
        <Content>
          <Row>
            {!firmwareInfo && (
              <React.Fragment>
                <StepInstructions size='14px' weight={300}>
                  <FormattedMessage
                    id='modals.lockboxfirmware.compareversionsstep.installedtitle'
                    defaultMessage='Fetching firmware information'
                  />
                </StepInstructions>
                <FlatLoader width='50px' height='10px' />
              </React.Fragment>
            )}
            {firmwareInfo && (
              <React.Fragment>
                <StepInstructions size='14px' weight={300}>
                  <FormattedMessage
                    id='modals.lockboxfirmware.compareversionsstep.installed'
                    defaultMessage='Installed Firmwares:'
                  />
                </StepInstructions>
                <div>
                  <Text size='14px' weight={300}>
                    MCU Version: {firmwareInfo.mcuVersion}
                  </Text>
                  <Text size='14px' weight={300}>
                    SE Version: {firmwareInfo.seVersion}
                  </Text>
                </div>
              </React.Fragment>
            )}
          </Row>
          <Row>
            {!latestFirmware && (
              <React.Fragment>
                <StepInstructions size='14px' weight={300}>
                  <FormattedMessage
                    id='modals.lockboxfirmware.compareversionsstep.latesttitle'
                    defaultMessage='Fetching latest firmware information'
                  />
                </StepInstructions>
                <FlatLoader width='50px' height='10px' />
              </React.Fragment>
            )}
            {latestFirmware && (
              <React.Fragment>
                <StepInstructions size='14px' weight={300}>
                  <FormattedMessage
                    id='modals.lockboxfirmware.compareversionsstep.latest'
                    defaultMessage='Latest Firmwares:'
                  />
                </StepInstructions>
                <div>
                  <Text size='14px' weight={300}>
                    MCU Version:
                  </Text>
                  <Text size='14px' weight={300}>
                    SE Version:
                  </Text>
                </div>
              </React.Fragment>
            )}
          </Row>
        </Content>
      </ModalBody>
    </React.Fragment>
  )
}

export default CompareVersionsStep
