# Dream Wallet Front-end - Components (Generic)

## Dropdown

* Usage
    * Displays a dropdown list to allow user to select a single value

* Options
    * `items` **(array, mandatory)**:
        * List of objects representing *ListItems* and *GroupHeaders*
        * Each object has the following properties 
            * `text` **(string, mandatory)**:
                * Text displayed for both *ListItem* or *GroupHeader*
            * `value` **(string, mandatory)**:
                * **Optional** for *GroupHeaders*
                * Value returned when the list item has been clicked
            * `group` **(string, optional)**:
                * Group of this ListItem
    * `callback` **(function, mandatory)**:
        * Function executed when a *ListItem* has been clicked
        * Takes a input parameter `value`
    * `selected` **(string, optional, default: '')**:
        * Value of a preselected *ListItem*
    * `searchEnabled` **(bool, optional, default: true)**:
        * Displays the search field when the dropdown list is opened

### Examples

```javascript
let elements = [
  { text: 'Text1', value: 'value1'}
  { text: 'Text2', value: 'value2', group: 'Group 1' },
  { text: 'Text3', value: 'value3', group: 'Group 1' },
  { text: 'Text4', value: 'value4', group: 'Group 2' },
  { text: 'Text5', value: 'value5', group: 'Group 2' }
]
let do = value => { console.log(value) }

<Dropdown 
  items={elements}
  callback={do}
  selected='value3'
/>
```
