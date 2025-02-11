export default async function decorate(block) {
  async function getUserDetails() {
    try {
      const response = await fetch('/bin/sciex/currentuserdetails', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  const userData = await getUserDetails();

  if (userData && userData.loggedIn) {
    console.log('User Logged In:', userData);
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'block';
  } else {
    console.log('User Not Logged In');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('logoutSection').style.display = 'none';
  }

  block.append();
}
