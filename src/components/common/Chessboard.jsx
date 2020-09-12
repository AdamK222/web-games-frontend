import React from 'react';
import Chess from 'chess.js'

import { pieces } from '../../utils/imageLoader' 
import { getSize } from '../../utils/functions'

export default class Chessboard extends React.Component {

  constructor(props) {
    super(props)

    this.tileColor = {
      light: "#ccc",
      dark: "#999"
    }
    this.markColor = "rgba(0,100,0,0.2)"
    this.moves = []

    this.state = {
      loadingFiles: 12
    }
  }  

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d')

    this.loadFiles()

    this.canvasResizer()
    window.addEventListener('resize', this.canvasResizer)
  }

  componentDidUpdate() {
    if (this.props.fen && this.state.loadingFiles === 0) {
      this.renderBoard()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.canvasResizer)
  }

  loadFiles = () => {
    this.imageInstances = {"w":{}, "b":{}}
    for (const color in pieces) {
      for (const piece in pieces[color]) {
        const ins = new Image()
        ins.src = pieces[color][piece]
        ins.onload = () => {
          this.imageInstances[color][piece] = ins
          this.setState({ loadingFiles: this.state.loadingFiles-1 })
        }
      }
    }
  }

  canvasResizer = () => {
    this.refs.canvas.height = this.props.canvasWidth
    this.refs.canvas.width = this.props.canvasWidth

    this.boardSize = this.props.canvasWidth
    this.squareSize = this.props.canvasWidth/8

    this.componentDidUpdate()
  }

  renderBoard = () => {
    this.clear()
    this.drawChessboard()
    this.drawFen()
  }

  clear = () => {
    this.ctx.clearRect(0,0,this.boardSize,this.boardSize)
  }

  drawChessboard = () => {
    const chess = new Chess(this.props.fen)
    for(let i=0; i<8; i++) {
      for (let j=0; j<8; j++) {
        this.ctx.fillStyle = this.tileColor[chess.square_color(this.toChess([i,j]))]
        this.ctx.fillRect(
          this.squareSize*j,
          this.squareSize*i,
          this.squareSize,
          this.squareSize
        )
      }
    }
  }

  drawFen = () => {
    const chess = new Chess(this.props.fen)
    const board = chess.board()

    for(let i=0; i<8; i++) {
      for (let j=0; j<8; j++) {
        if (board[i][j]) {
          this.ctx.drawImage(
            this.imageInstances[board[i][j].color][board[i][j].type],
            this.squareSize*j,
            this.squareSize*i,
            this.squareSize,
            this.squareSize
          )
        }
      }
    }
  }

  handleClick = (e) => {
    const rect = getSize(e.currentTarget)
    const correction = { x: -2, y: -1}
    const x = e.pageX-rect.left-window.pageXOffset+correction.x
    const y = e.pageY-rect.top-window.pageYOffset+correction.y

    //console.log("x:",x," y:",y,"  ",this.toChess(this.toField(x,y)))

    this.renderBoard()
    this.markMoveableFrom(this.toChess(this.toField(x,y)))
  }

  toChess = ([vertical, horizontal]) => {
    let alpha = "abcdefgh"
    return alpha[horizontal]+(8-vertical)
  }
  fromChess = (pos) => { // eg. c5
    let alpha = "abcdefgh"
    const j = alpha.indexOf(pos[0])
    const i = 8-parseInt(pos[1])
    return [i, j]
  }
  toField = (x, y) => {
    const i = Math.max(0,Math.min(7,Math.floor(y/this.squareSize)))
    const j = Math.max(0,Math.min(7,Math.floor(x/this.squareSize)))
    return [i, j]
  }

  markMoveableFrom = (square) => {
    const chess = new Chess(this.props.fen)
    if (this.props.canMove) {
      const moves = chess.moves({square, verbose: true})

      const move = this.moves.filter(move => move.to === square)
      if (move.length === 1) { // There are no this.moves that their move.from === move.to
        const moveObj = {from: move[0].from, to: move[0].to}

        let queryForPromotion = false
        if (move[0].promotion) queryForPromotion = true

        this.props.doMove(moveObj,queryForPromotion)
      } else {
        this.lastMarkedSquare = ""
        moves.forEach(move => {
          this.markField(move.to)
        })
      }
      this.moves = moves
    }
  }

  lastMarkedSquare = ""
  
  markField = (square) => {
    if (square !== this.lastMarkedSquare) {
      this.lastMarkedSquare = square
      this.ctx.fillStyle = this.markColor
      const [i, j] = this.fromChess(square)
      this.ctx.fillRect(
        this.squareSize*j,
        this.squareSize*i,
        this.squareSize,
        this.squareSize
      )
    }
  }

  render() {
    return (
      <canvas className={"border border-primary "+this.props.className}
        width={`${this.boardSize}px`}
        height={`${this.boardSize}px`}
        onClick={this.handleClick}
        ref="canvas"
      />
    )
  }
}
//   +------------------------+
// 8 | r  n  b  q  k  b  n  r |
// 7 | p  p  p  p  p  p  p  p |
// 6 | .  .  .  .  .  .  .  . |
// 5 | .  .  .  .  .  .  .  . |
// 4 | .  .  .  .  .  .  .  . |
// 3 | .  .  .  .  .  .  .  . |
// 2 | P  P  P  P  P  P  P  P |
// 1 | R  N  B  Q  K  B  N  R |
//   +------------------------+
//     a  b  c  d  e  f  g  h