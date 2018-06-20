
// const GITLAB_URL = 'https://git.demo.com'
// const GITLAB_PROJECT_ID = 1 //https://gitlab.demo.com/group/project/edit   General project settings
// const GITLAB_USER_ID = 1 //https://gitlab.demo.com/profile
// const GITLAB_PRIVATE_TOKEN = 'xxxx-xxx' //https://gitlab.demo.com/profile/personal_access_tokens
// const REDMINE_URL = 'https://redmine.saybot.net'
// const REDMINE_API_KEY = 'xxxxxxx' //https://redmine.demo.com/my/account

const labels = {
  Task: 'Feature',
  Bug: 'Bug'
}

async function run() {
  const redmineUrl = await getRedmineIssueUrl()
  console.log(redmineUrl)
  // const issue = await fetchRedmine(`${redmineUrl}.json`)
  // const issueUrl = await postGitlab(issue)
  // openUrlNewTab(issueUrl)
}

function openUrlNewTab(url) {
  chrome.tabs.create({ url: url })
}

function getRedmineIssueUrl() {
  return new Promise(resolve => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      resolve(tabs[0].url)
    })
  })
}

async function format(data) {
  const {
    id,
    tracker,
    priority,
    subject,
    description,
    fixed_version
  } = data.issue

  const regex = /\d+(\.\d+)+/g
  let version = fixed_version.name.match(regex)

  const issue = {
    title: `${subject} (REDMINE-${id})`,
    description,
    weight: priority.id, //都是越大越重要
    labels: labels[tracker.name],
    assignee_ids: [GITLAB_USER_ID],
    milestone_id: version && (await getMilestoneId(version.toString()))
  }

  return issue
}

function fetchRedmine(url) {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Redmine-API-Key': REDMINE_API_KEY
    }
  })
    .then(response => response.json())
    .then(data => format(data))
}

function getMilestoneId(version) {
  return fetch(
    `${GITLAB_URL}/api/v4/projects/${GITLAB_PROJECT_ID}/milestones?search=${version}`,
    {
      headers: {
        'content-type': 'application/json',
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
      }
    }
  )
    .then(response => response.json())
    .then(data => data[0].id)
}

function postGitlab(data) {
  return fetch(`${GITLAB_URL}/api/v4/projects/${GITLAB_PROJECT_ID}/issues`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => data.web_url)
}
