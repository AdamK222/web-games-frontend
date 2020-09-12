import React from 'react';
import Table from 'react-bootstrap/Table'

const TableList = ({ rows, pattern, striped, bordered, hover }) => {

  let mergedArray = []
  for (let item in pattern) {
    mergedArray.push({label: pattern[item], value: rows[item]})
  }
  
  // [{label: 'x', value: 'y'},{}]
  return (
    <Table striped={striped} bordered={bordered} hover={hover}>
      <tbody>
        { mergedArray.map((row, key) => 
          <tr key={key}>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default TableList;