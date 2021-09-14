import React, { memo, useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'

import { RecurringBuyRegisteredList } from '../../../data/types'
import Container from '../Container'
import Content from '../Content'
import Header from '../Header'

const RecurringBuyRemoveConfirm = memo(
  ({ activeDetails, close, goBack, removeClick }: Props) => {
    const [submitting, setSubmitting] = useState(false)
    const { id } = activeDetails
    const removeClickCallback = useCallback(() => {
      setSubmitting(true)
      removeClick(id)
    }, [setSubmitting, removeClick, id])
    const closeCallback = useCallback(() => {
      close()
    }, [close])

    return (
      <Container>
        <Header data-e2e='removeRecurringBuyConfirmHeader' mode='back' onClick={goBack}>
          <FormattedMessage id='copy.back' defaultMessage='Back' />
        </Header>
        <Content mode='middle'>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              padding: '0 40px',
              textAlign: 'center'
            }}
          >
            <Icon
              name='alert-filled'
              size='52px'
              color='orange500'
              style={{ marginBottom: '22px' }}
            />
            <Text size='20px' weight={600} color='grey800' style={{ marginBottom: '40px' }}>
              <FormattedMessage
                id='modals.recurringbuys.delete_confirmation_title'
                defaultMessage='Are you sure you want to remove this Recurring Buy?'
              />
            </Text>
            <div style={{ width: '100%' }}>
              <Button
                data-e2e='removeRecurringBuyConfirmButton'
                nature='light-red'
                fullwidth
                onClick={removeClickCallback}
                style={{ marginBottom: '16px' }}
              >
                {submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='red400' />
                ) : (
                  <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
                )}
              </Button>
              <Button
                data-e2e='removeRecurringBuyKeepButton'
                nature='light'
                fullwidth
                onClick={closeCallback}
                disabled={submitting}
              >
                <FormattedMessage id='buttons.keep' defaultMessage='Keep' />
              </Button>
            </div>
          </div>
        </Content>
      </Container>
    )
  },
  (prevProps, nextProps) => prevProps.activeDetails.id === nextProps.activeDetails.id
)

export type Props = {
  activeDetails: RecurringBuyRegisteredList
  close: () => void
  goBack: () => void
  removeClick: (id: RecurringBuyRegisteredList['id']) => void
}

export default RecurringBuyRemoveConfirm
