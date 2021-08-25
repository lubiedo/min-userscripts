// ==UserScript==
// @name        tweet-link-unminify
// @inject-into content
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// ==/UserScript==

const interval  = 1 // secs.
const selectors = {
  tweetdeck: 'a.url-ext:not([_processed=true])',
  twitter:   'a[href^="https://t.co"]:not([_processed=true])'
}
const isDeck = window.location.href.includes('tweetdeck')

;(function(){
  setInterval(() => {
    const targets = document.querySelectorAll(
      isDeck ? selectors.tweetdeck : selectors.twitter
    )
    for (const e of targets) {
      const full_url = isDeck ? e.getAttribute('data-full-url') : e.textContent.replace('…','')
      if (full_url) {
        e.setAttribute('href', full_url)
        e.setAttribute('_processed', true)
      }
    }
  }, interval * 1000)
})()

