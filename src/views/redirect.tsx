import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const Redirect: React.FC = ()=> {

  let navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  });

  return <></>;
}

export default Redirect;