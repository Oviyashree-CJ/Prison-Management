function login() {
    const password = document.getElementById('password').value;
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
        } else {
            alert('Invalid password!');
        }
    });
}

function fetchQuery(queryId) {
    fetch(`http://localhost:3001/query/${queryId}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = "";
            if (Array.isArray(data)) {
                const table = document.createElement('table');
                const headerRow = document.createElement('tr');
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.innerText = key;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
                data.forEach(row => {
                    const rowElement = document.createElement('tr');
                    Object.values(row).forEach(value => {
                        const td = document.createElement('td');
                        td.innerText = value;
                        rowElement.appendChild(td);
                    });
                    table.appendChild(rowElement);
                });
                resultsContainer.appendChild(table);
            }
        });
}

function showForm(action) {
    // Clear and set the form for insert/update/delete
    const formSection = document.getElementById('form-section');
    formSection.style.display = 'block';
    const form = document.getElementById('crud-form');
    const title = document.getElementById('form-title');
    const formFields = document.getElementById('form-fields');
    
    formFields.innerHTML = ''; // Clear any previous form fields
    
    title.innerText = action.charAt(0).toUpperCase() + action.slice(1) + ' Record';
    
    // Example: Based on action, generate relevant input fields
    const fields = ['Name', 'Age', 'Crime']; // Simple example
    fields.forEach(field => {
        const label = document.createElement('label');
        label.innerText = field;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = field.toLowerCase();
        formFields.appendChild(label);
        formFields.appendChild(input);
        formFields.appendChild(document.createElement('br'));
    });
}

function submitForm() {
    // Gather form data and submit it
    const formData = new FormData(document.getElementById('crud-form'));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    const action = document.getElementById('form-title').innerText.toLowerCase();
    const table = 'prisoners'; // Example table
    
    fetch(`http://localhost:3001/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data })
    })
    .then(response => response.json())
    .then(responseData => {
        alert('Operation successful');
        document.getElementById('form-section').style.display = 'none';
    })
    .catch(error => {
        alert('Operation failed');
    });
}
