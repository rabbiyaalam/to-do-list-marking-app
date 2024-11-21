class Task {  
    constructor(title, description, priority, category) {  
        this.title = title;  
        this.description = description;  
        this.priority = priority;  
        this.category = category;  
        this.completed = false;  
    }  

    toggleStatus() {  
        this.completed = !this.completed;  
    }  

    updatePriority(newPriority) {  
        this.priority = newPriority;  
    }  
}  

class ToDoList {  
    constructor() {  
        this.tasks = this.loadTasks();  
        this.updateFilterOptions();  
        this.renderTasks();  
    }  

    loadTasks() {  
        const tasksFromStorage = JSON.parse(localStorage.getItem('tasks'));  
        return tasksFromStorage ? tasksFromStorage.map(task => Object.assign(new Task(), task)) : [];  
    }  

    saveTasks() {  
        localStorage.setItem('tasks', JSON.stringify(this.tasks));  
    }  

    addTask(task) {  
        this.tasks.push(task);  
        this.saveTasks();  
        this.updateFilterOptions();  
        this.renderTasks();  
    }  

    removeCompletedTasks() {  
        this.tasks = this.tasks.filter(task => !task.completed);  
        this.saveTasks();  
        this.renderTasks();  
    }  

    filterTasks(category, priority) {  
        return this.tasks.filter(task => {  
            const categoryMatch = category ? task.category === category : true;  
            const priorityMatch = priority ? task.priority === priority : true;  
            return categoryMatch && priorityMatch;  
        });  
    }  

    renderTasks(category = '', priority = '') {  
        const taskList = document.getElementById('taskList');  
        taskList.innerHTML = '';  

        const filteredTasks = this.filterTasks(category, priority);  
        filteredTasks.forEach(task => {  
            const taskItem = document.createElement('li');  
            taskItem.className = `${task.priority} ${task.completed ? 'completed' : ''}`;  
            taskItem.innerHTML = `  
                <div>  
                    <strong>${task.title}</strong> (${task.priority})  
                    <p>${task.description}</p>  
                    <em>Category: ${task.category}</em>  
                </div>  
                <button class="toggleStatusBtn">✔️</button>  
                <button class="removeTaskBtn">❌</button>  
            `;  
            taskItem.querySelector('.toggleStatusBtn').onclick = () => {  
                task.toggleStatus();  
                this.saveTasks();  
                this.renderTasks(category, priority);  
            };  

            taskItem.querySelector('.removeTaskBtn').onclick = () => {  
                this.tasks = this.tasks.filter(t => t !== task);  
                this.saveTasks();  
                this.renderTasks(category, priority);  
            };  

            taskList.appendChild(taskItem);  
        });  
    }  

    updateFilterOptions() {  
        const filterCategory = document.getElementById('filterCategory');  
        const categories = [...new Set(this.tasks.map(task => task.category))];  

        filterCategory.innerHTML = `<option value="">All Categories</option>`;  
        categories.forEach(category => {  
            const option = document.createElement('option');  
            option.value = category;  
            option.textContent = category;  
            filterCategory.appendChild(option);  
        });  
    }  
}  

// UI Interaction  
const toDoList = new ToDoList();  

document.getElementById('addTaskBtn').onclick = () => {  
    const title = document.getElementById('taskTitle').value;  
    const description = document.getElementById('taskDescription').value;  
    const priority = document.getElementById('taskPriority').value;  
    const category = document.getElementById('taskCategory').value;  

    if (title && category) {  
        const newTask = new Task(title, description, priority, category);  
        toDoList.addTask(newTask);  
        document.getElementById('taskTitle').value = '';  
        document.getElementById('taskDescription').value = '';  
        document.getElementById('taskCategory').value = '';  
    } else {  
        alert('Please enter a title and category for the task.');  
    }  
};  

document.getElementById('filterTasksBtn').onclick = () => {  
    const category = document.getElementById('filterCategory').value;  
    const priority = document.getElementById('filterPriority').value;  
    toDoList.renderTasks(category, priority);  
};  

document.getElementById('clearCompletedBtn').onclick = () => {  
    toDoList.removeCompletedTasks();  
};