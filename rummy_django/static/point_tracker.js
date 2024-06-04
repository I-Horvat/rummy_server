require('dotenv').config();
const serverIp= process.env.SERVER_IP;
const serverPort= process.env.SERVER_PORT;
const serverUrl = `http://${serverIp}:${serverPort}`;

function addUser() {
    const name= document.getElementById('nameInput').value;
    const points=0
    console.log("hello")
    fetch(`${serverUrl}/add_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, points}),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.cookie = "name=" + name;
            renderUsers();
        })
}
function renderUsers() {

    console.log("rendering users")
    const pointsContainer = document.getElementById('pointsContainer');
    pointsContainer.textContent = '';
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';
    document.cookie = "name=" + document.getElementById('nameInput').value;

    fetch(`${serverUrl}/users/`)
        .then(response => response.json())
        .then(data => {
            console.log('users:', data);

            data.forEach(user => {
                console.log(user)
                const userElement = document.createElement('div');
                userElement.textContent = user.name + ' - ' + user.points;
                usersContainer.appendChild(userElement);
            });

        })
}

function uploadImage() {
    console.log("hello")
    const input = document.getElementById('fileInput');
    if (input.files && input.files[0]) {
        const formData = new FormData();
        formData.append('image', input.files[0]);
        console.log(document.cookie)
        const name = nameFromCookie();
        console.log(name)
        formData.append('name',  name);

        const uploadedImage = document.getElementById('uploadedImage');
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
        }
        reader.readAsDataURL(file);


        fetch(`${serverUrl}/upload/`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    const pointsContainer = document.getElementById('pointsContainer');
                    pointsContainer.textContent = 'Number of points: ' + data.points;
                    renderUsers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while uploading the image');
            });

    } else {
        alert('Please select an image first');
    }
}

function newGame() {
    fetch(`${serverUrl}/new_game/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            renderUsers();
        })
}

function nameFromCookie() {
    let cookies = document.cookie.split('; ');
    let name = '';

    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let [key, value] = cookie.split('=');
        if(key === 'name') {
            name = value;
            return name;
        }
    }
    return name;
}