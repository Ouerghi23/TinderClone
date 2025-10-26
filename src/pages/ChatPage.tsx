import React, { useState, useEffect, useRef } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBack, send, heart, informationCircle } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory, useParams } from "react-router-dom";
import "../theme/ChatPage.css"
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

interface MatchInfo {
  name: string;
  age: number;
  image: string;
}

const ChatPage: React.FC = () => {
  const { matchedUserId } = useParams<{ matchedUserId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const currentUser = auth.currentUser;

  const chatId = currentUser && matchedUserId 
    ? [currentUser.uid, matchedUserId].sort().join('_')
    : '';


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  useEffect(() => {
    const loadMatchInfo = async () => {
      if (!matchedUserId) return;

      try {
        const userDoc = await getDoc(doc(db, "users", matchedUserId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setMatchInfo({
            name: data.name || "Utilisateur",
            age: data.age || 0,
            image: data.images?.[0] || "/assets/default-avatar.jpg"
          });
        }
      } catch (error) {
        console.error("Erreur chargement match:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchInfo();
  }, [matchedUserId, db]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId, db]);


  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !chatId) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: input.trim(),
        timestamp: serverTimestamp(),
      });

      setInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="chat-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="chat-content">
        
        
        <div className="chat-header">
          <button className="back-btn" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </button>
          
          <div className="match-profile" onClick={() => history.push(`/profile/${matchedUserId}`)}>
            <img src={matchInfo?.image} alt={matchInfo?.name} className="match-avatar" />
            <div className="match-info">
              <h3>{matchInfo?.name}</h3>
              <span className="online-status">
                <span className="status-dot"></span>
                En ligne
              </span>
            </div>
          </div>

          <button className="info-btn">
            <IonIcon icon={informationCircle} />
          </button>
        </div>

        
        <div className="messages-wrapper">
          
          
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">
                <IonIcon icon={heart} />
              </div>
              <h3>Vous avez un match avec {matchInfo?.name} ! 💕</h3>
              <p>Commencez la conversation en envoyant un message</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div
                key={msg.id}
                className={`message-row ${isMe ? "user-row" : "match-row"}`}
              >
                {!isMe && (
                  <img src={matchInfo?.image} alt="" className="message-avatar" />
                )}
                
                <div className="message-content">
                  <div className={`message-bubble ${isMe ? "user-bubble" : "match-bubble"}`}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>

                {isMe && (
                  <div className="message-avatar-placeholder"></div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        
        <div className="input-area">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              placeholder={`Message à ${matchInfo?.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <IonIcon icon={send} />
            </button>
          </div>
        </div>

      </IonContent>

    
    </IonPage>
  );
};

export default ChatPage;