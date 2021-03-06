import './reset.css';
import './style.css';
import { isToday, isThisWeek, parseISO } from 'date-fns'

const LOCAL_STORAGE_JOBS_KEY = 'jobs.list';
const LOCAL_STORAGE_ACTIVE_JOB_ID_KEY = 'jobs.activeId'

const jobListContainer = document.querySelector('[data-jobs]');
const newJobForm = document.querySelector('[data-new-job-form]');
const newJobInput = document.querySelector('[data-new-job-input]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const taskTimeFrame = document.querySelector('[data-task-time-choice]')
const dateDropdown = document.querySelector('.date-dropdown');
const datePicker = document.querySelector('.date-picker');
const dateInput = document.querySelector('#due-date');
const taskStringInput = document.querySelector('.task-create');
const deleteJobButton = document.querySelector('.delete-job');
const currentJobTitle = document.querySelector('#current-job');
const tasksContainer = document.querySelector('.task-list');



jobListContainer.addEventListener('click', changeActiveJob);
newJobForm.addEventListener('submit', addNewJob);
newTaskForm.addEventListener('submit', addNewTask);
deleteJobButton.addEventListener('click', removeActiveJob);
taskTimeFrame.addEventListener('change', showDatePicker);


const jobCreator = (title, id) => {
    const taskList = [];
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
            id: "11111111", 
            taskString: "Welcome to JamesRedux Task Blaster App",
            dueDate: "Whenever",
            complete: false
        },
        {
            id: "22222222", 
            taskString: "First Create a new Job on the left.",
            dueDate: "ASAP",
            complete: false
        },
        {
            id: "33333333", 
            taskString: "Then you can add tasks to it in this task section",
            dueDate: "This Year",
            complete: false
        },
        {
            id: "44444444", 
            taskString: "Mark them as done and delete if desired",
            dueDate: "In The Future",
            complete: true
        },
        {
            id: "55555555", 
            taskString: "In the Job List on the left, you can also filter by tasks that are due today or this week!",
            dueDate: "2022-11-01",
            complete: false
        }

    ]

    seedTasks.forEach(task => {
        welcomeJob.taskList.push(task)
    });
  
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

function showDatePicker() {
    // e.preventDefault;
    if (taskTimeFrame.value === "setdate") {
        datePicker.style.display = "inline"   
    } else {
        datePicker.style.display = "none"
    };
};

function addNewTask(e) {
    e.preventDefault();
    let dueDate = taskTimeFrame.value
    const taskString = taskStringInput.value;
    if (taskString === null || taskString === "") return;
    const  currentJob = jobList.find(job => job.id === activeJobId);
    const taskId = Date.now().toString();
    if (taskTimeFrame.value === "setdate") {
     dueDate = dateInput.value;
    } 
    const newTask = taskCreator(taskId, taskString, dueDate);
    currentJob.taskList.push(newTask);
    console.log(this)
    this.reset();
    saveAndRender();
    
}

function changeActiveJob(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        activeJobId = e.target.dataset.jobId;
        saveAndRender();
    };
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

function toggleTaskDone(e) {
    const thisJobId = findJobFromTask(e.target.id).toString();
    const currentJob = jobList.find(job => job.id === thisJobId);
    const currentTask = currentJob.taskList.find(task => task.id == e.target.id);

    currentTask.complete = !currentTask.complete

    saveAndRender()
};

function removeTask() {
    const thisJobId = findJobFromTask(this.dataset.taskid).toString();
    const currentJob = jobList.find(job => job.id === thisJobId);

    currentJob.taskList = currentJob.taskList.filter(task => task.id != this.dataset.taskid.toString());
    saveAndRender()
   
}

function findJobFromTask(taskid) {
    let jobId = "";
    taskid = taskid.toString();
    jobList.forEach(job => {
        const matchingJob = job.taskList.filter(task => task.id === taskid)
        if (matchingJob.length > 0) {
            jobId = job.id;
        };
    });

    return jobId;
};

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
    clearElement(tasksContainer)
    if(jobList.length === 0) {
        seedJobs()
    }
    renderJobList()
    if(activeJobId === null) {
        const currentJob = jobList[0];
        activeJobId = currentJob.id;
    };
    
    const  currentJob = jobList.find(job => job.id === activeJobId);
    currentJobTitle.innerHTML = currentJob.title;
    renderTaskList(currentJob);
    showDatePicker();


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
    
    switch(currentJob.title) {
        case "Today":
        case "This Week":
            deleteJobButton.style.display = 'none';  
            newTaskForm.style.display = 'none';
            loadCurrentJobs(currentJob.title);
            break;
        default:    
            deleteJobButton.style.display = '';
            newTaskForm.style.display = '';
            createTaskList(currentJob.taskList);
        };    
  
};

function createTaskList(tasks) {
    
    tasks.forEach(task => {
        const newTask = document.createElement('div');
        newTask.classList.add("task");
   
        const newCheckbox = document.createElement('input');
        const newLabel = document.createElement('label');
        const newDueDate = document.createElement('p');
        const newButton = document.createElement('button');
    
        newCheckbox.setAttribute('type', 'checkbox');
        newCheckbox.setAttribute('id', task.id);
        if (task.complete) {
            newCheckbox.checked = true;
        }
        newLabel.setAttribute('for', task.id);
        newLabel.textContent = task.taskString;
    
        newDueDate.textContent = task.dueDate;
    
        newButton.setAttribute('class', 'btn delete-task');
        newButton.setAttribute('aria-label', 'delete new task');
        newButton.setAttribute('data-taskid', task.id);
        newButton.innerHTML = `<i class="fas fa-trash-alt"></i>`
        
           newTask.appendChild(newCheckbox);
           newTask.appendChild(newLabel);
           newTask.appendChild(newDueDate);
           newTask.appendChild(newButton);
           tasksContainer.appendChild(newTask)
        
      });
      addListenersToTasks()
}

function loadCurrentJobs(jobtitle) {
    // this function only called for today and this week jobs
    const filteredTasks = [];
    jobList.forEach(job => {
        job.taskList.forEach(task => {
           if (task.dueDate === null || task.dueDate === "") return;

           if (jobtitle === "Today") {
                if (isToday(parseISO(task.dueDate))) {
                filteredTasks.push(task)
                }
            } else {
                if (isThisWeek(parseISO(task.dueDate))) {
                    filteredTasks.push(task)
                    }
            };
            
        })
    });
    createTaskList(filteredTasks)
};




function addListenersToTasks() {
    const taskCheckboxs = document.querySelectorAll('[type="checkbox"]');
    const deletetaskButtons = document.querySelectorAll('.delete-task');
    deletetaskButtons.forEach(button => button.addEventListener('click', removeTask));
    taskCheckboxs.forEach(box => box.addEventListener('change', toggleTaskDone));

};

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    };
};


render();

