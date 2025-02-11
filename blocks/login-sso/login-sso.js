export default function decorate(block) {
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i += 1) {
      const [cookieName, cookieValue] = cookies[i].split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  const userCookie = getCookie('SciexUser');

  if (userCookie) {
    const userData = JSON.parse(userCookie);
    console.log('User Data:', userData);
    if (userData.loggedIn) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('logoutSection').style.display = 'block';
    } else {
      document.getElementById('loginSection').style.display = 'block';
      document.getElementById('logoutSection').style.display = 'none';
    }
  } else {
    console.log('No user cookie found, assuming logged out.');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('logoutSection').style.display = 'none';
  }

  block.append();
}
