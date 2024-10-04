document.addEventListener('DOMContentLoaded', () => {
    const tutor = localStorage.getItem('userId');
    
    const pendingSessions = document.getElementById('pending-list');
    const upcomingSessions = document.getElementById('confirmed-list');
    const completedSessions = document.getElementById('completed-list');
    const cancelledSessions = document.getElementById('cancelled-list');

            // Get All Feedback of a tutor
        const getAllSessionsByTutor = async (tutor) => {
            fetch(`${API_BASE_URL}/bookings/tutor/${tutor}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    displaySessions(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        const displaySessions = (sessions) => {
            sessions.forEach(session => {
                const sessionsElement = document.createElement('form');
                sessionsElement.classList.add('session-highlighted');
                sessionsElement.innerHTML = `
                    <h3>Session:${session._id}</h3>
                    <lable for="sessionDate">Date: </lable>
                    <input id="sessionDate" class="date" type="date" value="${(session.sessionDate).slice(0, 10)}"></input>
                    <div class="info">
                        <h4>${session.subject}</h4>
                        <lable for="sessionTime">Time: </lable>
                        <input id="sessionTime" type="time" value="${session.sessionTime}"></input>
                        <p>Student: ${session.student.fname + ' ' + session.student.lname}</p>
                        <p>Session Type: ${session.meetingType}</p>
                    </div>
                    
                    
                `;
                    if(session.status == "Scheduled" && pendingSessions){
                        sessionsElement.innerHTML += `<button class="confirm-btn" onclick="confirmBooking(this)">Confirm</button>`;
                        sessionsElement.innerHTML += `<button class="modify-btn" onclick="modifyBooking(this)">Modify</button>`;
                        pendingSessions.appendChild(sessionsElement);
                    }
                    else if(session.status == "Confirmed" && upcomingSessions){
                        sessionsElement.innerHTML += `<input id="reason${session._id}" >`;
                        sessionsElement.innerHTML += `<button class="confirm-btn" onclick="cancelBooking(this)">Cancel</button>`;
                        sessionsElement.innerHTML += `<button class="modify-btn" onclick="modifyBooking(this)">Modify</button>`;
                        sessionsElement.innerHTML += `<button class="complete-btn" onclick="completeBooking(this)">Complete</button>`;
                        upcomingSessions.appendChild(sessionsElement);
                    }
                    else if(session.status == "Completed" && completedSessions){
                        sessionsElement.innerHTML += `<button class="delete-btn" onclick="deleteBooking(this)">Delete</button>`;
                        completedSessions.appendChild(sessionsElement);
                    }
                    else if(session.status == "Cancelled" && cancelledSessions){
                        sessionsElement.innerHTML += `<p>Cancellation Reason: ${session.cancellationReason}</p>`;
                        sessionsElement.innerHTML += `<button class="delete-btn" onclick="deleteBooking(this)">Delete</button>`;
                        cancelledSessions.appendChild(sessionsElement);
                    }

                    else if (sessions.meetingType== "Online" && session.status == "Confirmed"){
                        sessionsElement.innerHTML += `<button class="confirmed" onclick="vertuallink()">SendVirtuallink</button>`;
                        sessionsElement.innerHTML += `<button class="modify-btn" onclick="modifyBooking(this)">Modify</button>`;
                    }
            });
        }

        getAllSessionsByTutor(tutor);
});

function completeBooking(button) {
    let id = button.parentElement.querySelector('h3').textContent.split(':')[1];
    
    fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Completed' })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Optionally, reload the page to update the session list
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function modifyBooking(button) {
    let id = button.parentElement.querySelector('h3').textContent.split(':')[1];
    let newDate = button.parentElement.querySelector('#sessionDate').value;
    let newTime = button.parentElement.querySelector('#sessionTime').value;
    
    fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionDate: newDate, sessionTime: newTime })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Optional: Show a success message or reload the page to see the changes
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function confirmBooking(button) {
    let id = button.parentElement.querySelector('h3').textContent.split(':')[1];
    fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Confirmed' })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        //reload the page
        location.reload();
}

function deleteBooking(button) {
    let id = button.parentElement.querySelector('h3').textContent.split(':')[1];
    fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        //reload the page
        location.reload();
}

function cancelBooking(button) {
    let id = button.parentElement.querySelector('h3').textContent.split(':')[1];
    let reason = button.parentElement.querySelector(`#reason${id}`).value;
    fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Cancelled', cancellationReason: reason })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        //reload the page
        location.reload();
}