import React from 'react';
import io from 'socket.io-client'
import {Badge, Form, ListGroup, Row, Col, Button} from 'react-bootstrap'
import { toast } from 'react-toastify'
import Identicon from 'identicon.js'
import { animateScroll } from 'react-scroll'

import { getMessages } from '../services/chat'
import { httpTry } from '../utils/functions'

// Putting following 2 lines ofcode in componentDidMount() caused
// reconnecting each time user revisit route '/chat'.
// This is one solution for this problem which I found by myself so it might not be perfect.
const host = process.env.REACT_APP_HOST
let socket = io(host)

export default class Chat extends React.Component {

  state = {
    msg: '',
    messages: []
  }

  componentDidMount() {
    httpTry(async () => {
      const messages = await getMessages()
      this.setState({ messages })

      if (messages) {
        socket.emit('join-chat')

        socket.on('msg', msg => {
          this.setState({messages: [...this.state.messages, msg]})
        })
      }
      this.scrollToBottom()
    })
  }

  componentWillUnmount() {
    socket.emit('leave-chat')

    socket.emit('disconnect')
    socket.off()
  }

  scrollToBottom() {
    animateScroll.scrollToBottom()
  }

  doSubmit = (e) => {
    e.preventDefault()

    if (this.state.msg) {
      socket.emit('send-msg', {
        user: this.props.user,
        message: this.state.msg
      }, (data) => {
        if (data) toast.error(data)
        else {
          this.setState({msg: ''})
          this.refs.msgInput.value = ''
          this.scrollToBottom()
        }
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Form onSubmit={this.doSubmit} className="fixed-bottom">
          <Row>
            <Col sm={11} className="pr-0">
              <Form.Control ref="msgInput" name="msg" type="text" placeholder="Type message…" onChange={(e) => this.setState({msg: e.currentTarget.value})}/>
            </Col>
            <Col sm={1} className="pl-0">
              <Button className="w-100" type="submit">Send</Button>
            </Col>
          </Row>
        </Form>
        <ListGroup>
        { this.state.messages.map((msg, key) => {
          let icon = new Identicon(msg.user.nickname+msg.user._id,{
            size: 32
          }).toString()

          return <React.Fragment key={key}>
            {msg.user._id === this.props.user._id
              ? <ListGroup.Item><Row>
                  <Col xs={10}>
                    <div className="text-right w-100">{msg.message}</div>
                  </Col>
                  <Col xs={2}>
                    <img className="float-left" src={`data:image/png;base64,${icon}`} alt={msg.user.nickname} />
                    <h5 className="float-left ml-1"><Badge variant={msg.user.isAdmin ? "danger" : "secondary"}>{msg.user.nickname}</Badge></h5>
                  </Col>
                </Row></ListGroup.Item>
              : <ListGroup.Item><Row>
                  <Col xs={2}>
                    <img className="float-right" src={`data:image/png;base64,${icon}`} alt={msg.user.nickname} />
                    <h5 className="float-right mr-1"><Badge variant={msg.user.isAdmin ? "danger" : "secondary"}>{msg.user.nickname}</Badge></h5>
                  </Col>
                  <Col xs={10}>
                    <div className="text-left w-100">{msg.message}</div>
                  </Col>
              </Row></ListGroup.Item>
            } </React.Fragment>
        })}
        </ListGroup>
        <div id="form-placeholder" style={{"height": 40}}></div>
      </React.Fragment>
    );
  }
}
