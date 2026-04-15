// This file handles DOM manipulation and talks to our API.

// 1. Grab the elements we need from our HTML using the IDs we gave them
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Our API backend URL. Notice how it matches the port our backend is listening on.
const API_URL = 'http://localhost:3000/api/todos';

// 2. Fetch Tasks (Read from Database via the API)
// "async/await" allows us to wait for the server to reply before running the next line of code.
async function fetchTodos() {
    try {
        const response = await fetch(API_URL); // Makes a typical GET request
        const data = await response.json();    // Converts response format to an Object
        
        // Clear the current visual list and draw all the tasks we got from the server
        todoList.innerHTML = '';
        data.todos.forEach(todo => {
            renderTodo(todo);
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// 3. Render a Single Task (DOM Manipulation)
// Putting HTML visually ON to the page without a full browser refresh
function renderTodo(todo) {
    // Create a new empty list item (<li>) tag
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id; // Store the database ID dynamically on the HTML tag
    
    // Inject inner visual structure
    li.innerHTML = `
        <span class="todo-content">${todo.task}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    
    // Add the new tag to our unordered list (<ul>)
    todoList.appendChild(li);
}

// 4. Add a Task (Create into Database via POST)
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the page from refreshing when user hits enter on form
    const taskValue = todoInput.value.trim();
    if (!taskValue) return;

    try {
        // We use fetch with POST to ping our Add Task route
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: taskValue }) // Sends the text to the backend
        });
        
        const newTodo = await response.json();
        renderTodo(newTodo); // Immediately visually add the new item!
        todoInput.value = ''; // Reset the input box to be empty
        
    } catch (error) {
        console.error("Error adding todo:", error);
    }
});

// 5. Delete a Task (Remove from Database via DELETE)
async function deleteTodo(id) {
    try {
        // Ping our Delete route with the specific ID on the end of the URL
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        // Remove it visually from the browser with a nice fading CSS animation
        const itemToRemove = document.querySelector(`li[data-id="${id}"]`);
        if (itemToRemove) {
            itemToRemove.style.animation = "fadeIn 0.3s reverse forwards"; 
            setTimeout(() => {
                itemToRemove.remove(); // Actually remove the HTML element
            }, 300);
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

// Automatically fetch our tasks right when the user opens the page!
fetchTodos();
