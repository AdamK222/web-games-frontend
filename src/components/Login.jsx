import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form } from 'react-bootstrap'
import Joi from 'joi-browser'
import { toast } from 'react-toastify'

import Forms from './common/Forms'
import { login, getLoggedUser } from '../services/auth'
import { httpTry } from '../utils/functions'

export default class Login extends Forms {

  validationSchema = {
    email: Joi.string().required().label('E-mail'),
    password: Joi.string().required().label('Password')
  }

  doSubmit = () => {
    httpTry(async () => {
      const { email, password } = this.state.data
      await login(email, password)

      toast.success('Logged In')
    }, this.props.location.state ? this.props.location.state.from.pathname : '/')
  }

  render() {
    if(getLoggedUser()) return <Redirect to="/me" />;

    return (
      <Form onSubmit={this.formSubmit}>
        {this.spawnInput('email','E-mail','text')}
        {this.spawnInput('password','Password','password')}
        {this.spawnButton('Log in')}
      </Form>
    )
  }
}