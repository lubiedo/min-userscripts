// ==UserScript==
// @name            yt-cinema
// @description     enables cinema mode (browser full screen) via Meta+Shift+C
// @match           *://www.youtube.com/watch*
// @run-at          document-start
// ==/UserScript==
/* NOTE: put the player in theater mode before using */

var cinema = false;
var old_video_style = ''
var style  = `
  position: fixed;
  width: 100%;
  height: 100%;
  max-height: 100%;
  z-index: 999999;
  top: 0;
`
function toggle() {
  let e = document.querySelector('div[id="player-theater-container"]')
  if (e === null)
    return
  let v = document.getElementsByTagName('video')[0]

  cinema = !cinema
  if (cinema) {
    e.style = style
    old_video_style = v.style
    v.style.height = `${e.clientHeight}px`
    v.style.width = `100%`
    v.style.left = `0px`
    document.documentElement.style.overflow = "hidden"
  } else {
    e.style = ''
    v.style = old_video_style
    window.dispatchEvent(new Event('resize'))
  }
}

(function() {
  window.addEventListener('resize', () => {
    document.documentElement.style.overflow = (cinema ? "hidden" : "")
  }, true)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' && e.metaKey === true && e.shiftKey === true) toggle()
  })
})()
