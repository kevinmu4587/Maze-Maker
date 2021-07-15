// console.log("welcome to load maze");
// let ids = {};
// // request the ids from the backend
// fetch('get_ids',
//     {
//     method: 'GET',
//     mode: 'cors',
//     headers: {
//         'Content-Type': 'application/json'
//     },
// }).then((response) => {
//     if (response.ok) {
//         return response.json();
//     }
// })
// .then((data) => {
//     if (data) {
//         ids = JSON.stringify(data);
//     }
// });

//console.log("ids are " + ids);
document.querySelector('#first').innerHTML = 'Maze 1';
document.querySelector('#second').innerHTML = 'Maze 2';
document.querySelector('#third').innerHTML = 'Maze 3';
document.querySelector('#fourth').innerHTML = 'Maze 4';
document.querySelector('#fifth').innerHTML = 'Maze 5';


function getMaze(which) {
    console.log("we be getting a maze now." + which);
    url = '/getmaze';
    fetch(url,
        {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": 40 
        })
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        if (data) {
            console.log("we got back: " + JSON.stringify(data));
        }
    });
}