// ==UserScript==
// @name        minimalistic twitter
// @match       https://twitter.com/*
// @run-at      document-end
// ==/UserScript==

/*
 This code was taken from https://github.com/thomaswang/minimal-twitter
 and modified, updated and added some stuff.

 to toggle mini-tw use the Meta + Shift + m keybinding
*/

const config = {
  on: true,
  feedWidth: "800px",
  showLatest: true,
  centerNavigation: true,
  noTitleContainer: true,
  noTweetButton: true,
  noFeedBorders: true,
  noBorders: true,
  noLikes: false,
  noRetweets: false,
  noExploreButton: true,
  noNotificationsButton: false,
  noBookmarksButton: false,
  noListsButton: false,
  simpleNavButtons: true,
  noSideBar: true,
  noDMDrawer: true,
  noPromotions: true,
}

/* reverse search for a parent that matches */
function reverse(e, matcher) {
  var parent = e.parentNode
  do {
    if (matcher(parent))
    return parent
    parent = parent.parentNode
  } while (parent !== null)

  return null
}

function addStyles(css) {
  var head = document.querySelector("head")
  var style = document.createElement("style")
  style.id = "mini-tw"
  style.textContent = `${css}`
  head.appendChild(style)
}

function showLatestTweets() {
  const run = () => {
    const button = document.querySelector("div[aria-label='Top Tweets on']");
    const home = document.querySelector("a[aria-label='Home']");

    if (button) {
      button.click();
      document.querySelector("div[role='menuitem'][tabindex='0']").click();
    }

    if (home) {
      // Set onclick as well in case they nagivate to a non-home page when first loading the site
      home.onclick = () => {
        setTimeout(showLatestTweets, 50);
      };
    }
  };

  setTimeout(run, 500);
}

function doit() {
  var minimal_style = `
  div[data-testid="primaryColumn"],
  div[data-testid="primaryColumn"] > div > div,
  div[data-testid="primaryColumn"] > div > div > div > div,
  div[data-testid="primaryColumn"] > div > div > div:nth-child(2),
  div[data-testid="primaryColumn"] > div > div > div:nth-child(3),
  div[data-testid="primaryColumn"] > div > div > div:nth-child(4),
  div[data-testid="primaryColumn"] > div > div > div:nth-child(2) > div > div {
    max-width: ${config.feedWidth} !important;
  }
  `

  if (config.showLatest === true) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showLatestTweets);
    } else {
      showLatestTweets();
    }
  }

  if (config.centerNavigation === true) {
    minimal_style += `
    header[role="banner"] > div > div > div {
      justify-content: center !important;
      padding-top: 0;
    }
    `
  }

  if (config.noTitleContainer === true) {
    minimal_style += `
    div[data-testid="titleContainer"] {
      display: none !important;
    }
    `
  }

  if (config.noTweetButton === true) {
    minimal_style += `
    a[aria-label="Tweet"][role="link"] {
      display: none !important;
    }
    `
  }

  if (config.noFeedBorders === true) {
    minimal_style += `
    div[data-testid="primaryColumn"],
    div[data-testid="primaryColumn"] > div > div {
      border: 0px !important;
      background-color: transparent !important;
    }
    `
  }

  if (config.noBorders === true) {
    minimal_style += `
    div[aria-label="Timeline: Your Home Timeline"] > div > div > div,
    div[aria-label="Timeline: Your Home Timeline"] > div > div > div > div {
      border-bottom-color: transparent;
    }
    div[aria-label="Timeline: Explore"] > div > div > div,
    div[aria-label="Timeline: Explore"] > div > div > div > div {
      border-bottom-color: transparent;
    }
    `
  }

  if (config.noLikes === true) {
    minimal_style += `div[data-testid="like"] > div > div:nth-child(2) {
      visibility: hidden !important;
    }`
  }

  if (config.noRetweets === true) {
    minimal_style += `div[data-testid="retweet"] > div > div:nth-child(2) {
      visibility: hidden !important;
    }`
  }

  if (config.noExploreButton === true) {
    minimal_style += `a[data-testid="AppTabBar_Explore_Link"] {
      display: none !important;
    }`
  }

  if (config.noNotificationsButton === true) {
    minimal_style += `a[data-testid="AppTabBar_Notifications_Link"] {
      display: none !important;
    }`
  }

  if (config.noBookmarksButton === true) {
    minimal_style += `header > div > div > div > div > div:nth-child(2) > nav > a:nth-child(5) {
      display: none !important;
    }`
  }

  if (config.noListsButton === true) {
    minimal_style += `header > div > div > div > div > div:nth-child(2) > nav > a:nth-child(6) {
      display: none !important;
    }`
  }

  if (config.noSideBar === true) {
    minimal_style += `div[data-testid='sidebarColumn'] {
      display: none !important;
    }`
  }

  if (config.noDMDrawer === true) {
    minimal_style += `div[data-testid='DMDrawer'] {
      display: none !important;
    }`
  }

  if (config.noPromotions === true) {
    let watchdog = new MutationObserver(mutants => {
      for (mutant of mutants) {
        for (span of mutant.target.querySelectorAll('article > * div[dir="auto"] > span')) {
          if (span.textContent === "Promoted") {
            let placement = reverse(span, (e) => {
              if (e !== null && e.hasAttribute('data-testid') && e.getAttribute('data-testid') === 'placementTracking') {
                return true
              }
              return false
            })

            if (placement !== null && placement.parentNode.parentNode.getAttribute('hidden') !== "true") {
              placement.parentNode.parentNode.style.setProperty('display', 'none !important')
              placement.parentNode.parentNode.setAttribute('hidden', 'true')
            }
          }
        }
      }
    })

    watchdog.observe(document.querySelector('body'),{
      childList: true,
      subtree: true,
    })
  }

  if (config.simpleNavButtons === true) {
    minimal_style += `
      [data-testid="SideNav_AccountSwitcher_Button"] { width: fit-content;}
      nav[role="navigation"] > [data-testid*="AppTabBar_"] > * > div[dir="auto"],
      [data-testid="SideNav_AccountSwitcher_Button"] > div[class*="r-"],
      nav[role="navigation"] > a > * > div[dir="auto"]
       {
         display: none !important;
      }
    `
  }

  if (config.on)
    addStyles(minimal_style)
  else
    document.querySelector("style[id='mini-tw']").remove()
}

(function(){doit()})()
window.addEventListener('keydown', e => {
  if (e.key === "m" && e.metaKey === true && e.shiftKey === true) {
    config.on = !config.on
    doit()
  }
})
