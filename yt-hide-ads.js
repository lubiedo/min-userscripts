// ==UserScript==
// @name               hide youtube ads
// @description        hide youtube google ad, auto click "skip ad" and reload if video load failed because of ad block
// @match              *://www.youtube.com/*
// @run-at             document-start
// ==/UserScript==

const isWatch = () => { return window.location.href.includes('watch') }

const fixVideo = () => {
  if (!isWatch())
    return
  const el = document.querySelector('.video-stream.html5-main-video')
  if (el && el.src.length === 0) {
    const url = new URL(window.location.href)
    if (url.searchParams.has('t')) {
      url.searchParams.set('t', 0)
      window.location.href = url.toString()
    } else {
      window.location.reload(false)
    }
  }
}
const closeAd = function (){
    const css = '.video-ads .ad-container .adDisplay, #player-ads, .ytp-ad-module, .ytp-ad-image-overlay{ display: none !important; }',
        style = document.createElement('style');

    style.type = 'text/css'
    style.id   = 'no-ads'
    if (style.styleSheet){
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css))
    }

    document.head.appendChild(style)
};
const skipAd = function(){ 
  const observer = new MutationObserver(function(list, mutationObserver){
    for (const mutation of list) {
      const button = document.querySelector(".ytp-ad-skip-button.ytp-button")||document.querySelector(".videoAdUiSkipButton")
      if (button && button.nodeName === "BUTTON" ) {
        button.click()
      }
    }
    mutationObserver.disconnect()
  })

  const i = setInterval(() => {
    const videoEl = document.querySelector('.video-ads.ytp-ad-module')
    if (videoEl !== null) {
      observer.observe(videoEl, {childList: true, subtree: true })
      clearInterval(i)
    }
  }, 100)
};

closeAd()
skipAd()
setInterval(fixVideo, 500)
