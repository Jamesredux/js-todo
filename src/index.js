import './reset.css';
import './style.css';
import { isToday, isThisWeek } from 'date-fns'

const LOCAL_STORAGE_JOBS_KEY = 'jobs.list';
const LOCAL_STORAGE_ACTIVE_JOB_ID_KEY = 'jobs.activeId'

const jobListContainer = document.querySelector('[data-jobs]');
const newJobForm = document.querySelector('[data-new-job-form]');
const newJobInput = document.querySelector('[data-new-job-input]');

jobListContainer.addEventListener('click', changeActiveJob);
newJobForm.addEventListener('submit', addNewJob);

const jobCreator = (title, id) => {
    const taskList = [];
    // this will be an array of objects, each task will be 
    // an object with string and due date
    return { title, id, taskList };
};

let jobList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOBS_KEY)) || seedJobs();
let activeJobId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVE_JOB_ID_KEY));




function seedJobs() {
    let jobListArray = []
    let seedTitles = ["Today", "This Week", "Coursework", "House"];
    let idNum = 1
    seedTitles.forEach(job => {
        const thisJob = jobCreator(job, idNum.toString());
      jobListArray.push(thisJob);
      idNum++;
    })
    return jobListArray;
}

function addNewJob(e) {
    e.preventDefault();

    const newJobTitle = newJobInput.value;
    if (newJobTitle === null || newJobTitle === "") return;
    const jobId = Date.now().toString()
    const newJob = jobCreator(newJobTitle, jobId);
    jobList.push(newJob);
    saveAndRender()
    this.reset()
};

function changeActiveJob(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        activeJobId = e.target.dataset.jobId;
        saveAndRender();
    }
}

function saveAndRender() {
    save()
    render()
};

function save() {
    localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(jobList));
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_JOB_ID_KEY, JSON.stringify(activeJobId))
};

function render() {
  
    clearElement(jobListContainer);
    console.log(jobList)
    jobList.forEach(job => {
        const newJob = document.createElement('li');
        newJob.classList.add("job-name");
        newJob.dataset.jobId = job.id;
        console.log("job id " + job.id)
        console.log("active job id " + activeJobId)
        if (job.id == activeJobId){
            console.log("this past works")
            newJob.classList.add('active-job');
        }
        newJob.innerText = job.title;
        jobListContainer.appendChild(newJob);
        // let thisJob = `<li class="job-name">${job}</li>`

        // jobListContainer.innerHTML = `<li class="job-name">${job}</li>`
    })
};

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    };
};

// seedJobs();
render();