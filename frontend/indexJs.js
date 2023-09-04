// frontend/script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form); 
        
        fetch('/submit', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        
        .then(data => {
            console.log('Response from server:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

});
