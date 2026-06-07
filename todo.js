// Todo App with Local Storage

const todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Add new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Fadlan shaqa ku qor');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('so-SO')
    };

    todos.push(todo);
    saveTodos();
    input.value = '';
    input.focus();
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// Clear completed todos
function clearCompleted() {
    const completed = todos.filter(t => t.completed);
    
    if (completed.length === 0) {
        alert('Dhameeystay ma joog');
        return;
    }
    
    if (confirm(`${completed.length} shaqa ay tirida tirtiri?`)) {
        todos.splice(0, todos.length, ...todos.filter(t => !t.completed));
        saveTodos();
        renderTodos();
    }
}

// Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter todos
    let filtered = todos;
    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Show empty state
    if (filtered.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
    
    // Render todos
    filtered.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <div class="todo-content">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="todo-date">${todo.createdAt}</span>
            </div>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        todoList.appendChild(todoItem);
    });
    
    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    // Initial render
    renderTodos();
});