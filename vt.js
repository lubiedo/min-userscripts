// ==UserScript==
// @name Search VirusTotal
// @match *
// @run-at context-menu
// ==/UserScript==
/*
what is being search during selection:
  * selected string will be search normally
  * if surrounded by quotes then use `content:%s` (ie. "hello world")
  * if nothing selected or selected string starts with https,http,ftp + :// then search URL
*/

// VT uses SHA-256 for URL hashing
async function sha256sum(d)
{
  let data = new TextEncoder().encode(d)
  let hashbuf = await crypto.subtle.digest('SHA-256', data)
  let hasharray = Array.from(new Uint8Array(hashbuf))
  return hasharray.map(b => b.toString(16).padStart(2,'0')).join('')
}

function search_url(url) {
  var hash = sha256sum(url)
  hash.then(i => {
    window.open(`https://www.virustotal.com/gui/url/${i}`, '_blank') 
  })
}

var select = getSelection().toString()
if (select) {
  if (/^(?:https*|ftp):\/\//i.test(select)){
    search_url(select)
  } else {
    select = (/^".+"$/.test(select) ? `content:${select}` : select)
    window.open(`https://www.virustotal.com/gui/search/${escape(select)}`, '_blank')
  }
} else {
  search_url(location.href)
}
