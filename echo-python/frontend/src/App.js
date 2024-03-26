import './App.css';
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreateGame from "./CreateGame";
import Game1 from './Game1';

function App() {
  const [signer, setSigner] = useState(undefined);

  useEffect(() => {
      if (window.ethereum === "undefined")
          return alert("You need metamask to use this application");

      try {
          window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then(() => {
                  const provider = new ethers.providers.Web3Provider(
                      window.ethereum
                  );
                  const signer = provider.getSigner();
                  setSigner(signer);
              });
      } catch (error) {
          console.log(error);
          alert("Connecting to metamask failed.");
      }
  }, []);

  return (
    <div className="App">
        <div className='blur'>
            <h1>Escape Room</h1>
            <h2>An innovative decentralized application (DApp)<br/>Educative puzzles on blockchain</h2>
        </div>
        <CreateGame signer={signer} />

        {/* <Game1 signer={signer}/> */}
    </div>
    

    
  );
}

export default App;
