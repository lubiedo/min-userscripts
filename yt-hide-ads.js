// ==UserScript==
// @name               Hide youtube google ad and fix ad failure
// @description        hide youtube google ad, auto click "skip ad" and reload if video load failed because of ad block
// @match              *://www.youtube.com/watch*
// ==/UserScript==

var fixVideo = () => {
  // kinda fixes broken videos because of blocking https://www.youtube.com/pagead/conversion/
  setInterval(() => {
    const el = document.querySelector('.video-stream.html5-main-video')
    if (el && el.getAttribute('src') === null) {
      console.log('Reloading broken video...')

      let url = new URL(window.location.href)
      if (url.searchParams.has('t')) {
        url.searchParams.set('t', 0)
        window.location.href = url.toString()
      } else {
        window.location.reload(false)
      }
    }
  }, 500)
}
var closeAd = function (){
    var css = '.video-ads .ad-container .adDisplay, #player-ads, .ytp-ad-module, .ytp-ad-image-overlay{ display: none !important; }',
        style = document.createElement('style');

    style.type = 'text/css'
    if (style.styleSheet){
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css))
    }

    document.head.appendChild(style)
};
var skipAd = function(){ 
  const observer = new MutationObserver(function(list, mutationObserver){
    for (const mutation of list) {
      if (!mutation.target)
        continue
      const target = mutation.target
      const button = target.querySelector(".ytp-ad-skip-button.ytp-button")||target.querySelector(".videoAdUiSkipButton")
      if (button) {
        button.click()
        mutationObserver.disconnect()
      }
    }
  })
  observer.observe(document.querySelector('.video-ads.ytp-ad-module'),
    {childList: true, subtree: true })
};

closeAd()
skipAd()
fixVideo()
