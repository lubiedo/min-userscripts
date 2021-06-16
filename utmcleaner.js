// ==UserScript==
// @name        clean urls and remove trackers like Urchin Tracking Module
// @match       http*://*
// @run-at      document-start
// ==/UserScript==

// based on a previous extension for Chrome that I wrote

var query_params = [
  /^utm_.+$/,         // UTM
  /^(g|fb|y)clid$/,   // Google|FB|Yandex
  /^_hs.+$/,          // HubSpot
  /^icid$/,           // Adobe
  /^igshid$/,         // Instagram
  /^mc_[ce]id$/,      // Google
  /^mkt_tok$/,        // Google
  /^_openstat$/       // Yandex
]

function is_tracker(p) {
  for (r of query_params)
    if (r.test(p))
      return true
  return false
}

function cleaner(u) {
  let url = new URL(u)
  var to_delete = []

  if (url.search.length === 0)
    return url.href

  for (param of url.searchParams.keys()) {
    if (is_tracker(param)) {
      to_delete.push(param)
      continue
    }
  }

  for (param of to_delete)
    url.searchParams.delete(param)

  return url.href
}

(function(){
  for (A of document.querySelectorAll('a')) {
    if (A.hasAttribute('href')) {
      var href =  A.href

      if (href === "") continue
      if (!/^https*\:/.test(href) && A.host === window.location.host) {
        href = (href.charAt(0) === '/' ? href : `/${href}`)
      }
      A.setAttribute('href', cleaner(href))
    }
  }
})()
