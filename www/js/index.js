document.addEventListener('deviceready', onDeviceReady, false);



function showPostsPage() {
    document.getElementById('loginPage').style.display = "none";
    document.getElementById('postsPage').style.display = "block";
    document.getElementsByClassName('report-container')[0].style.display = "block";
    document.getElementById('incidentList').style.display = "none";
   


    if (document.getElementsByClassName('see-all-posts').length == 0) {
        // Create the "See All Incidents" button
        const seeAllPostsButton = document.createElement('button');
        // seeAllIncidentsButton.textContent = 'See All Incidents';
        seeAllPostsButton.textContent = 'See All Posts';

        seeAllPostsButton.className = 'see-all-posts';
        seeAllPostsButton.onclick = seeAllPosts;
        document.getElementById('postsPage').appendChild(seeAllPostsButton);

    } else {
        document.getElementsByClassName('see-all-posts').style.display = "block";

    }
}


function seeAllPosts() {
    fetchIncidents();

    // alert("See All Incidents button clicked!");
}



function onDeviceReady() {
    // fetchIncidents();
}
function userLogin() {
    const userName = document.getElementById('username').value;
    const userPassWord = document.getElementById('password').value;


    const loginUser = {
        username: userName,
        password: userPassWord
    }


    fetch('https://incidence-solutionapp.000webhostapp.com/wp-json/jwt-auth/v1/token', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser),

    }).then(response => response.json())
        .then(data => {
            if (data.token != undefined || data.token != null) {
                localStorage.setItem("userToken", data.token);
                seeAllPosts();
            }
            else {
                alert(data.message);
                return;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in');
        });

}


function submitIncident() {
    const incidentType = document.getElementById('incidentType').value;
    const description = document.getElementById('description').value;


    const incidentData = {
        content: description,
        title: incidentType,
        excerpt: 'publish',
        status: 'publish'
        
    };
    const token = localStorage.getItem('userToken');

    fetch('https://incidence-solutionapp.000webhostapp.com/wp-json/wp/v2/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(incidentData),
        // body: incidentData,
    })
        .then(response => {
            if (!response.ok) {
                swal('An error occured while processing your request');

                // throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            swal('You have successfully reported an incident');
            fetchIncidents();

        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the incident report.');
        });
}

function fetchIncidents() {
    fetch('https://incidence-solutionapp.000webhostapp.com/wp-json/wp/v2/posts')
        .then(response => {
            if (!response.ok) {
                // console.log('the list of incident data returned', response);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log('the list of incident data returned', response);
            return response.json();
        })
        .then(data => {
            console.log('the list of incident data returned', data);
            displayIncidents(data);
        })
        .catch(error => {
            console.error('Error fetching incidents:', error.message);
            alert('An error occurred while fetching incidents.');
        });
}


function displayIncidents(incidents) {
    const incidentListElement = document.getElementById('incidentList');
    incidentListElement.innerHTML = '';



    document.getElementById("postsPage").style.display = "block";
    document.getElementById("incidentList").style.display = "block";
    document.getElementsByClassName("report-container")[0].style.display = "none";
    document.getElementById("loginPage").style.display = "none";


    const reportBtn = document.getElementsByClassName('report-button');
    if (reportBtn.length == 0) {
        // Create the "Report an Incident" button
        const reportButton = document.createElement('button');
        reportButton.textContent = 'Report an Incident';
        reportButton.onclick = showPostsPage;
        reportButton.className = 'report-button';

        document.getElementById('postsPage').appendChild(reportButton);


    } else {
        document.getElementsByClassName('report-button').style.display = "block";

    }




    if (document.getElementsByClassName('see-all-incidents').length > 0)
        document.getElementsByClassName('see-all-incidents').style.display = "none";

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';



    incidents.forEach(incident => {

        // listItem.innerHTML = `<strong>${incident.title.rendered}</strong> - ${incident.content.rendered}`;
        const listItem = document.createElement("div");
        listItem.className = "card";

        listItem.innerHTML =
            `<h2>${incident.title.rendered}</h2>
        <p>${incident.content.rendered}</p>`
        cardContainer.appendChild(listItem);

        
    });

    incidentListElement.appendChild(cardContainer);
}


