import axios from "axios";

//!URL constants
const SEVICE_URL = "http://localhost:8001/service/";
const SSO_URL = "https://authviga.netlify.app/";
const ServiceIdentifierName = "MOVIECOLAB";
const DOMAIN = "netlify.com";

//!function to get Cookie value
function readCookie(name) {
  let key = name + "=";
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(key) === 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }
  return null;
}

export async function auth() {
  if (readCookie("access") && readCookie("refresh")) {
    console.log("yeah found");
    const refresh = readCookie("refresh");
    const access = readCookie("access");
    updateAccess(refresh);
    let found = false;
    await axios
      .get(SEVICE_URL, {
        headers: {
          Authorization: "Bearer " + access,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          res.data.forEach((element) => {
            console.log(element);
            if (element.name === ServiceIdentifierName) {
              console.log("found", ServiceIdentifierName);
              found = true;
            }
          });
        }
      })
      .catch((error) => {
        console.error(error);
        //window.location = SSO_URL + "?url=" + window.location.href;
      });

    if (found) {
      return true;
    } else {
      window.location = SSO_URL + "?url=" + window.location.href;
      return false;
    }
  } else {
    console.log("not found");
    window.location = SSO_URL + "?url=" + window.location.href;
  }
}

//!funciton to delete a cookie
function deleteCookie(name) {
  createCookie(name, "", -1);
}

//function to update access token using refresh token
function updateAccess(refresh) {
  let stopKey = setInterval(() => {
    axios
      .post("http://localhost:8000/api/token/refresh/", {
        refresh: refresh,
      })
      .then((res) => {
        const { access } = res.data;
        console.log("Access Token Updated");
        createCookie("access", access);
        createCookie("refresh", refresh);
      })
      .catch((err) => {
        console.error(err);
        console.log("Cannot Update Access Token");
        deleteCookie("access");
        deleteCookie("refresh");
      });
  }, 230000);
  //!using this stop key we can stop the refresh thing anytime
  window.localStorage.setItem("stopkey", stopKey);
  window.sessionStorage.setItem("stopKey", stopKey);
}
//function to create a cookie
function createCookie(key, value) {
  var now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  let expiration = now.toUTCString();
  const domain = DOMAIN;
  console.log(expiration);
  let cookie =
    escape(key) +
    "=" +
    escape(value) +
    ";expires=" +
    expiration +
    ";" +
    "domain=" +
    domain;
  document.cookie = cookie;
  console.log(cookie);
  console.log(
    "New cookie with key: " +
      key +
      " value: " +
      value +
      " expiration: " +
      expiration
  );
}
