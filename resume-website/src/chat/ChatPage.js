import { useState } from "react"
import { URL } from "../constants"
import "./ChatPage.css"

const ChatPage = () => {
    const [input, setInput] = useState("")
    const [returnMessage, setReturnMessage] = useState("")
    const [talking, setTalking] = useState(false)
    const [messages, setMessages] = useState([])

    const handleSend = async () => {        
        if (input.trim() !== '') {
          setMessages(prevMessage => [...prevMessage, {role: "user", content: input}])
          setReturnMessage("")
          setTalking(true)
          let current_messages = [...messages, {role: "user", content: input}] // Make current message usable to send
          setInput('');
          
          // Stream AI's message
          const response = await fetch(`${URL}/api/talk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Body: current_messages
            }),
          })
          const reader = response.body.getReader();
          let incomingText = ""
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const messages = new TextDecoder('utf-8').decode(value);
            incomingText += messages
            setReturnMessage(incomingText)
          }
          setMessages(prevMessage => [...prevMessage, {role: "system", content: incomingText}])
          setTalking(false);
        }
        return
      }

    return(
          <div className="chat-interface">
              <div className="img-container">
                <div className={`skull-head-${talking === false ? "close" : "open"}`}></div>
              </div>
              <div className="return-message">
                  {returnMessage}
              </div>
              <div className="chat-send-form">
                  <input className="chat-input"
                      type="text"
                      value={input}
                      placeholder="Ask away..."
                      onChange={e => setInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' ? handleSend() : null}
                  />
                  <span className="send-button "></span>
              </div>
          </div>
    )
}
export default ChatPage;