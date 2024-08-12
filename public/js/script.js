var pass = document.getElementById('password');
var show = document.querySelector('.Show');

let passVal = false;
show.addEventListener('click', function () {
    if (!passVal) {
        show.classList.remove('ri-eye-fill');
        show.classList.add('ri-eye-off-fill');
        passVal = true;
        pass.type = 'text';
    }
    else {
        show.classList.add('ri-eye-fill');
        show.classList.remove('ri-eye-off-fill');
        passVal = false;
        pass.type = 'password';
    }
})