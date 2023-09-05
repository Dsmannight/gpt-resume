import { useState } from 'react';
import './App.css';
import ChatPage from './chat/ChatPage';

function App() {
  const [chatPage, setChatPage] = useState(false)

  let screenSetters = {
    chat: setChatPage
  }

  const screenHandler = (screen) => {
    setChatPage(false);
    screenSetters[screen](true);
  }

  return (
    <>
      <ChatPage screenHandler={screenHandler}/>
    </>
  );
}

export default App;
