import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { ImportedAddrType } from '@core/types'
import {
  Button,
  HeartbeatLoader,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import Form from 'components/Form/Form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 20px 0 10px;
  background-color: ${(props) => props.theme.grey000};
  border: 1px solid ${(props) => props.theme.grey200};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`

const RecommendedImportedSweep = (props: InjectedFormProps<{}, Props> & Props) => {
  const { addressHasBalance, handleSubmit, importedAddresses, position, total } = props

  return (
    <Modal size='medium' position={position} total={total}>
      {(importedAddresses?.length === 0 || addressHasBalance?.length === 0) && (
        <ModalHeader closeButton={false}>
          <FormattedMessage id='modals.uptodata.title' defaultMessage='Up to date' />
        </ModalHeader>
      )}
      {importedAddresses &&
        importedAddresses.length > 0 &&
        addressHasBalance &&
        addressHasBalance.length > 0 && (
          <>
            <ModalHeader closeButton={false}>
              <FormattedMessage
                id='modals.recommendedsweep.title'
                defaultMessage='Recommended Sweep'
              />
            </ModalHeader>

            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <Text size='14px' weight={400}>
                  <FormattedMessage
                    id='modals.recommendedsweep.para1'
                    defaultMessage='Sweepy Sweep sweep'
                  />
                </Text>
                {/* Here I want to create a funciton that maps over each address
                and each balance and displays it */}
                <Container>
                  <Row>
                    <Text size='14px' weight={600}>
                      <FormattedMessage id='copy.from' defaultMessage='From' />:
                    </Text>
                    <Text size='14px' weight={400}>
                      Hey
                    </Text>
                  </Row>
                  <Row>
                    <Text size='14px' weight={600}>
                      <FormattedMessage id='modals.transfereth.to' defaultMessage='To:' />
                    </Text>
                    <Text size='14px' weight={400}>
                      Hey
                    </Text>
                  </Row>
                  <Row>
                    <Text size='14px' weight={600}>
                      <FormattedMessage id='modals.transfereth.amount' defaultMessage='Amount:' />
                    </Text>
                    <CoinDisplay size='14px' coin='ETH' weight={400}>
                      Hey
                    </CoinDisplay>
                  </Row>
                  <Row>
                    <Text size='14px' weight={600}>
                      <FormattedMessage
                        id='modals.transfereth.txfee'
                        defaultMessage='Transaction Fee:'
                      />
                    </Text>
                    <CoinDisplay size='14px' coin='ETH' weight={400}>
                      Hey
                    </CoinDisplay>
                  </Row>
                </Container>
                <Button
                  data-e2e='transferEth'
                  nature='primary'
                  fullwidth
                  type='submit'
                  disabled={props.submitting}
                >
                  {props.submitting ? (
                    <HeartbeatLoader height='20px' width='20px' color='white' />
                  ) : (
                    <FormattedMessage
                      id='modals.transfereth.confirm1'
                      defaultMessage='Transfer Funds'
                    />
                  )}
                </Button>
              </Form>
            </ModalBody>
          </>
        )}
    </Modal>
  )
}

type Props = {
  addressHasBalance?: ImportedAddrType[]
  importedAddresses?: ImportedAddrType[]
  position: number
  total: number
}

export default reduxForm<{}, Props>({ form: 'recommendedImportSweep' })(RecommendedImportedSweep)
