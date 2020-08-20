import './reset.css';
import './style.css';


const jobListContainer = document.querySelector('[data-jobs]');
const newJobForm = document.querySelector('[data-new-job-form]');
const newJobInput = document.querySelector('[data-new-job-input]');

newJobForm.addEventListener('submit', addNewJob);


let jobList = [];
// these should be objects


const jobCreator = (title, id) => {
    const taskList = [];
    // this will be an array of objects, each task will be 
    // an object with string and due date
    return { title, id, taskList };
};

function seedJobs() {
    let seedTitles = ["Today", "This Week", "Coursework", "House"];
    let idNum = 1;
    seedTitles.forEach(job => {
        const thisJob = jobCreator(job, idNum);
      jobList.push(thisJob);
      idNum++;
    })

}

function addNewJob(e) {
    e.preventDefault();
    console.log(newJobInput.value)
    const newJobTitle = newJobInput.value;
    if (newJobTitle === null || newJobTitle === "") return;
    
    this.reset()
};

function render() {
    seedJobs();
    clearElement(jobListContainer);
    console.log(jobList)
    jobList.forEach(job => {
        const newJob = document.createElement('li');
        newJob.classList.add("job-name");
        newJob.dataset.jobId = job.id
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


render();