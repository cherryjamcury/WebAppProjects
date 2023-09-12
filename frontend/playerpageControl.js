
const avatarOptions = document.querySelectorAll('.avatar-option');

avatarOptions.forEach(option => {
    option.addEventListener('click', function() {
        avatarOptions.forEach(option => option.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('selectedAvatar').value = this.src;
    });
});
