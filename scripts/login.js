document.getElementById('login-form').addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    try {
        
        const response = await fetch(`https://reqres.in/api/login`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        console.log(data)

        if(response.ok){
            localStorage.setItem('token',data.token);
            window.location.href = 'admin.html';
        }
        else{
            throw new Error(data.error);
        }

    } catch (e) {
        console.log(e.message);
        errorMsg.textContent = e.message;

    }
});