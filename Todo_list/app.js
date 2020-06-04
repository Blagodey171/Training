(function () {
    const inputTitleTask = document.getElementById('title');
    const inputBodyTask = document.getElementById('body');
    const ul = document.getElementById('list')
    const form = document.forms.form;
    const objOfTask = {};

    const theme = {
        Dark: {
            '--bg_color_body': 'rgb(63, 63, 63)',
            '--bg_color_btn': 'rgb(185, 185, 185)',
            '--color_btn': 'rgb(54, 54, 54)',
            '--color_border_btn': 'rgb(124, 124, 194)',
            '--bg_color_containerNewTask':'rgb(185, 185, 185)',
            '--color_borderContainerNewTask': 'rgb(124, 124, 194)',
        },
        Light: {
            '--bg_color_body': 'rgb(206, 195, 209)',
            '--bg_color_btn': 'rgb(240, 224, 224)',
            '--color_btn': 'rgb(54, 54, 54)',
            '--color_border_btn': 'rgb(245, 140, 140)',
            '--bg_color_containerNewTask':'rgb(240, 224, 224)',
            '--color_borderContainerNewTask': 'rgb(245, 140, 140)',
        }
    }

    form.addEventListener('submit', handler)
    ul.addEventListener('click', handlerDeleteTask)


    function handler (e) {
        e.preventDefault();

        
        let titleValue = inputTitleTask.value;
        let bodyValue = inputBodyTask.value;

        if (!titleValue) {
            alert('Введите название вашей задачи')
            form.reset();
            return;
        } else if (!bodyValue) {
            alert('Введите описание задачи')
            form.reset();
            return;
        }
        
        const task = createNewTask(titleValue, bodyValue);
        const taskDom = createListItemOfTask(task)
        ul.prepend(taskDom)
        form.reset();
        
        console.log(objOfTask)
    }

    function createNewTask (title, body) {
        const newTask = {
            title,
            body,
            complited: false,
            _id: Math.random(),
        }
        
        objOfTask[newTask._id] = newTask;
        return newTask;
    }

    function createListItemOfTask ({title, body, _id} = {}) {
        const fragment = document.createDocumentFragment();
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const btn = document.createElement('button');

        h3.textContent = title;
        h3.classList.add('titleNewTask');


        p.textContent = body;
        p.classList.add('bodyNewTask');

        btn.textContent = 'Убрать задачу';
        btn.classList.add('buttonDeleteNewTask');

        li.classList.add('containerNewTask');
        li.setAttribute('data-task-id', _id);
        li.append(h3);
        li.append(p);
        li.append(btn);

        fragment.append(li);

        return fragment;
    }

    function handlerDeleteTask ({ target }) {
        if(target.classList.contains('buttonDeleteNewTask')) {
            let parent = target.closest('li');
            let id = parent.dataset.taskId;
            let confirmQuestion = confirm('Вы точно хотите удалить задачу?');

            deleteTask(id, parent, confirmQuestion);

            console.log(objOfTask);
        }
    };

    function deleteTask (idOfTask, parent, confirm) {
        if (!confirm) {
            return;
        } else 
        delete objOfTask[idOfTask];
        parent.remove();
    };
    

    // селекты для темы

    
    const select = document.getElementById('select')

    select.addEventListener('change', onThemeHandler);

    function onThemeHandler (e) {
        const selectedTheme = select.value;
        console.log(selectedTheme)
        const themeConfirm = confirm(`Применить тему ${selectedTheme}?`);

        if (!themeConfirm) return;
        setTheme(selectedTheme);
    }
    
    function setTheme (value) {
        const name = theme[value];
        console.log(name)
        Object.entries(name).forEach(([varName, varValue]) => {
            document.documentElement.style.setProperty(varName, varValue)
        });
    }
}) ()