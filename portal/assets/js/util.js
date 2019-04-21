function fetch2(url,options){
  return fetch(url,options).then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status == 401) { //no valid credentials found
          window.location='/';
        } else {
          // some other status like 400, 403, 500, etc
          // take proper actions
        }
      });
}
function logout(event) {
  event.preventDefault();
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location="/";
}
function evaluateRoles(){
  let token = Cookies.get('token');
  if(token && token.length>0 && token.indexOf('.')>0){
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let payload = JSON.parse(window.atob(base64));
    for(let idx=0;idx<payload.roles.length;idx++){
      let role = payload.roles[idx];
      $('#header_'+role).show();
    }
  }else{
    window.location='/';
  }
}

//delayed loading
setTimeout(evaluateRoles, 0);