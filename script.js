var clipboard = new Clipboard('.copy');
var lowercase = "abcdefghijklmnopqrstuvwxyz",
  uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  nums = "0123456789",
  specialChars = "!@#$%^&*()_+~`|}{[]:;?,./-=",
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
    error = "";

    //ensure optinos are selected
    if((lowercaseInput.checked === false) && (uppercaseInput.checked === false) && (specialInput.checked === false) && (numsInput.checked === false)){
        error = "0";
        alertMessage(error);
        return;
    }else if(Number(lengthInput.value) > 128 || Number(lengthInput.value) < 8 ){
        error = "1";
        alertMessage(error);
        return;
    }

    //determine which options are selected and build overall charset based on selected options.
    if(lowercaseInput.checked) {
        passwordCharSet += lowercase;
    }
    if(uppercaseInput.checked) {
        passwordCharSet += uppercase;
    }
    if(specialInput.checked) {
        passwordCharSet += specialChars;
    }
    if(numsInput.checked) {
        passwordCharSet += nums;
    }

    //determine length of password requested
    plength = Number(lengthInput.value);
    
    //build password
    for(let i = 0; i < plength; i++) {
        password += passwordCharSet.charAt(Math.floor(Math.random() * passwordCharSet.length));
    }

    passwordFeild.innerHTML = password;
    
    copyButton.setAttribute("data-clipboard-text", password)
}

//event listener
generateButton.addEventListener("click", generatePassword);
 

//clipboard success
clipboard.on('success', function(e) {

    let alertbox = document.getElementById('alert');
    alertbox.innerHTML = "Copy successful"
    alertbox.classList.add('success');
    
    setTimeout(function(){ 
      alertbox.classList.remove('success');
    }, 3000);
    
    e.clearSelection();
});
//clipboard fail
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

//generates an alert message if password cannot be created and why.
function alertMessage(errorReason){
    var message = "";

    if (errorReason == "0"){
        message = "Please choose an option.";
    }else if (errorReason == "1"){
        message ="Password must be between 8 and 128 characters long.";
    }

    let alertbox = document.getElementById('alert');
    alertbox.innerHTML = message;
    alertbox.classList.add('fail');
    setTimeout(function(){ 
        alertbox.classList.remove('fail');
    }, 3000);
}