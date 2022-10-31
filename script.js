const input = document.querySelector('.input_task');
const buttonAdd = document.querySelector('.button_add');
const listContainer = document.querySelector('.list_container');
const listNotDone = document.querySelector('.not_done');
const setDateField = document.querySelector('.set_date');
const inputDate = document.querySelector('.input_date');
const inputTime = document.querySelector('.input_time');
const counterBtn = document.querySelector('.counter');
const counterValue = document.querySelector('.counter_value');
const listDone = document.querySelector('.list_done');
const ulDone = document.querySelector('.ul_done');
const logo = document.querySelector('h1');
const helperShowDone = document.querySelector('.helper_show_done');
const helperShowDoneText = document.querySelector('.helper_show_done_text');
const helperBackToList = document.querySelector('.helper_back_to_list');
const helperBackToListText = document.querySelector('.helper_back_to_list_text');
const emptyMessage = document.querySelector('.empty_message');

let tasks = [];

if (localStorage.getItem('tasks') != null){
    tasks = JSON.parse(localStorage.getItem('tasks'));
};

function addNewTask(text) {
    if (!text) return;

    let task = {
        text : text,
        id : `${Math.random()}`,
        done : false,
        date : inputDate.value,
        time : inputTime.value,
    };

    tasks.push(task);
};

function renderTasks() {

    let htmlForListNotDone = '';

    tasks.forEach(task => {
        if (!task.done) {
            htmlForListNotDone += `<div class='task_with_delbtn'><div class='task'>
            <div class='task_text'>${task.text}</div>
            <div class='task_options'><div class='task_date'>${task.time} ${task.date}</div>
            <button data-id=${task.id} class='btn_task'>◯</button></div></div>
            <button class='btn_del' data-id=${task.id}>╳</button></div>`;
        };
    });

    if (htmlForListNotDone == '') {
        listNotDone.innerHTML = '<div class="empty_message">list is empty</div>';
    }else {
        listNotDone.innerHTML = htmlForListNotDone;
    };
    counter();
};

function renderCompleted() {

    let htmlForUlDone = '';
    listDone.innerHTML = '';

        tasks.forEach(task => {
            if (task.done) {
                htmlForUlDone += `<div class='completed_task'>${task.text}<div class='task_options'>
                <div class='task_date'>${task.time} ${task.date}</div>
                <button data-id=${task.id} class='btn_task'>↺</button></div></div></div>`;
            };
        });

        if (htmlForUlDone == '') {
            listDone.innerHTML = '<div class="empty_message">no completed tasks</div>';
            listDone.style.removeProperty("background-color");
        }else{
            listDone.innerHTML += `<h2>completed:</h2>`;
            listDone.style.backgroundColor = 'white';
            listDone.innerHTML += htmlForUlDone;
            listDone.innerHTML += `<button class='btn_clear'>╳</button>`;
        };
};

function makeDone(id) {
    tasks.forEach(task => {
        if (task.id == id) {
            task.done = true;
        };
    });
    renderTasks();
};

function deleteTask (id) {
    let index = 0;

    tasks.forEach(task => {
        if (task.id == id) {
            index = tasks.indexOf(task);
        };
    });
    tasks.splice(index,1);
    renderTasks();
};

function clearAllCompleted() {

    tasks = tasks.filter( task => !task.done);
};

function returnTask(id) {
    tasks.forEach(task => {
        if (task.id == id) {
            task.done = false;
        };
    });
};

function counter() {
    let value = 0;

    tasks.forEach(task => {
        if (task.done) {
            value += 1;
        }
    });
    counterValue.textContent = value;
};

function showHelper(helper) {
    helper.style.visibility = 'visible';
    helper.style.opacity = 1;
};

function hideHelper(helper) {
    helper.style.visibility = 'hidden';
    helper.style.opacity = 0;
};


function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


counter();
renderTasks();
setInterval(saveToLocalStorage, 5000);

buttonAdd.addEventListener('click', () => {
    addNewTask(input.value);
    input.value = '';
    inputDate.value = '';
    inputTime.value = '';
    renderTasks();
    setDateField.style.opacity = 0;
});

listNotDone.addEventListener('click', (event) => {
    if (event.target.className == 'btn_task') {
        makeDone(event.target.dataset.id);
    };
});

document.body.addEventListener('keydown', (event) => {
    if (event.code == 'Enter') {
        buttonAdd.click();
    }
    });

input.addEventListener('input', () => {
    setDateField.style.opacity = 1;
});

counterBtn.addEventListener('click', () => {

    renderCompleted();
    listContainer.style.left = '-680px';
});

counterBtn.addEventListener('click', () => {

    showHelper(helperBackToList);
    helperBackToListText.style.left = logo.getBoundingClientRect().right + 20 + 'px';
    helperBackToListText.style.top = `${logo.getBoundingClientRect().top + logo.offsetHeight / 2}px`;
},{once: true});

logo.addEventListener('click', () => {

    listContainer.style.left = '250px';
    helperBackToList.style.opacity = 0;
});

listNotDone.addEventListener('click', (event) => {

    if (event.target.className == 'btn_task') {
        showHelper(helperShowDone);
        helperShowDoneText.style.left = counterBtn.getBoundingClientRect().left - helperShowDoneText.offsetWidth - 20 + 'px';
        helperShowDoneText.style.top = `${counterBtn.getBoundingClientRect().top + counterBtn.offsetHeight / 2}px`;
    };
},{once: true});

helperShowDone.addEventListener('click', () => {
    hideHelper(helperShowDone);
});

helperBackToList.addEventListener('click', () => {
    hideHelper(helperBackToList); 
});

listDone.addEventListener('click', (event)=> {
    if (event.target.tagName == 'BUTTON' && event.target.dataset.id != undefined){
        returnTask(event.target.dataset.id);
        renderCompleted();
        renderTasks();
    };
});

listDone.addEventListener('click', (event) => {
    if (event.target.tagName == 'BUTTON' && event.target.className == 'btn_clear'){
        clearAllCompleted();
        renderTasks();
        renderCompleted();
    };
});

listNotDone.addEventListener('click', (event) => {
    if (event.target.className == 'btn_del'){
        deleteTask(event.target.dataset.id);
    };
});