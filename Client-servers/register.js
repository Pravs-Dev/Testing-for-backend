const API_BASE_URL = 'https://finalbackend2099.azurewebsites.net/api';


document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Get the form values
            const role = document.getElementById('role').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Initialize fname and lname to empty strings
            let fname = '';
            let lname = '';

            // Check which name fields to get
            if (role === 'student') {
                fname = document.getElementById('student-fname').value;
                lname = document.getElementById('student-lname').value;
            } else if (role === 'tutor') {
                fname = document.getElementById('tutor-fname').value;
                lname = document.getElementById('tutor-lname').value;
            }

            const profilePicture = document.getElementById('profilePicture') ? document.getElementById('profilePicture').files[0] : null;


            // Validate the form fields
            if (!role || !email || !password || !fname || !lname) {
                alert('Please fill in all the required fields.');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('role', role);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('fname', fname);
            formData.append('lname', lname);

            // Add role-specific fields
            if (role === 'student') {
                const courses = document.querySelectorAll('#courses-group input[type="text"]');
                courses.forEach(course => {
                    if (course.value) {
                        formData.append('courses[]', course.value);
                    }
                });
            } else if (role === 'tutor') {
                const subjects = document.querySelectorAll('#subjects-group input[type="text"]');
                subjects.forEach(subject => {
                    if (subject.value) {
                        formData.append('subjects[]', subject.value);
                    }
                });

                const qualifications = document.querySelectorAll('#qualification-group input[type="text"]');
                qualifications.forEach(qualification => {
                    if (qualification.value) {
                        formData.append('qualifications[]', qualification.value);
                    }
                });
            }

            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("error-msg").innerHTML=`Loading...`;
                    document.getElementById("error-msg").style.color = 'white'; 
                    window.location.href = './login.html'; // Redirect to the login page after registration
                } else {
                    const errorData = await response.json();
                    document.getElementById("error-msg").innerHTML=`An error occurred while registering.`;
                }
            } catch (error) {
                console.error('Error registering:', error);
                document.getElementById("error-msg").innerHTML=`An error occurred while registering.`;
            }
        });
    }

    // Profile picture preview functionality
    const profilePictureInput = document.getElementById('profilePicture');
    const profilePicturePreview = document.getElementById('profilePicturePreview');

    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePicturePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                profilePicturePreview.src = ''; // Clear the preview if no file is selected
            }
        });
    }
});
