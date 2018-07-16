import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { Button, Icon, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'
import { Form } from 'components/Form'
import WordInput from './WordInput'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const ThirdStep = (props) => {
  const { previousStep, position, total, close, submitting, invalid, ...rest } = props
  const { indexes, mnemonic, handleSubmit } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader icon='bell' onClose={close}>
          <FormattedMessage id='modals.recoveryphrase.title' defaultMessage='Backup recovery phrase' />
        </ModalHeader>
        <ModalBody>
          <TextGroup inline>
            <Icon name='checkmark' size='18px' weight={300} />
            <Text size='18px' weight={400}>
              <FormattedMessage id='modals.recoveryphrase.tip' defaultMessage='Verify' />
            </Text>
          </TextGroup>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.explain' defaultMessage='Using the completed Recovery Sheet as a reference, please enter the following words from your Recovery Phrase to complete the backup process.' />
          </Text>
          <Container>
            {indexes.indexOf(0) > -1 && <WordInput index={0} mnemonic={mnemonic} />}
            {indexes.indexOf(1) > -1 && <WordInput index={1} mnemonic={mnemonic} />}
            {indexes.indexOf(2) > -1 && <WordInput index={2} mnemonic={mnemonic} />}
            {indexes.indexOf(3) > -1 && <WordInput index={3} mnemonic={mnemonic} />}
            {indexes.indexOf(4) > -1 && <WordInput index={4} mnemonic={mnemonic} />}
            {indexes.indexOf(5) > -1 && <WordInput index={5} mnemonic={mnemonic} />}
            {indexes.indexOf(6) > -1 && <WordInput index={6} mnemonic={mnemonic} />}
            {indexes.indexOf(7) > -1 && <WordInput index={7} mnemonic={mnemonic} />}
            {indexes.indexOf(8) > -1 && <WordInput index={8} mnemonic={mnemonic} />}
            {indexes.indexOf(9) > -1 && <WordInput index={9} mnemonic={mnemonic} />}
            {indexes.indexOf(10) > -1 && <WordInput index={10} mnemonic={mnemonic} />}
            {indexes.indexOf(11) > -1 && <WordInput index={11} mnemonic={mnemonic} />}
          </Container>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} onClick={previousStep}>
            <FormattedMessage id='modals.recoveryphrase.thirdstep.back' defaultMessage='Back' />
          </Link>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='modals.recoveryphrase.thirdstep.finish' defaultMessage='Finish' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

ThirdStep.propTypes = {
  indexes: PropTypes.array.isRequired,
  mnemonic: PropTypes.array.isRequired,
  previousStep: PropTypes.func.isRequired
}

export default reduxForm({ form: 'recoveryPhrase' })(ThirdStep)
