import React from 'react';
import {Alert, ButtonGroup, Button, Col, Row} from 'react-bootstrap'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import Chess from 'chess.js'

import { httpTry, getSize } from '../../utils/functions'
import { getChessRoom } from '../../services/chess'
import { getJwt } from '../../services/auth'
import Chessboard from '../common/Chessboard'
import BattleLog from './BattleLog'

import { pieces } from '../../utils/imageLoader.js' 

const host = process.env.REACT_APP_HOST
let socket = io(host)

export default class Game extends React.Component {
  
  state = {
    game: {},
    move: {},
    canvasWidth: 0,
    promotionButtons: false,
    loading: true
  }

  componentDidMount() {
    httpTry(async () => {
      const game = await getChessRoom(this.props.match.params.id)
      this.setState({ game })

      // TODO
      if(!game) this.props.history.replace('/chess')
      else {
        socket.emit('join-room-chess', this.state.game._id)

        socket.on('board', ({fen, move}) => {
          this.updateChess(fen, move)
        })
      }

      this.canvasResizer()
      this.setState({loading: false})
    })

    window.addEventListener('resize', this.canvasResizer)
  }

  componentWillUnmount() {
    socket.emit('leave-room-chess', this.state.game._id)
    socket.emit('disconnect')
    socket.off()

    window.removeEventListener('resize', this.canvasResizer)
  }

  canvasResizer = () => {
    const siteMarginTop = 76
    const colMarginX = 30

    const canvasWidth = Math.min(
      window.innerHeight-siteMarginTop,
      getSize(this.refs.chessboardWrapper).width-colMarginX
    )
    this.setState({ canvasWidth })
  }

  updateChess = (fen, verbMove) => {
    const game = this.state.game
    game.fen = fen
    game.moves.push(verbMove)
    this.setState({ game })
  }

  doMove = (move, queryForPromotion=false) => {
    this.setState({ move })
    if (queryForPromotion) {
      this.setState({ promotionButtons: true })
    } else {
      socket.emit('update-board', {
        authToken: getJwt(),
        id: this.state.game._id,
        move
      }, (data) => {
        if (data) toast.error(data)
        else {
          this.setState({ promotionButtons: false, move: {} })
        }
      })
    }    
  }

  userCanMove() {
    const chess = new Chess(this.state.game.fen)

    return this.props.user && ((this.props.user._id === this.state.game.player1._id &&
    chess.turn() === this.state.game.player1.color) ||
    (this.props.user._id === this.state.game.player2._id &&
    chess.turn() === this.state.game.player2.color))
  }

  render() {

    const playerClass = "p-2 shadow "
    const color = {
      w: "bg-light ",
      b: "bg-dark "
    }

    const turn = "text-warning font-weight-bold "
    const noTurn = "text-info font-weight-light "
    
    const game = this.state.game
    const chess = new Chess(this.state.game.fen)


    let player1Color, player2Color
    if (game.player1) {
      player1Color = game.player1.color
      player2Color = game.player2.color
    }

    const promotionObj = {
      "q": pieces[chess.turn()]['q'],
      "n": pieces[chess.turn()]['n'],
      "b": pieces[chess.turn()]['b'],
      "r": pieces[chess.turn()]['r']
    }

    return (
      <React.Fragment>
        <Row>
          <Col lg={7} ref="chessboardWrapper" className="text-center">
            { !this.state.loading
              ? <Chessboard
                canvasWidth={Math.round(Math.floor(this.state.canvasWidth/8)*8)}
                fen={this.state.game.fen}
                doMove={this.doMove}
                canMove={this.userCanMove()}/>
              : null
            }
          </Col>
          <Col lg={5}>
            <Alert
              variant="info"
              className="float-left text-center w-100"
            >
              <h1 className={playerClass+color[player1Color]}>
                { game.player1 && <span className={
                  chess.turn() === game.player1.color && !chess.game_over()
                  ? turn
                  : noTurn
                }>{ game.player1.nickname }</span>}
              </h1>
              <h1 className="text-secondary"> vs. </h1>
              <h1 className={playerClass+color[player2Color]}>
                { game.player1 && <span className={
                  chess.turn() === game.player2.color && !chess.game_over()
                  ? turn
                  : noTurn
                }>{ game.player2.nickname }</span>}
              </h1>
              <ButtonGroup aria-label="Promotion" className="my-4">
              { Object.keys(promotionObj).map((name) => {
                  if (!this.state.promotionButtons) return <Button
                    className="p-0"
                    variant="warning" 
                    key={name}
                    disabled>
                    <div style={{width: 38, height: 38}}></div>
                  </Button>
                  else return <Button 
                    className="p-0"
                    variant="warning"
                    key={name}
                    name={name}
                    onClick={(e) => {
                      let move = this.state.move
                      move.promotion = e.currentTarget.name
                      this.doMove(move)
                    }}>
                    <img src={promotionObj[name]} alt={name} width="38" height="38"/>
                  </Button>
                })
              }
              </ButtonGroup>
              { !this.state.loading && <BattleLog
                game={this.state.game}
              />}
            </Alert>
          </Col>
        </Row>
        
      </React.Fragment>
    );
  }
}
