function facebookLogin() {
  const FB = window.FB;
  return new Promise((resolve) => {
    FB.login(
      function (response) {
        const authResponse = response.authResponse;
        if (authResponse) {
          FB.api("/me", { fields: "id,name,email" }, function (profile) {
            const result = {
              isSuccess: true,
              data: {
                token: authResponse.accessToken,
                userId: authResponse.userID,
                ...profile,
              },
            };
            resolve(result);
          });
        } else {
          resolve({
            isSuccess: false,
            data: "User cancelled login or did not fully authorize.",
          });
        }
      },
      { scope: "public_profile,email", return_scopes: true }
    );
  });
}

async function login() {
  const interval = 1000;
  const maxTryCount = 3;
  let tryCount = 1;
  let intervalChecking = null;

  function tryLoadFB() {
    return new Promise((resolve, reject) => {
      intervalChecking = setInterval(() => {
        if (window.FB) {
          resolve();
          clearInterval(intervalChecking);
          return;
        }
        if (tryCount >= maxTryCount) {
          reject();
          clearInterval(intervalChecking);
          return;
        }
        tryCount += 1;
      }, interval);
    });
  }

  try {
    if (window.FB) {
      const result = await facebookLogin();
      return result;
    }
    await tryLoadFB();
    const result = await facebookLogin();
    return result;
  } catch (err) {
    return {
      isSuccess: false,
      data: "Can not connect to facebook, please reload this page",
    };
  }
}

export default login;
