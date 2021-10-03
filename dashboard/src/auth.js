import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";

import jwt_decode from "jwt-decode";

const checkLogin = () => {
  const token = localStorage.getItem("Authorization");
  if (!!token) {
    const { exp } = jwt_decode(token);
    if (new Date() < new Date(exp * 1000)) {
      return true;
    }
  }
  return false;
};

const useLoginAuth = ({ children, path }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    setIsLoggedIn(checkLogin());
  }, []);

  if (typeof isLoggedIn === "undefined") {
    return <>Loading...</>;
  } else {
    return (
      <>
        {!!isLoggedIn ? (
          <>{children}</>
        ) : (
          <Redirect to={`/login${!!path ? "?redirect=" + path : ""}`} />
        )}
      </>
    );
  }
};

export default useLoginAuth;
