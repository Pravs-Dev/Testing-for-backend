document.addEventListener('DOMContentLoaded', () => {
    const tutor = localStorage.getItem('userId');
    
    const availabilityList = document.getElementById('availability-list');

            // Get All Feedback of a tutor
            const getAvailabilityByTutor = async (tutor) => {
                fetch(`${API_BASE_URL}/availability/${tutor}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        displayAvailabilitys(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }

        const displayAvailabilitys = (availability) => {
            availabilityList.innerHTML = `
                    <h3>Change this month's availability</h3>`;
                const availabilityElement = document.createElement('form');
                availabilityElement.classList.add('availability-card');
                availabilityElement.innerHTML = ``;
                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let daysLeft = availabileDays();
                for(let i=0; i<daysLeft.length; i++) {
                    if(days[daysLeft[i]] != 'Sunday' && days[daysLeft[i]] != 'Saturday'){
                        const avail = document.createElement('div');
                        avail.classList.add('avail');
                        avail.innerHTML = `
                            <label id="day">Day:${days[daysLeft[i]]}</label>
                        `;
                        for(let j=0; j<3;j++){
                            const slotElement = document.createElement('div');
                            slotElement.classList.add('slot');
                            slotElement.innerHTML += `
                            <label for="start">Slot:${j+1}</label>
                            <input type="time" id="start${days[daysLeft[i]] + j}" name="start" >
                            <span>To</span>
                            <input type="time" id="end${days[daysLeft[i]] + j}" name="end" >
                            `;
                            avail.appendChild(slotElement);
                        }  
                        availabilityElement.appendChild(avail);
                    }
                }
                
                availabilityElement.innerHTML += `
                <button class="edit-btn" type="submit">Save Changes</button>
                `
                availabilityList.appendChild(availabilityElement);

                if(availability.length != 0){
                    //display times
                    (availability[0].availability).forEach(av => {
                        if(av.date != 'Sunday' && av.date != 'Saturday'){
                            let slotnum = 0;
                            (av.slots).forEach(slot => {
                                    document.getElementById(`start${av.date}${slotnum}`).value = slot.start;
                                    document.getElementById(`end${av.date}${slotnum}`).value = slot.end;
                                slotnum++;
                            });
                        }
                    });
                    
                }

                availabilityElement.addEventListener('submit', async function (event) {
                    event.preventDefault();
                    let id = availability._id;
                    //get details from form
                    let Navailability = [];
                    let avails = (availabilityElement).querySelectorAll('.avail');
                    for(let i=0; i<avails.length; i++){
                        let date = (((avails[i]).querySelector('#day')).textContent).split(':')[1];
                        let slots = [];
                        let slotElements = (avails[i]).querySelectorAll('.slot');
                        for(let j=0; j<slotElements.length; j++){
                            let start = ((slotElements[j]).querySelector(`#start${date}${j}`)).value;
                            let end = ((slotElements[j]).querySelector(`#end${date}${j}`)).value;
                            slots.push({start: start, end: end});
                        }
                        Navailability.push({date: date, slots: slots});
                    }

                    if(availability.length !=0){
                        
                    const availData = {
                        availability: Navailability,
                    }
                        await fetch(`${API_BASE_URL}/availability/${availability[0]._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(availData)
                        })
                            .then(response => response.json())
                            .then(data => {
                                //console.log(data);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                confirm(error);
                            });
                    
                            //reload the page
                            location.reload();
                    }
                    else{
                        
                    const availData = {
                        user: tutor,
                        availability: Navailability,
                    }
                        await fetch(`${API_BASE_URL}/availability`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(availData)
                        })
                            .then(response => response.json())
                            .then(data => {
                                //console.log(data);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                confirm(error);
                            });

                            //reload the page
                            location.reload();
                    }
                });

            
            
        }


        getAvailabilityByTutor(tutor);

        
        
});



function availabileDays(){
    let days = [];
    //Get the number of days left this month
    let today = new Date();
    let daysLeft = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate() - today.getDate();
    for(let i=0; i<7 && i<daysLeft;i++){
        days.push((today.getDay() + i)%7);
    }
    return days.sort();

}