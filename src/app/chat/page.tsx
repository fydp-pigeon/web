'use client';

import { useState } from "react";

export default function Chat() {
    const [convo, setConvo] = useState("");
    const [send, setSend] = useState("");

    return (
      <main>
        <div className="center">
            <h1>Pigeon</h1>
            <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-primary">{send}</div>
            </div>
            <footer className="footer flex p-10 text-base-content bottom">
                <input onChange={(e) => setConvo(e.target.value)} type="text" placeholder="Start a conversation" className="input input-bordered w-full" />
                <button onClick={() => setSend(convo)} className="btn justify-end btn-active btn-primary center-content">send</button>
            </footer>
        </div>
      </main>
    );
  }
  