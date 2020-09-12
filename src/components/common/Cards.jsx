import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap'
import Identicon from 'identicon.js'

const Cards = ({game, history}) => {

  const color = {
    'b': [0,0,0,255],
    'w': [255,255,255,255]
  }

  let p1Icon = new Identicon(game.player1.nickname+game.player1._id,{
    size: 36,
    background: color[game.player1.color]
  }).toString()
  p1Icon = "data:image/png;base64,"+p1Icon

  let p2Icon = new Identicon(game.player2.nickname+game.player2._id,{
    size: 36,
    background: color[game.player2.color]
  }).toString()
  p2Icon = "data:image/png;base64,"+p2Icon

  return (
    <Card>
      <Card.Header>{game.name}</Card.Header>
      <Card.Body className="text-center">
        <Card.Text as="div">
          <Alert variant="info">
          <h4 className="font-weight-bold">
            <img src={p1Icon} alt={game.player1.nickname} />
            &nbsp;{game.player1.nickname}
          </h4>
          <h5>vs.</h5>
          <h4 className="font-weight-bold">
            <img src={p2Icon} alt={game.player2.nickname} />
            &nbsp;{game.player2.nickname}
          </h4>
          </Alert>
        </Card.Text>
        <Button variant="primary" onClick={(e) => {
          history.push('/chess/'+game._id)
        }}>Join</Button>
      </Card.Body>
    </Card>
  )
}

export default Cards;