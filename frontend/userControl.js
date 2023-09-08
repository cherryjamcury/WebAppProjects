document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.img__btn').addEventListener('click', function() {
        document.querySelector('.cont').classList.toggle('s--signup');
    });
});


async function sendDataToServer(data, url){
    try{
        const response = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(response.ok){
            alert('data sent to server');
            window.location.reload();

        }
        else{
            alert('Error sending data to server');
            const form = document.querySelector('.signIn-data');
            form.reset(); 
        }
        

    }
    catch(e){
        alert('Network error:'+ e);
    }
}
// When all fields are filled, and the password is correct, the submit button becomes enabled for clicking.
document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector('.signUp-data')
    form.querySelector('#user-password-repeat').addEventListener('input', function(){
        
        const password = form.querySelector('#user-password');
        const name = form.querySelector('#user-name');
        const email = form.querySelector('#user-email');
        const passwordRep = form.querySelector('#user-password-repeat');
        const button_signUp = document.getElementById("button-sign-up");
        const singUp_eror = form.querySelector("#span-sign-up");
        
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
        const form = document.querySelector('.signUp-data');
        const password = form.querySelector('#user-password');
        const name = form.querySelector('#user-name');
        const email = form.querySelector('#user-email');
      
        const data={
            'name':name.value,
            'email':email.value,
            'password':password.value
        }

        const url = '/signup-data'

        if(name.value && email.value && password.value){
            try{
               await sendDataToServer(data, url)
            }
            catch(e){
                alert(e)
            }
        }
    })

});
   


document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('button-sign-in').addEventListener('click', async function(){
        const form = document.querySelector('.signIn-data');
        const email = form.querySelector('#user-email');
        const password = form.querySelector('#user-password');

        if(email.value && password.value){
            const data={
                'email':email.value,
                'password':password.value
            }
            const url = '/signin-data'

            try{
                await sendDataToServer(data, url)
             }
             catch(e){
                 alert(e)
             }
        }
       



            
        
    })

});
   





