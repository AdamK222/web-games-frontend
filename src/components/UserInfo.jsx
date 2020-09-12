import React from 'react';
import Button from 'react-bootstrap/Button'

import { getUser } from '../services/user'
import TableList from './common/TableList'

import { httpTry } from '../utils/functions'

export default class UserInfo extends React.Component {

  state = {
    userFull: {
      _id: '',
      nickname: '',
      email: ''
    }
  }

  async componentDidMount() {
    httpTry(async () => {
      const userFull = await getUser(this.props.user.nickname)
      this.setState({ userFull })
    })
  }

  render() {
    return (
      <React.Fragment>
        <TableList 
          rows={this.state.userFull}
          pattern={{
            _id: 'ID',
            nickname: 'Nickname',
            email: 'E-mail'
          }}
          striped={true}
          bordered={true}
          hover={false}
        />
        <Button variant="danger" onClick={(e) => {this.props.history.push('/logout')}}>Logout</Button>
      </React.Fragment>
    )
  }
}