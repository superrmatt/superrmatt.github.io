var clipboard = new Clipboard('.copy');
var lowercase = "abcdefghijklmnopqrstuvwxyz",
  uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  nums = "0123456789",
  specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=",
  lowercaseInput = document.getElementById("lowercase"),
  uppercaseInput = document.getElementById("uppercase"),
  specialInput = document.getElementById("punctuation"),
  numsInput = document.getElementById("numbers"),
  lengthInput = document.getElementById("length"),
  passwordFeild = document.getElementById("pass-field"),
  generateButton = document.getElementById("generate"),
  copyButton = document.getElementById("copy"),
  plength,
  password,
  passwordCharSet;
 
function generatePassword() {
    password = "";
    passwordCharSet = "";

    if (lowercaseInput.checked) {
        passwordCharSet += lowercase;
    }
    if (uppercaseInput.checked) {
        passwordCharSet += uppercase;
    }
    if (specialInput.checked) {
        passwordCharSet += specialChars;
    }
    if (numsInput.checked) {
        passwordCharSet += nums;
    }

    plength = Number(lengthInput.value);

    for (let i = 0; i < plength; i++) {
        password += passwordCharSet.charAt(Math.floor(Math.random() * passwordCharSet.length));
    }

    if (password == "") {
        let alertbox = document.getElementById('alert');
        alertbox.innerHTML = "Please select an option before generating"
        alertbox.classList.add('fail');
        setTimeout(function(){ 
            alertbox.classList.remove('fail');
        }, 3000);
    } else {
        passwordFeild.innerHTML = password;
    }

    copyButton.setAttribute("data-clipboard-text", password)
}


generateButton.addEventListener("click", generatePassword);
 
clipboard.on('success', function(e) {

    let alertbox = document.getElementById('alert');
    alertbox.innerHTML = "Copy successful"
    alertbox.classList.add('success');
    
    setTimeout(function(){ 
      alertbox.classList.remove('success');
    }, 3000);
    
    e.clearSelection();
});
 
clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);

    let alertbox = document.getElementById('alert');
    alertbox.innerHTML = "Copy Failed"
    alertbox.classList.add('fail');

    setTimeout(function(){ 
      alertbox.classList.remove('fail');
    }, 3000);
});