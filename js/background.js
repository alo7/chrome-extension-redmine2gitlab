// redmine: gitlab 对应关系
const labels = {
  Task: 'Feature',
  Bug: 'Bug'
}

function main(config) {
  const {
    GITLAB_URL,
    GITLAB_PROJECT_ID,
    GITLAB_USER_ID,
    GITLAB_PRIVATE_TOKEN,
    REDMINE_URL,
    REDMINE_API_KEY
  } = config

  run()

  async function run() {
    const redmineUrl = await getRedmineIssueUrl()
    const issue = await fetchRedmine(`${redmineUrl}.json`)
    const issueUrl = await postGitlab(issue)
    openUrlNewTab(issueUrl)
  }

  function openUrlNewTab(url) {
    chrome.tabs.create({ url: url })
  }

  function getRedmineIssueUrl() {
    return new Promise(resolve => {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        const url = new URL(tabs[0].url)
        resolve(`${url.origin}${url.pathname}`)
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
    let version = fixed_version && fixed_version.name.match(regex)

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
      .catch(error => console.error(error))
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
      .catch(error => console.error(error))
      .then(data => (data[0] ? data[0].id : ''))
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
      .catch(error => console.error(error))
      .then(data => data.web_url)
  }
}
