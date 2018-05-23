import React from 'react'
import { connect } from 'react-redux'

import SelectBox from '../SelectBox'

class SelectBoxUSState extends React.PureComponent {
  render () {
    const { states, ...rest } = this.props
    const elements = [{ group: '', items: states }]

    return <SelectBox label='Select state' elements={elements} {...rest} />
  }
}

const mapStateToProps = () => ({
  states: [
    {text: 'Alabama', value: { name: 'Alabama', code: 'AL' }},
    {text: 'Alaska', value: { name: 'Alaska', code: 'AK' }},
    {text: 'American Samoa', value: { name: 'American Samoa', code: 'AS' }},
    {text: 'Arizona', value: { name: 'Arizona', code: 'AZ' }},
    {text: 'Arkansas', value: { name: 'Arkansas', code: 'AR' }},
    {text: 'California', value: { name: 'California', code: 'CA' }},
    {text: 'Colorado', value: { name: 'Colorado', code: 'CO' }},
    {text: 'Connecticut', value: { name: 'Connecticut', code: 'CT' }},
    {text: 'District Of Columbia', value: { name: 'District Of Columbia', code: 'DC' }},
    {text: 'Delaware', value: { name: 'Delaware', code: 'DE' }},
    {text: 'Federated States Of Micronesia', value: { name: 'Federated States Of Micronesia', code: 'FM' }},
    {text: 'Florida', value: { name: 'Florida', code: 'FL' }},
    {text: 'Georgia', value: { name: 'Georgia', code: 'GA' }},
    {text: 'Guam', value: { name: 'Guam', code: 'GU' }},
    {text: 'Hawaii', value: { name: 'Hawaii', code: 'HI' }},
    {text: 'Idaho', value: { name: 'Idaho', code: 'ID' }},
    {text: 'Illinois', value: { name: 'Illinois', code: 'IL' }},
    {text: 'Indiana', value: { name: 'Indiana', code: 'IN' }},
    {text: 'Iowa', value: { name: 'Iowa', code: 'IA' }},
    {text: 'Kansas', value: { name: 'Kansas', code: 'KS' }},
    {text: 'Kentucky', value: { name: 'Kentucky', code: 'KY' }},
    {text: 'Louisiana', value: { name: 'Louisiana', code: 'LA' }},
    {text: 'Maine', value: { name: 'Maine', code: 'ME' }},
    {text: 'Marshall Islands', value: { name: 'Marshall Islands', code: 'MH' }},
    {text: 'Maryland', value: { name: 'Maryland', code: 'MD' }},
    {text: 'Massachusetts', value: { name: 'Massachusetts', code: 'MA' }},
    {text: 'Michigan', value: { name: 'Michigan', code: 'MI' }},
    {text: 'Minnesota', value: { name: 'Minnesota', code: 'MN' }},
    {text: 'Mississippi', value: { name: 'Mississippi', code: 'MS' }},
    {text: 'Missouri', value: { name: 'Missouri', code: 'MO' }},
    {text: 'Montana', value: { name: 'Montana', code: 'MT' }},
    {text: 'Nebraska', value: { name: 'Nebraska', code: 'NE' }},
    {text: 'Nevada', value: { name: 'Nevada', code: 'NV' }},
    {text: 'New Hampshire', value: { name: 'New Hampshire', code: 'NH' }},
    {text: 'New Jersey', value: { name: 'New Jersey', code: 'NJ' }},
    {text: 'New Mexico', value: { name: 'New Mexico', code: 'NM' }},
    {text: 'New York', value: { name: 'New York', code: 'NY' }},
    {text: 'North Carolina', value: { name: 'North Carolina', code: 'NC' }},
    {text: 'North Dakota', value: { name: 'North Dakota', code: 'ND' }},
    {text: 'Northern Mariana Islands', value: { name: 'Northern Mariana Islands', code: 'MP' }},
    {text: 'Ohio', value: { name: 'Ohio', code: 'OH' }},
    {text: 'Oklahoma', value: { name: 'Oklahoma', code: 'OK' }},
    {text: 'Oregon', value: { name: 'Oregon', code: 'OR' }},
    {text: 'Palau', value: { name: 'Palau', code: 'PR' }},
    {text: 'Pennsylvania', value: { name: 'Pennsylvania', code: 'PA' }},
    {text: 'Puerto Rico', value: { name: 'Puerto Rico', code: 'PR' }},
    {text: 'Rhode Island', value: { name: 'Rhode Island', code: 'RI' }},
    {text: 'South Carolina', value: { name: 'South Carolina', code: 'SC' }},
    {text: 'South Dakota', value: { name: 'South Dakota', code: 'SD' }},
    {text: 'Tennessee', value: { name: 'Tennessee', code: 'TN' }},
    {text: 'Texas', value: { name: 'Texas', code: 'TX' }},
    {text: 'Utah', value: { name: 'Utah', code: 'UT' }},
    {text: 'Vermont', value: { name: 'Vermont', code: 'VT' }},
    {text: 'Virgin Islands', value: { name: 'Virgin Islands', code: 'VI' }},
    {text: 'Virginia', value: { name: 'Virginia', code: 'VA' }},
    {text: 'Washington', value: { name: 'Washington', code: 'WA' }},
    {text: 'West Virginia', value: { name: 'West Virginia', code: 'WV' }},
    {text: 'Wisconsin', value: { name: 'Wisconsin', code: 'WI' }},
    {text: 'Wyoming', value: { name: 'Wyoming', code: 'WY' }}
  ]
})

export default connect(mapStateToProps)(SelectBoxUSState)
