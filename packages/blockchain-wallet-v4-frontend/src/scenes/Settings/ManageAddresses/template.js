import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import settings from 'config'
import { Icon, TabMenu, TabMenuItem, Text, Table, TableHeader, TableCell, TableRow, Button, Link } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'

const Wrapper = styled.div`
  width: 100%;
`
const InnerWrapper = styled.div`
  padding: 40px 30px;
`

const ManageAddressesTemplate = ({ account, labels, receiveIndex, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel }) => (
  <Wrapper>
    <HorizontalMenu>
      <TabMenu>
        <LinkContainer to='/settings/addresses'>
          <TabMenuItem>
            <Icon name='left-arrow' />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </HorizontalMenu>
    <InnerWrapper>
      <Text weight={400}>
        {account.label}
      </Text>
      <Text weight={400} size='small' style={{ marginTop: 25 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses' defaultMessage='Unused Addresses' />
      </Text>
      <Text weight={200} size='small' style={{ marginTop: 10 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
      </Text>
      {receiveIndex.cata({
        Success: (index) => (
          <Button onClick={() => onSetLabel(index, 'New Address')}>
            <FormattedMessage id='scenes.settings.manage_addresses.add_label' defaultMessage='Add Next Address' />
          </Button>
        ),
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null
      })}
      <Table>
        <TableHeader>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.address' defaultMessage='Address' />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.address_label' defaultMessage='Label' />
            </Text>
          </TableCell>
        </TableHeader>
        {labels.map(entry => (
          <TableRow key={entry.index}>
            <TableCell width='30%'>
              <Link href={`${settings.ROOT_URL}address/${deriveAddress(entry.index)}`} size='small' weight={300} target='_blank'>
                {deriveAddress(entry.index)}
              </Link>
            </TableCell>
            <TableCell width='30%'>
              <Text size='13px'>{entry.label}</Text>
            </TableCell>
            <TableCell width='30%'>
              <Icon name='pencil' onClick={() => onEditLabel(entry.index)} />
            </TableCell>
            <TableCell width='30%'>
              <Icon name='trash' onClick={() => onDeleteLabel(entry.index)} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </InnerWrapper>
  </Wrapper>
)

export default ManageAddressesTemplate
