
// document.querySelector('.img__btn').addEventListener('click', function() {
//     document.querySelector('.cont').classList.toggle('s--signup');
// });


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.img__btn').addEventListener('click', function() {
        document.querySelector('.cont').classList.toggle('s--signup');
    });
});


//send  data to server function 
async function sendDataToServer(name, email, password){
    try{
        const response = await fetch('/signup-data',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });

        if(response.ok){
            alert('data sent to server');
            window.location.reload();

        }
        else{
            alert('Error sending data to server');
            const form = document.querySelector('.signUp-data');
            form.reset(); 
        }
        

    }
    catch(e){
        alert('Network error:'+ e);
    }
}
// When all fields are filled, and the password is correct, the submit button becomes enabled for clicking.
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('user-password-repeat').addEventListener('input', function(){
        const password = document.getElementById('user-password');
        const name = document.getElementById('user-name');
        const email = document.getElementById('user-email');
        const passwordRep = document.getElementById('user-password-repeat');
        const button_signUp = document.getElementById("button-sign-up");
        const singUp_eror = document.getElementById("span-sign-up");
        
        
        if(password.value && name.value && email.value){
            if(password.value == passwordRep.value){
                button_signUp.disabled = false;
                singUp_eror.style.color='#cfcfcf';
            }

            else{
                button_signUp.disabled = true;
                singUp_eror.style.color='red';
            }
        }
        else{
            singUp_eror.style.color='#cfcfcf'; 
        }
    })
});

// When the button becomes enabled for clicking  call send function 
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('button-sign-up').addEventListener('click', async function(){
        const password = document.getElementById('user-password');
        const name = document.getElementById('user-name');
        const email = document.getElementById('user-email');
        if(name.value && email.value && password.value){
            try{
                await sendDataToServer(name.value, email.value, password.value);

            }
            catch(e){
                alert(e)
            }
        }
    })

});
   












// frontend/script.js
// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('myForm');

//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
//         const formData = new FormData(form); 
        
//         fetch('/submit', {
//             method: 'POST',
//             body: formData
//         }).then(response => response.json())
        
//         .then(data => {
//             console.log('Response from server:', data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });

// });


