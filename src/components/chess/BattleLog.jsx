import React from 'react';
import { Alert, Row, Col} from 'react-bootstrap'
import { animateScroll } from 'react-scroll'
import Identicon from 'identicon.js'
import Chess from 'chess.js'

import {pieces, log} from '../../utils/imageLoader'

export default class BattleLog extends React.Component {

  constructor(props) {
    super(props)

    this.p1Icon = new Identicon(props.game.player1.nickname+props.game.player1._id,{
      size: 36
    }).toString()
    this.p1Icon = "data:image/png;base64,"+this.p1Icon
    this.p2Icon = new Identicon(props.game.player2.nickname+props.game.player2._id,{
      size: 36
    }).toString()
    this.p2Icon = "data:image/png;base64,"+this.p2Icon
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  componentDidUpdate() {
    animateScroll.scrollToBottom({ containerId: 'battleLog'})
  }

  mapMoves(moves) {
    if (moves && moves.length) {
      let movesCp = [...moves]
      
      movesCp = this.calculateCombo(movesCp)
      movesCp = this.injectWelcome(movesCp)
      movesCp = this.checkGameOver(movesCp)      

      const game = this.props.game
      return movesCp.map(move => {
        if (move.flags !== 'x') move.pic = [[],[],[]]
        if (move.flags === 'c' || move.flags === 'e') {
          if (game.player1.color === move.color) {
            if (move.combo === 1) move.pic[0] = [log.imgFire,this.p1Icon]
            else if (move.combo === 2) move.pic[0] = [log.imgFire,log.imgFire,this.p1Icon]
            else if (move.combo >= 3) move.pic[0] = [log.imgNuke,this.p1Icon]

            move.pic[1] = [pieces[game.player1.color][move.piece],log.imgGun.right]
            move.pic[2] = [pieces[game.player2.color][move.captured]]
          } else {
            move.pic[0] = [pieces[game.player1.color][move.captured]]
            move.pic[1] = [log.imgGun.left,pieces[game.player2.color][move.piece]]

            if (move.combo === 1) move.pic[2] = [this.p2Icon,log.imgFire]
            else if (move.combo === 2) move.pic[2] = [this.p2Icon,log.imgFire,log.imgFire]
            else if (move.combo >= 3) move.pic[2] = [this.p2Icon,log.imgNuke]
          }
        } else if (move.flags === 'n' || move.flags === 'b') {
          if (game.player1.color === move.color) {
            move.pic[0] = [this.p1Icon,pieces[game.player1.color][move.piece],move.from]
            move.pic[1] = [log.imgArrow.right]
            move.pic[2] = [move.to]
          } else {
            move.pic[0] = [move.to]
            move.pic[1] = [log.imgArrow.left]
            move.pic[2] = [move.from,pieces[game.player2.color][move.piece],this.p2Icon]
          }
        } else if (move.flags === 'np' || move.flags === 'cp') {
          if (game.player1.color === move.color) {
            move.pic[0] = move.flags === 'cp'
            ? [log.imgFire, this.p1Icon, pieces[game.player1.color][move.piece]]
            : [this.p1Icon, pieces[game.player1.color][move.piece]]
            move.pic[1] = [log.imgArrow.right]
            move.pic[2] = [log.imgLightning,pieces[game.player1.color][move.promotion],log.imgLightning]
          } else {
            move.pic[0] = [log.imgLightning,pieces[game.player2.color][move.promotion],log.imgLightning]
            move.pic[1] = [log.imgArrow.left]
            move.pic[2] = move.flags === 'cp'
            ? [pieces[game.player2.color][move.piece],this.p2Icon,log.imgFire]
            : [pieces[game.player2.color][move.piece],this.p2Icon]
          }
        } else if (move.flags === 'q' || move.flags === 'k') {
           if (game.player1.color === move.color) {
            move.pic[0] = [this.p1Icon, pieces[game.player1.color][move.piece]]
            move.pic[1] = [log.imgSwap]
            move.pic[2] = [pieces[game.player1.color]['r']]
          } else {
            move.pic[0] = [pieces[game.player2.color]['r']]
            move.pic[1] = [log.imgSwap]
            move.pic[2] = [pieces[game.player2.color][move.piece],this.p1Icon]
          }
        }
        return move
      })
    }
    else return []
  }

  injectWelcome (moves) {
    moves.unshift({
      flags: 'x',
      pic: [[],[log.imgWelcome1, log.imgWelcome2],[]]
    })
    return moves
  }

  calculateCombo (moves) {
    let combo = {b: 0, w: 0}

    moves = moves.map(move => {
      if (move.flags === 'c' || move.flags === 'cp') move.combo = ++combo[move.color]
      else {
        move.combo = 0
        combo[move.color] = 0
      }
      return move
    })
    return moves
  }

  checkGameOver (moves) {
    const chess = new Chess(this.props.game.fen)
    if (chess.in_checkmate()) {
      if (chess.turn() === this.props.game.player1.color) {
        moves.push({
          flags: 'x',
          pic: [[log.imgMedalSilver,this.p1Icon,log.emojiCry],['GG'],[log.emojiDevil,this.p2Icon,log.imgMedalGold]]
        })
      } else {
        moves.push({
          flags: 'x',
          pic: [[log.imgMedalGold,this.p1Icon,log.emojiDevil],['GG'],[log.emojiCry,this.p2Icon,log.imgMedalSilver]]
        })
      }
    } else if (chess.in_draw() || chess.in_stalemate()) {
      moves.push({
        flags: 'x',
        pic: [[log.imgMedalGold,this.p1Icon,log.emojiNeutral],['GG'],[log.emojiNeutral,this.p2Icon,log.imgMedalGold]]
      })
    }
    return moves
  }

  renderPics(array, row) {
    return array[row].map((pic, key) => {
      if (pic.length <= 10) return <span key={key} className="font-weight-bold text-info" style={{fontSize: 20}}>{pic.toUpperCase()}</span>
      else return <img key={key} src={pic} alt="Pic" width="36" height="36"/>
    })
  }
  //{ color: 'b', from: 'e5', to: 'f4', flags: 'c', piece: 'p', captured: 'p', san: 'exf4' }

  render() {
    const playerClass = "p-0 mb-0 font-weight-bold "
    const white = 'text-light '
    const black = 'text-dark '
    
    const moves = this.mapMoves(this.props.game.moves)
    console.log(moves)
    return (
      <React.Fragment>
        {this.props.game.player1 && 
          <Row style={{backgroundColor: '#999'}} className="mx-0">
            <Col as="h5" className={
              this.props.game.player1.color === 'w'
              ? playerClass+white
              : playerClass+black
            }>
              {this.props.game.player1.nickname}
            </Col>
            <Col as="h5" className={
              this.props.game.player2.color === 'w'
              ? playerClass+white
              : playerClass+black
            }>
              {this.props.game.player2.nickname}
            </Col>
          </Row>
        }
        <Alert id="battleLog" variant="dark" className="overflow-auto text-center py-0" style={{ maxHeight: 200 }}>
        { moves && moves.map((move, key) => {
            return <Row key={key} className="mb-1">
              <Col className="p-0">
                { move.pic && this.renderPics(move.pic,0) }
              </Col>
              <Col xs={3} className="p-0">
                { move.pic && this.renderPics(move.pic,1) }
              </Col>
              <Col className="p-0">
                { move.pic && this.renderPics(move.pic,2) }
              </Col>
            </Row>
        })}
      </Alert>
    </React.Fragment>
    );
  }
}