document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = './login.html';
    } else {
        fetchTutors();

        // Attach event listener to the search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', filterTSections);
    }
});

async function fetchTutors() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Filter tutors based on role
            const tutors = data.filter(user => user.role === 'tutor');

            // Display the tutors
            displayTutors(tutors, token);
        } else {
            console.error('Failed to fetch tutors');
        }
    } catch (error) {
        console.error('Error fetching tutors:', error);
    }
}

async function displayTutors(tutors, token) {
    const tutorList = document.getElementById('tutor-list');
    const defaultProfilePicture = './Icons/profile2.jpg'; // Path to the default profile picture

    for (const tutor of tutors) {
        const tutorElement = document.createElement('div');
        tutorElement.className = 'tutor-card';

        let profilePicture = defaultProfilePicture;

        // Attempt to fetch the tutor's profile picture
        try {
            const imageResponse = await fetch(`${API_BASE_URL}/users/${tutor._id}/profile-picture`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                profilePicture = URL.createObjectURL(blob); // Create a URL from the blob
            }
        } catch (error) {
            console.error(`Error fetching profile picture for ${tutor.fname} ${tutor.lname}:`, error);
        }

        // Render tutor details
        tutorElement.innerHTML = `
            <img src="${profilePicture}" alt="${tutor.fname} ${tutor.lname}" class="tutor-image">
            <div class="tutor-details">
                <h3>${tutor.fname} ${tutor.lname}</h3>
                <p>${tutor.email}</p>
                <p><strong>Subjects:</strong> ${tutor.subjects.join(', ')}</p>
                <p><strong>Qualifications:</strong> ${tutor.qualifications.join(', ')}</p>
            </div>
        `;

        // Add click event listener to open the tutor profile page
        tutorElement.addEventListener('click', () => {
            // Save selected tutor data to localStorage
            localStorage.setItem('selectedTutor', JSON.stringify(tutor));

            // Navigate to the tutor profile page
            window.location.href = './TutorDetails.html';
        });

        tutorList.appendChild(tutorElement);
    }
}

function filterTSections() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tutorCards = document.getElementsByClassName('tutor-card'); // Update to target tutor cards

    for (let i = 0; i < tutorCards.length; i++) {
        const tutorName = tutorCards[i].querySelector('h3').innerText.toLowerCase();
        const tutorEmail = tutorCards[i].querySelector('p').innerText.toLowerCase(); // Adjust index if necessary
        const tutorSubjects = tutorCards[i].querySelectorAll('p')[1].innerText.toLowerCase(); // Adjust index if necessary
        const tutorQualifications = tutorCards[i].querySelectorAll('p')[2].innerText.toLowerCase(); // Adjust index if necessary

        // Check if any of the tutor details match the input
        tutorCards[i].style.display = (
            tutorName.includes(input) ||
            tutorEmail.includes(input) ||
            tutorSubjects.includes(input) ||
            tutorQualifications.includes(input)
        ) ? '' : 'none'; // Show/hide the card
    }
}


// TutorDetails.js
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));
    // Populate tutor details on the profile page
    document.getElementById('profile-name').textContent = `${selectedTutor.fname} ${selectedTutor.lname}`;
     document.getElementById('profile-email').innerHTML = `${selectedTutor.email}`;
    document.getElementById('profile-subjects').innerHTML = `<strong>Subjects:</strong> ${selectedTutor.subjects.join(', ')}`;
    document.getElementById('profile-qualifications').innerHTML = `<strong>Qualifications:</strong> ${selectedTutor.qualifications.join(', ')}`;
    document.getElementById('profile-about').textContent = selectedTutor.about || 'No details available.';

    // Fetch and display tutor's profile picture
    const profilePictureElement = document.getElementById('profile-picture');
    const defaultProfilePicture = './Icons/profile2.jpg';

    try {
        const imageResponse = await fetch(`${API_BASE_URL}/users/${selectedTutor._id}/profile-picture`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            profilePictureElement.src = URL.createObjectURL(blob);
        } else {
            profilePictureElement.src = defaultProfilePicture;
        }
    } catch (error) {
        console.error('Error fetching tutor profile picture:', error);
        profilePictureElement.src = defaultProfilePicture;
    }

    // Add event listener to the "Book a Session" button
    document.getElementById('book-session').addEventListener('click', () => {
        // Save selected tutor name and subject to localStorage
        localStorage.setItem('selectedTutor', JSON.stringify(selectedTutor));
        localStorage.setItem('selectedSubject', selectedTutor.subjects[0]); // Assuming you want the first subject
    
        // Navigate to booking page
        window.location.href = './bookings.html';
    });
});
