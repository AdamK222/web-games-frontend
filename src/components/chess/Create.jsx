import React from 'react';
import { Form } from 'react-bootstrap'
import Joi from 'joi-browser'
import { toast } from 'react-toastify'

import Forms from '../common/Forms'
import { getUsers } from '../../services/user'
import { createChessRoom } from '../../services/chess'
import { httpTry } from '../../utils/functions'

export default class Create extends Forms {

  state = {
    ...this.state,
    users: []
  }

  async componentDidMount() {
    httpTry(async () => {
      let users = await getUsers()
      users.unshift({_id: "0", nickname: ""})
      
      users = users.map(user => {
        if (user.nickname === this.props.user.nickname) user.nickname ="👨 "+user.nickname
        return user
      })
      
      this.setState({ users })
    })
  }

  validationSchema = {
    name: Joi.string().min(3).max(20).required().label('Game name'),
    playerName: Joi.string().required().label('Rival nickname')
  }

  doSubmit = () => {
    httpTry(async () => {
      const { name, playerName } = this.state.data
      const { _id } = this.state.users.filter((user) => user.nickname === playerName)[0]
      
      await createChessRoom(name,_id)
      toast.success('Game created')
    }, '/chess')
  }

  render() {
    return (
      <Form onSubmit={this.formSubmit}>
        {this.spawnInput('name','Game name','text')}
        {this.spawnSelect('playerName','Choose your rival',
          this.state.users.map(user => user.nickname)
        )}
        {this.spawnButton('Create new game')}
      </Form>
    )
  }
}