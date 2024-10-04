document.addEventListener('DOMContentLoaded', () => {
    const tutor = localStorage.getItem('userId');
    
    const tutorList = document.getElementById('review-list');

            // Get All Feedback of a tutor
        const getAllFeedbackByTutor = async (tutor) => {
            fetch(`${API_BASE_URL}/feedback/${tutor}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    displayReviews(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        const displayReviews = (reviews) => {
            tutorList.innerHTML = '';
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review-card');
                reviewElement.innerHTML = `
                    <h2>Session no.${review.session}</h2>
                    <h3>${review.subject}</h3>
                    <p>${review.comment}</p>
                    <div class="stars"></div>
                `;
                const stars = document.createElement('div');
                stars.classList.add('stars');
                for(let i=0; i<review.rating; i++){
                    stars.innerHTML += '<span class="star filled">&#9733;</span>';
                    }
                for(let i=review.rating; i<5; i++){
                    stars.innerHTML += '<span class="star">&#9733;</span>';
                }
                reviewElement.appendChild(stars);
                tutorList.appendChild(reviewElement);
            });
        }

        getAllFeedbackByTutor(tutor);
})