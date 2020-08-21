import './reset.css';
import './style.css';
import { isToday, isThisWeek } from 'date-fns'

const LOCAL_STORAGE_JOBS_KEY = 'jobs.list';
const LOCAL_STORAGE_ACTIVE_JOB_ID_KEY = 'jobs.activeId'

const jobListContainer = document.querySelector('[data-jobs]');
const newJobForm = document.querySelector('[data-new-job-form]');
const newJobInput = document.querySelector('[data-new-job-input]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const dateInput = document.querySelector('#due-date')
const taskStringInput = document.querySelector('.task-create');
const deleteJobButton = document.querySelector('.delete-job');
const currentJobTitle = document.querySelector('#current-job')
const tasksContainer = document.querySelector('.task-list')
// const taskCheckbox = document.querySelector('.task');


jobListContainer.addEventListener('click', changeActiveJob);
newJobForm.addEventListener('submit', addNewJob);
newTaskForm.addEventListener('submit', addNewTask);
deleteJobButton.addEventListener('click', removeActiveJob);
// taskCheckbox.addEventListener('change', toggleTaskDone);

const jobCreator = (title, id) => {
    const taskList = [];
    // this will be an array of objects, each task will be 
    // an object with string and due date
    return { title, id, taskList };
};

const taskCreator = (id, taskString, dueDate) => {
    let complete = false;
    return { taskString, dueDate, complete, id };
}

let jobList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_JOBS_KEY)) || [];
let activeJobId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVE_JOB_ID_KEY));




function seedJobs() {
    let seedTitles = ["Welcome", "Today", "This Week", "Coursework", "House"];
    let idNum = 1
    seedTitles.forEach(job => {
        const thisJob = jobCreator(job, idNum.toString());
        jobList.push(thisJob);
        idNum++;
    })
    seedTasks();
};

function seedTasks() {
    const welcomeJob = jobList.find(job => job.title === "Welcome");
    const seedTasks = [
        {
            id: 1, 
            taskString: "Welcome to JamesRedux To Do App",
            dueDate: null,
            complete: false
        },
        {
            id: 2, 
            taskString: "You can create tasks and goals and set due dates",
            dueDate: null,
            complete: false
        },
        {
            id: 3, 
            taskString: "Once done you and mark them as completed or delete them",
            dueDate: null,
            complete: false
        },
        {
            id: 4, 
            taskString: "You can create new jobs on the left and new tasks below",
            dueDate: null,
            complete: false
        },
        {
            id: 5, 
            taskString: "Each task belongs to a job!",
            dueDate: null,
            complete: false
        }

    ]

    seedTasks.forEach(task => {
        welcomeJob.taskList.push(task)
    })
  
};


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

function addNewTask(e) {
    e.preventDefault();
    const taskString = taskStringInput.value;
    if (taskString === null || taskString === "") return;
    const  currentJob = jobList.find(job => job.id === activeJobId);
    const taskId = Date.now().toString();
    const dueDate = dateInput.value;
    const newTask = taskCreator(taskId, taskString, dueDate);
    currentJob.taskList.push(newTask);
    
    saveAndRender();
    this.reset();
    
}

function changeActiveJob(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        activeJobId = e.target.dataset.jobId;
        saveAndRender();
    }
};

function removeActiveJob(e) {
    if(activeJobId === null) return;
    var result = confirm("Are you sure you want to delete this job and all connected tasks?");
    if (result){
    jobList = jobList.filter(job => job.id != activeJobId);
    activeJobId = null;
    saveAndRender()
    };    
};

function toggleTaskDone() {
    console.log("toggle")
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
    if(jobList.length === 0) {
        seedJobs()
    }
    renderJobList()
    if(activeJobId === null) {
       currentJobTitle.innerHTML = ""
    } else {
       const  currentJob = jobList.find(job => job.id === activeJobId);
       currentJobTitle.innerHTML = currentJob.title;
       clearElement(tasksContainer)
       renderTaskList(currentJob)
    };
};

function renderJobList() {
    jobList.forEach(job => {
        const newJob = document.createElement('li');
        newJob.classList.add("job-name");
        newJob.dataset.jobId = job.id;
        if (job.id.toString() === activeJobId){
            newJob.classList.add('active-job');
        }
        newJob.innerText = job.title;
        jobListContainer.appendChild(newJob);
    })
};

function renderTaskList(currentJob) {
    currentJob.taskList.forEach(task => {
        const newTask = document.createElement('div');
        newTask.classList.add("task");
        newTask.innerHTML = `

        <input type="checkbox" name="" id="${task.id}">
        <label for="${task.id}">${task.taskString}</label>
        <p>${task.dueDate}</p>
        <button class=" btn delete-task" aria-label="delete new task"><i class="fas fa-trash-alt"></i></button>
        
        `
        tasksContainer.appendChild(newTask)
    });
   

    // console.log(currentJob.taskList)
};

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    };
};

// seedJobs();
render();