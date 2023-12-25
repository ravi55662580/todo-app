    const apiKey = 'a7ebb18e8884426cbe92623a763b4169'; 
    const apiUrl = `https://crudcrud.com/api/${apiKey}/todos`;
    let tasks = [];

    async function fetchTasks() {
      const response = await fetch(apiUrl);
      const data = await response.json();
      tasks = data || [];
      renderTasks();
    }

    async function addTask() {
      const titleInput = document.getElementById('title');
      const descriptionInput = document.getElementById('description');

      const newTask = {
        title: titleInput.value,
        description: descriptionInput.value,
        done: false,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      try {
        const createdTask = await response.json();
        tasks.push(createdTask);
        renderTasks();

        // Clear input fields
        titleInput.value = '';
        descriptionInput.value = '';
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }

    async function updateTask(id, updates) {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      try {
        const text = await response.text();
        const updatedTask = text ? JSON.parse(text) : {};

        const index = tasks.findIndex(task => task._id === id);

        if (index !== -1) {
          tasks[index] = updatedTask;
        }

        renderTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }

    async function completeTask(id, done) {
      const taskToComplete = tasks.find(task => task._id === id);

      if (taskToComplete) {
        await updateTask(id, { done, title: taskToComplete.title, description: taskToComplete.description });
        await fetchTasks();
      }
    }

    async function deleteTask(id) {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      tasks = tasks.filter(task => task._id !== id);
      renderTasks();
    }

    function renderTasks() {
      const incompleteTasksContainer = document.getElementById('incompleteTasks');
      const completedTasksContainer = document.getElementById('completedTasks');

      incompleteTasksContainer.innerHTML = '';
      completedTasksContainer.innerHTML = '';

      tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        const title = task.title || '';
        const description = task.description || '';

        taskElement.innerHTML = `
          <strong>${title}</strong>: ${description}
          <div class="actions">
            <button class="done" onclick="completeTask('${task._id}', ${!task.done})">&#10003;</button>
            <button class="undo" onclick="deleteTask('${task._id}')">&#10008;</button>
          </div>
        `;

        if (task.done) {
          taskElement.classList.add('completed-task');
          completedTasksContainer.appendChild(taskElement);
        } else {
          incompleteTasksContainer.appendChild(taskElement);
        }
      });
    }

    
    fetchTasks();