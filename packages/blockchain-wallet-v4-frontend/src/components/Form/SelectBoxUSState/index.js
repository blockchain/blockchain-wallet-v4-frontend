import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import SelectBox from '../SelectBox'

class SelectBoxUSState extends React.PureComponent {
  render() {
    const { states, ...rest } = this.props
    const elements = [{ group: '', items: states }]

    return (
      <SelectBox
        label={
          <FormattedMessage id='components.selectboxstate.label' defaultMessage='Select state' />
        }
        elements={elements}
        {...rest}
      />
    )
  }
}

const mapStateToProps = () => ({
  states: [
    { text: 'Alabama', value: { code: 'AL', name: 'Alabama' } },
    { text: 'Alaska', value: { code: 'AK', name: 'Alaska' } },
    { text: 'American Samoa', value: { code: 'AS', name: 'American Samoa' } },
    { text: 'Arizona', value: { code: 'AZ', name: 'Arizona' } },
    { text: 'California', value: { code: 'CA', name: 'California' } },
    { text: 'Colorado', value: { code: 'CO', name: 'Colorado' } },
    { text: 'Connecticut', value: { code: 'CT', name: 'Connecticut' } },
    { text: 'Delaware', value: { code: 'DE', name: 'Delaware' } },
    {
      text: 'District Of Columbia',
      value: { code: 'DC', name: 'District Of Columbia' }
    },
    {
      text: 'Federated States Of Micronesia',
      value: { code: 'FM', name: 'Federated States Of Micronesia' }
    },
    { text: 'Florida', value: { code: 'FL', name: 'Florida' } },
    { text: 'Georgia', value: { code: 'GA', name: 'Georgia' } },
    { text: 'Guam', value: { code: 'GU', name: 'Guam' } },
    { text: 'Hawaii', value: { code: 'HI', name: 'Hawaii' } },
    { text: 'Idaho', value: { code: 'ID', name: 'Idaho' } },
    { text: 'Illinois', value: { code: 'IL', name: 'Illinois' } },
    { text: 'Indiana', value: { code: 'IN', name: 'Indiana' } },
    { text: 'Iowa', value: { code: 'IA', name: 'Iowa' } },
    { text: 'Kansas', value: { code: 'KS', name: 'Kansas' } },
    { text: 'Kentucky', value: { code: 'KY', name: 'Kentucky' } },
    { text: 'Louisiana', value: { code: 'LA', name: 'Louisiana' } },
    { text: 'Maine', value: { code: 'ME', name: 'Maine' } },
    {
      text: 'Marshall Islands',
      value: { code: 'MH', name: 'Marshall Islands' }
    },
    { text: 'Maryland', value: { code: 'MD', name: 'Maryland' } },
    { text: 'Massachusetts', value: { code: 'MA', name: 'Massachusetts' } },
    { text: 'Michigan', value: { code: 'MI', name: 'Michigan' } },
    { text: 'Minnesota', value: { code: 'MN', name: 'Minnesota' } },
    { text: 'Mississippi', value: { code: 'MS', name: 'Mississippi' } },
    { text: 'Missouri', value: { code: 'MO', name: 'Missouri' } },
    { text: 'Montana', value: { code: 'MT', name: 'Montana' } },
    { text: 'Nebraska', value: { code: 'NE', name: 'Nebraska' } },
    { text: 'Nevada', value: { code: 'NV', name: 'Nevada' } },
    { text: 'New Hampshire', value: { code: 'NH', name: 'New Hampshire' } },
    { text: 'New Jersey', value: { code: 'NJ', name: 'New Jersey' } },
    { text: 'New Mexico', value: { code: 'NM', name: 'New Mexico' } },
    { text: 'New York', value: { code: 'NY', name: 'New York' } },
    { text: 'North Carolina', value: { code: 'NC', name: 'North Carolina' } },
    { text: 'North Dakota', value: { code: 'ND', name: 'North Dakota' } },
    {
      text: 'Northern Mariana Islands',
      value: { code: 'MP', name: 'Northern Mariana Islands' }
    },
    { text: 'Ohio', value: { code: 'OH', name: 'Ohio' } },
    { text: 'Oklahoma', value: { code: 'OK', name: 'Oklahoma' } },
    { text: 'Oregon', value: { code: 'OR', name: 'Oregon' } },
    { text: 'Palau', value: { code: 'PR', name: 'Palau' } },
    { text: 'Pennsylvania', value: { code: 'PA', name: 'Pennsylvania' } },
    { text: 'Puerto Rico', value: { code: 'PR', name: 'Puerto Rico' } },
    { text: 'Rhode Island', value: { code: 'RI', name: 'Rhode Island' } },
    { text: 'South Carolina', value: { code: 'SC', name: 'South Carolina' } },
    { text: 'South Dakota', value: { code: 'SD', name: 'South Dakota' } },
    { text: 'Tennessee', value: { code: 'TN', name: 'Tennessee' } },
    { text: 'Texas', value: { code: 'TX', name: 'Texas' } },
    { text: 'Utah', value: { code: 'UT', name: 'Utah' } },
    { text: 'Vermont', value: { code: 'VT', name: 'Vermont' } },
    { text: 'Virgin Islands', value: { code: 'VI', name: 'Virgin Islands' } },
    { text: 'Virginia', value: { code: 'VA', name: 'Virginia' } },
    { text: 'Washington', value: { code: 'WA', name: 'Washington' } },
    { text: 'West Virginia', value: { code: 'WV', name: 'West Virginia' } },
    { text: 'Wisconsin', value: { code: 'WI', name: 'Wisconsin' } },
    { text: 'Wyoming', value: { code: 'WY', name: 'Wyoming' } }
  ]
})

export default connect(mapStateToProps)(SelectBoxUSState)
