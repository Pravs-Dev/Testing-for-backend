document.addEventListener('DOMContentLoaded', async () => {
    const profileNameElement = document.getElementById('profile-name');
    const profileForm = document.getElementById('profile-form');
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profilePictureElement = document.getElementById('profile-picture');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        console.error('No token or user ID found, redirect to login');
        window.location.href = './login.html'; // Redirect if not logged in
        return;
    }

    // Fetch user data and populate profile fields
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            const { fname, lname, email, role, qualifications, subjects } = user;

            profileNameElement.textContent = `${fname} ${lname}`;
            document.getElementById('fname').value = fname;
            document.getElementById('lname').value = lname;
            document.getElementById('email').value = email;
            document.getElementById('role').value = role;
            document.getElementById('subjects').value = subjects || '';
            document.getElementById('qualification').value = qualifications || '';

            const currSubjectsUL = document.getElementById('current-subjects-list');
            currSubjectsUL.innerHTML = ''; // Clear existing list items, if any

            console.log('Profile data loaded:', { fname, lname, email, role, subjects, qualifications });

            if (subjects && subjects.length > 0) {
                let subjectsData = Array.isArray(subjects) ? subjects : [subjects];

                subjectsData.forEach((subjectData) => {
                    let subjectList = typeof subjectData === 'string' ? subjectData.split(", ") : subjectData;

                    subjectList.forEach((subject) => {
                        const listItem = document.createElement('li');
                        listItem.style.listStyleType = 'none';
                        listItem.style.textAlign = 'left';
                        listItem.textContent = subject;
                        currSubjectsUL.appendChild(listItem);
                    });
                });
            } else {
                console.log('No subjects available');
                const listItem = document.createElement('li');
                listItem.textContent = 'No subjects available';
                listItem.style.listStyleType = 'none';
                currSubjectsUL.appendChild(listItem);
            }
        } else {
            console.error('Failed to fetch user data');
            window.location.href = './login.html'; // Redirect if fetch fails
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    // File input and preview
    profilePictureElement.addEventListener('click', () => {
        profilePictureUpload.click();
        console.log('Profile picture upload clicked');
    });

    profilePictureUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePictureElement.src = e.target.result;
                console.log('Profile picture changed:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });

    // Update profile form with FormData
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value; // Optional field
        const subjects = document.getElementById('subjects').value;
        const qualifications = document.getElementById('qualification').value;
        const profilePictureFile = profilePictureUpload.files[0];

        // Prepare form data
        const formData = new FormData();
        formData.append('fname', fname);
        formData.append('lname', lname);
        formData.append('email', email);
        formData.append('password', password); // Optional
        formData.append('subjects', subjects);
        formData.append('qualification', qualifications);

        if (profilePictureFile) {
            formData.append('profilePicture', profilePictureFile); // Append profile picture if uploaded
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData, // Use formData instead of JSON
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile updated',
                    text: 'Profile updated successfully!',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff',
                    timer: 5000, // Auto-close after 5 seconds
                    timerProgressBar: true, // Progress bar for auto-close
                });
                console.log('Profile updated successfully');
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Profile update failed',
                    text: 'Error updating profile',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007bff',
                    timer: 5000,
                    timerProgressBar: true,
                });
                console.error('Error updating profile:', errorData);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    });
});

// Delete profile logic
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        console.error('User ID or token is missing. User must be logged in to delete their profile.');
        return;
    }

    const deleteProfileButton = document.getElementById('delete-profile');

    if (deleteProfileButton) {
        deleteProfileButton.addEventListener('click', async () => {
            const confirmDelete = await Swal.fire({
                title: 'Are you sure?',
                text: "This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            });

            if (confirmDelete.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Profile deleted',
                            text: 'Your profile has been deleted successfully!',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#007bff',
                        });
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.href = './login.html';
                    } else {
                        const errorData = await response.json();
                        Swal.fire({
                            icon: 'error',
                            title: 'Deletion failed',
                            text: errorData.message || 'There was an error deleting your profile.',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#007bff',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting profile:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while deleting the profile.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#007bff',
                    });
                }
            }
        });
    } else {
        console.error('Delete profile button not found.');
    }
});
