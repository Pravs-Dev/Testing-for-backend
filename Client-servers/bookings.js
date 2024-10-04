// Handle cancellation reason visibility based on status
document.getElementById('status').addEventListener('change', function() {
    const status = this.value;
    const cancellationReasonContainer = document.getElementById('cancellationReasonContainer');
    if (status === 'Cancelled') {
        cancellationReasonContainer.style.display = 'block';
        document.getElementById('cancellationReason').setAttribute('required', 'true');
    } else {
        cancellationReasonContainer.style.display = 'none';
        document.getElementById('cancellationReason').removeAttribute('required');
    }
});

// Function to fetch tutors from the database
const fetchTutors = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${url}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        return [];
    }
};

// Render available tutors into the select dropdown
const renderAvailableTutors = (tutors) => {
    const tutorsSelect = document.getElementById('tutor');
    tutorsSelect.innerHTML = ''; // Clear previous options

    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = 'Select a Tutor';
    placeholderOption.value = '';
    tutorsSelect.appendChild(placeholderOption);

    tutors.forEach(tutor => {
        const tutorOption = document.createElement('option');
        tutorOption.textContent = tutor.fname;
        tutorOption.value = tutor._id; 
        tutorsSelect.appendChild(tutorOption);
    });
};

// Load tutors and set the selected tutor from localStorage
// Load tutors and set the selected tutor and the first subject from localStorage
const loadTutors = async () => {
    const availableTutors = await fetchTutors(`${API_BASE_URL}/users`);
    const tutorsOnly = availableTutors.filter(user => user.role === 'tutor');
    renderAvailableTutors(tutorsOnly);

    // Get the selected tutor from localStorage
    const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));

    if (selectedTutor) {
        const tutorSelect = document.getElementById('tutor');
        for (let option of tutorSelect.options) {
            if (option.value === selectedTutor._id) {
                option.selected = true; // Set the correct option as selected
                break;
            }
        }

        // Populate the subject dropdown with the selected tutor's subjects
        const subjectSelect = document.getElementById('subject');
        subjectSelect.innerHTML = ''; // Clear previous options

        const placeholderOption = document.createElement('option');
        placeholderOption.textContent = 'Select a Subject ';
        placeholderOption.value = '';
        subjectSelect.appendChild(placeholderOption);

        selectedTutor.subjects.forEach((subject, index) => {
            const subjectOption = document.createElement('option');
            subjectOption.textContent = subject; // Assuming the subjects are strings
            subjectOption.value = subject; 
            subjectSelect.appendChild(subjectOption);

            // Preselect the first subject
            if (index === 0) {
                subjectOption.selected = true; // Set the first subject as selected
            }
        });
    }
};



document.getElementById('tutor').addEventListener('change', async function () {
    const selectedTutorId = this.value;
    const availableTutors = await fetchTutors(`${API_BASE_URL}/users`);
    const selectedTutor = availableTutors.find(user => user._id === selectedTutorId);

    const subjectSelect = document.getElementById('subject');
    subjectSelect.innerHTML = ''; // Clear previous options

    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = 'Select a Subject ';
    placeholderOption.value = '';
    subjectSelect.appendChild(placeholderOption);

    if (selectedTutor) {
        selectedTutor.subjects.forEach(subject => {
            const subjectOption = document.createElement('option');
            subjectOption.textContent = subject; // Assuming the subjects are strings
            subjectOption.value = subject;
            subjectSelect.appendChild(subjectOption);
        });
    }
});

function askToCheckBusSchedule() {
    Swal.fire({
        title: 'Want to Check the Bus Schedule?',
        text: 'Would you like to see the bus schedule for your area?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#007bff',
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to the bus schedule page
            window.location.href = './bus-schedule.html';
        }
    });
}

// Handle form submission for booking
document.addEventListener('DOMContentLoaded', async () => {
    // Load tutors on page load
    await loadTutors();

    const bookingForm = document.getElementById('bookingForm');

    bookingForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const student = localStorage.getItem('userId'); 
        const tutor = document.getElementById('tutor').value;
        const subject = document.getElementById('subject').value;
        const sessionDate = document.getElementById('sessionDate').value;
        const sessionTime = document.getElementById('sessionTime').value;
        const duration = document.getElementById('duration').value;
        const status = document.getElementById('status').value;
        const meetingType = document.getElementById('meetingtype').value;

        // Prepare booking data to match the format expected by the database
        const bookingData = {
            student: student,
            tutor: tutor,
            subject: subject,
            sessionDate: sessionDate,
            sessionTime: sessionTime,
            duration: parseInt(duration) * 60, // Convert duration to seconds
            status: status,
            meetingType: meetingType
        };

        try {
            // Send POST request to the booking API
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                const responseData = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Created',
                    text: 'Your booking was created successfully!',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff',
                    timer: 5000, // Auto-close after 3 seconds (optional)
                    timerProgressBar: true, // Progress bar for auto-close (optional)
                }).then((result) => {
                    // After the user clicks 'OK', show the next prompt
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        askToCheckBusSchedule();
                    }
                });          
                console.log('Booking data:', responseData);
                bookingForm.reset();
                localStorage.removeItem('bookingTutor');
                localStorage.removeItem('selectedSubject');
                localStorage.removeItem('selectedTutor');
            } else {
                const errorData = await response.json();
                alert('Error creating booking: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('An error occurred while creating the booking.');
        }
    });
});
