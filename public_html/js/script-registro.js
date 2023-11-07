document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Obtener los valores de los campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Validar que los campos no estén vacíos
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // Validar que la contraseña coincida con la confirmación de contraseña
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
      return;
    }
  
    // Mostrar un mensaje de éxito
    alert('¡Registro exitoso!\nNombre: ' + name + '\nCorreo electrónico: ' + email);
  });
  
  