import bk from '../images/pieces/b-k.png'
import bq from '../images/pieces/b-q.png'
import bb from '../images/pieces/b-b.png'
import bn from '../images/pieces/b-n.png'
import br from '../images/pieces/b-r.png'
import bp from '../images/pieces/b-p.png'
import wk from '../images/pieces/w-k.png'
import wq from '../images/pieces/w-q.png'
import wb from '../images/pieces/w-b.png'
import wn from '../images/pieces/w-n.png'
import wr from '../images/pieces/w-r.png'
import wp from '../images/pieces/w-p.png'

import imgWelcome1 from '../images/log/welcome1.png'
import imgWelcome2 from '../images/log/welcome2.png'
import imgFire from '../images/log/fire.png'
import imgNuke from '../images/log/nuke.png'
import imgLightning from '../images/log/lightning.png'
import imgGunLeft from '../images/log/gunLeft.png'
import imgGunRight from '../images/log/gunRight.png'
import imgArrowLeft from '../images/log/arrowLeft.png'
import imgArrowRight from '../images/log/arrowRight.png'
import imgSwap from '../images/log/swap.png'
import emojiCry from '../images/log/emojiCry.png'
import emojiDevil from '../images/log/emojiDevil.png'
import emojiNeutral from '../images/log/emojiNeutral.png'
import medalGold from '../images/log/medalGold.png'
import medalSilver from '../images/log/medalSilver.png'

export const pieces = {
  w: {
    k: wk,
    q: wq,
    b: wb,
    n: wn,
    r: wr,
    p: wp
  },
  b: {
    k: bk,
    q: bq,
    b: bb,
    n: bn,
    r: br,
    p: bp
  }
}

export const log = {
  imgWelcome1: imgWelcome1,
  imgWelcome2: imgWelcome2,
  imgFire: imgFire,
  imgNuke: imgNuke,
  imgLightning: imgLightning,
  imgGun: {
    left: imgGunLeft,
    right: imgGunRight
  },
  imgArrow: {
    left: imgArrowLeft,
    right: imgArrowRight
  },
  imgSwap: imgSwap,
  emojiCry: emojiCry,
  emojiDevil: emojiDevil,
  emojiNeutral: emojiNeutral,
  imgMedalGold: medalGold,
  imgMedalSilver: medalSilver
}