import React from 'react';
import { Form, Alert } from 'react-bootstrap'

const Inputs = ({error, name, label, ...rest}) => {
  return (
    <React.Fragment>
      <Form.Group controlId={name} className={`${error ? "mb-0": ""}`}>
        <Form.Label>{label}</Form.Label>
        <Form.Control name={name} {...rest}/>
      </Form.Group>
      { error
        ? <Alert variant="danger">{error}</Alert>
        : null
      }
    </React.Fragment>
  )
}

export default Inputs;