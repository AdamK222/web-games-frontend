import React from 'react';
import Joi from 'joi-browser'
import { Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Forms from './common/Forms'
import { register } from '../services/user'
import { loginByJWT } from '../services/auth'
import { httpTry } from '../utils/functions'

export default class Register extends Forms {

  validationSchema = {
    nickname: Joi.string().required().min(3).max(20).label('Nickname'),
    email: Joi.string().email().required().min(4).max(128).label('E-mail'),
    password: Joi.string().required().min(8).max(128).label('Password'),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
  }

  doSubmit = () => {
    httpTry(async () => {
      const {nickname, email, password} = this.state.data
      const res = await register({nickname, email, password})
      loginByJWT(res.headers['x-auth-token'])

      toast.success('Welcome '+res.data.nickname)
    },'/')
  }

  render() {
    return (
      <Form onSubmit={this.formSubmit}>
        {this.spawnInput('nickname','Nickname','text')}
        {this.spawnInput('email','E-mail','text')}
        {this.spawnInput('password','Password','password')}
        {this.spawnInput('confirmPassword','Confirm Password','password')}
        {this.spawnButton('Create account')}
      </Form>
    )
  }
}
