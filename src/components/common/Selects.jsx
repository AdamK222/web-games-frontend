import React from 'react';
import { Form, Alert } from 'react-bootstrap'

const Selects = ({error, name, label, rows, ...rest}) => {
  return (
    <React.Fragment>
      <Form.Group controlId={name} className={`${error ? "mb-0": ""}`}>
        <Form.Label>{label}</Form.Label>
        <Form.Control as="select" name={name} {...rest}>
          {rows.map((row, key) =>
            <option key={key}>{row}</option>
          )}
        </Form.Control>
      </Form.Group>
      { error
        ? <Alert variant="danger">{error}</Alert>
        : null
      }
    </React.Fragment>
  )
}

export default Selects;