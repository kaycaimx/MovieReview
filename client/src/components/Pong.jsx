import React from "react";
import { useEffect, useState } from "react";

export default function Pong() {

  const [pong, setPong] = useState("");

  useEffect( () => {
    async function getPong() {
      const res = await fetch (`${process.env.REACT_APP_API_URL}/ping`)
      if (res.ok) {
        const data = await res.json();
        setPong(data);
      } else {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
    }
    getPong();
  }, [])

	return (
		<div> 
      <strong>{pong}</strong> 
    </div>
	);
}