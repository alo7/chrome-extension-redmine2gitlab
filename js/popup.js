const bg = chrome.extension.getBackgroundPage()

const defaultConfig = {
  GITLAB_URL: '',
  GITLAB_PROJECT_ID: '',
  GITLAB_USER_ID: '',
  GITLAB_PRIVATE_TOKEN: '',
  REDMINE_URL: '',
  REDMINE_API_KEY: ''
}

chrome.storage.sync.get(defaultConfig, items => {
  if (!Object.values(items).every(i => !!i)) {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  } else {
    bg.main(items)
  }
})
