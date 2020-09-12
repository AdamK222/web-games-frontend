import React from 'react';
import Joi from 'joi-browser'
import { Button } from 'react-bootstrap'
import { listenForToasts } from '../../utils/functions'

import Inputs from './Inputs'
import Selects from './Selects'

export default class Forms extends React.Component {

  componentDidMount() {
    listenForToasts(this.props.location.state)
  }

  state = {
    data: {},
    errors: {}
  }

  validate = () => {
    const res = Joi.validate(this.state.data, this.validationSchema, { abortEarly: false })
    if (!res.error) return {}
      
    const errors = {}

    for (let item of res.error.details) {
      errors[item.path[0]] = item.message
    }

    return errors
  }

  validateProp = ({name, value}) => {
    if (name !== 'confirmPassword') { // Not very good solution :(
      const data = {[name]: value}
      const schema = {[name]: this.validationSchema[name]}
      const {error} = Joi.validate(data, schema)
      return error ? error.details[0].message : null
    } else return null
  }

  formSubmit = e => {
    e.preventDefault()

    const errors = this.validate()
    this.setState({ errors })
    if (Object.keys(errors).length !== 0) return

    this.doSubmit()
  }

  inputChange = ({currentTarget: target}) => {
    const errors = {...this.state.errors}
    const errorMsg = this.validateProp(target)
    if (errorMsg) errors[target.name] = errorMsg
    else delete errors[target.name]

    const data = {...this.state.data}
    data[target.name] = target.value

    this.setState({data, errors})
  }

  spawnInput = (name, label, type) => {
    return (
      <Inputs
        error={this.state.errors[name]}
        name={name}
        type={type}
        label={label}
        value={this.state.data[name] || ''}
        onChange={this.inputChange}
      />
    )
  }

  spawnSelect = (name, label, rows = []) => {
    return (
      <Selects
        error={this.state.errors[name]}
        name={name}
        label={label}
        value={this.state.data[name] || ''}
        onChange={this.inputChange}
        rows={rows}
      />
    )
  }

  spawnButton = (label) => {
    return (
      <Button variant="primary" type="submit">{label}</Button>
    )
  }
}
