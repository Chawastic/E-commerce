// email validation regex. used in backend registration endoint, can be found in routes/auth
function validateEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(String(email).toLowerCase());
  }

module.exports = {
    validateEmail
  };