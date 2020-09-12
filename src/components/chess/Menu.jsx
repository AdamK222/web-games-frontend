import React from 'react';
import {Jumbotron, Row, Col, Button, Form, FormControl} from 'react-bootstrap'

import * as chess from '../../services/chess'
import chessboard from '../../images/chessboard.jpg'

import { httpTry } from '../../utils/functions'

import Cards from '../common/Cards'

export default class Menu extends React.Component {

  state = {
    games: [],
    search: ""
  }

  componentDidMount() {
    httpTry( async () => {
      const games = await chess.getChessRooms()
      this.setState({ games })
    })
  }

  render() {

    const games = this.state.games.filter(game => 
      game.name.toLowerCase().includes(this.state.search.toLowerCase())
    )

    return (
      <React.Fragment>
        <Jumbotron className="py-3">
          <Row>
            <Col lg={9} md={8} className="my-2">
              <h1>Chess</h1>
              <p>Select one of the games below or create new one.</p>
              <Button variant="outline-info" onClick={(e) => {this.props.history.push('/chess/create')}}>Create new game</Button>
              <Form inline className="mt-3">
                <FormControl type="text" placeholder="Search…" onChange={(e) => {
                  this.setState({search: e.currentTarget.value.trim()})
                }}/>
              </Form>
            </Col>
            <Col lg={3} md={4} className="text-center my-2">
              <img src={chessboard} width="180" height="180" alt="Chessboard"/>
            </Col>
          </Row>
        </Jumbotron>
        <section className="mx-auto px-3">
          <Row>{
            games.map((g, index) => (
              <Col xl={3} lg={4} md={6} key={index}>
                <Cards history={this.props.history} game={g}/>
              </Col>
            ))
          }</Row>
        </section>
      </React.Fragment>
    )
  }
}