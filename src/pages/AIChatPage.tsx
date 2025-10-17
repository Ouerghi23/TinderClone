import React, { useState, useRef, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonText,
  IonSpinner,
} from "@ionic/react";
import { 
  arrowBack, 
  send, 
  heart, 
  sparkles,
  home
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../theme/AIChatPage.css";

interface Message {
  id: string;
  sender: "user" | "aura";
  text: string;
  timestamp: Date;
}

// 💖 Moteur de réponse locale améliorée
const getAuraResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Réponses par catégorie
  const greetings = [
    "Coucou 💕 Je suis Aura, ton coach émotionnel ! Comment tu te sens aujourd'hui ?",
    "Bonjour belle âme ✨ Je suis là pour toi. De quoi as-tu envie de parler ?",
    "Salut 💖 Ton énergie positive m'atteint déjà ! Comment vas-tu ?"
  ];

  const sadness = [
    "Oh non 😢… je sens que ton cœur est lourd. Tu veux m'en parler ? Parfois, juste exprimer ce qu'on ressent peut déjà soulager 💫",
    "Je suis là pour toi dans ce moment difficile 🤗 N'oublie pas que toutes les émotions sont valides, même les plus sombres",
    "Prends une grande respiration avec moi 🌬️ Je t'écoute sans jugement, tu peux tout me dire"
  ];

  const happiness = [
    "Trop bien 😍 ! Cette énergie positive est magnifique, garde-la précieusement ✨",
    "Wow ! Ta bonne humeur est contagieuse 🌟 Profite de chaque instant de bonheur",
    "Je danse de joie avec tou 💃🕺 Le bonheur te va si bien !"
  ];

  const love = [
    "L'amour, c'est comme une danse 💃 parfois on mène, parfois on suit. Ce qui compte, c'est d'être en harmonie 🩷",
    "Le cœur a ses raisons que la raison ne connaît point 💖 Laisse-toi guider par ton intuition",
    "L'amour véritable commence par s'aimer soi-même 🌸 Comment te sens-tu dans ta relation avec toi ?"
  ];

  const advice = [
    "Je suis là pour toi 💌 Souhaites-tu un conseil sur les relations, la confiance en toi, ou simplement un moment d'écoute ?",
    "Chaque situation est unique 🌈 Dis-m'en plus pour que je puisse t'accompagner au mieux",
    "Ton bien-être est ma priorité 💫 De quel type de soutien as-tu besoin en ce moment ?"
  ];

  const gratitude = [
    "Avec tout mon cœur 💖 Tu mérites tellement de bonheur et d'amour",
    "C'est moi qui te remercie 🌟 Partager ce moment avec toi me remplit de joie",
    "Merci à toi d'être qui tu es ✨ Tu apporte tellement de lumière autour de toi"
  ];

  const farewell = [
    "À très vite 💫 Prends soin de toi, et n'oublie pas : tu es assez, tel(le) que tu es 💐",
    "Notre connexion restera toujours là 🌙 Reviens quand tu veux, je serai là",
    "Porte-toi bien, belle âme 🌷 Et souviens-toi : tu es aimé(e) et important(e)"
  ];

  // Logique de réponse améliorée
  if (message.includes("bonjour") || message.includes("salut") || message.includes("coucou") || message.includes("hello")) {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  if (message.includes("triste") || message.includes("mal") || message.includes("déprimé") || message.includes("seul") || message.includes("pleur")) {
    return sadness[Math.floor(Math.random() * sadness.length)];
  }
  if (message.includes("heureux") || message.includes("bien") || message.includes("joie") || message.includes("content") || message.includes("super")) {
    return happiness[Math.floor(Math.random() * happiness.length)];
  }
  if (message.includes("amour") || message.includes("relation") || message.includes("cœur") || message.includes("romantique") || message.includes("dating")) {
    return love[Math.floor(Math.random() * love.length)];
  }
  if (message.includes("conseil") || message.includes("aide") || message.includes("soutien") || message.includes("problème") || message.includes("difficulté")) {
    return advice[Math.floor(Math.random() * advice.length)];
  }
  if (message.includes("merci") || message.includes("gratitude") || message.includes("reconnaissance")) {
    return gratitude[Math.floor(Math.random() * gratitude.length)];
  }
  if (message.includes("bye") || message.includes("au revoir") || message.includes("à plus") || message.includes("bonne nuit")) {
    return farewell[Math.floor(Math.random() * farewell.length)];
  }

  // Réponses par défaut plus variées
  const defaultResponses = [
    "Hmm 💭 intéressant… raconte-m'en un peu plus ? Je suis tout ouïe 👂",
    "Je t'écoute avec tout mon cœur 💕 Dis-m'en davantage sur ce qui te préoccupe",
    "Chaque mot que tu partages est important pour moi 🌸 Continue, je suis là pour toi",
    "Je ressens ton besoin de partager 🤗 N'hésite pas à te confier, je t'écoute sans jugement",
    "Ton message me touche 💫 Veux-tu développer ? Je suis là pour comprendre et soutenir",
    "Je perçois quelque chose de profond dans tes mots 🌙 Dis-m'en plus, si tu le souhaites"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const AuraChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "aura",
      text: "Bonjour belle âme ✨ Je suis Aura, ton coach émotionnel personnel. Je suis là pour t'écouter, te soutenir et t'accompagner dans ton cheminement. De quoi as-tu envie de parler aujourd'hui ? 💖",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { 
      id: Date.now().toString(),
      sender: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const auraMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "aura",
        text: getAuraResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, auraMsg]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // délai variable pour plus de naturel
  };

  const handleBackToDashboard = () => {
    history.push("/dashboard");
  };

  const quickReplies = [
    "Je me sens un peu triste aujourd'hui",
    "J'ai besoin de conseils en dating",
    "Comment avoir plus confiance en moi ?",
    "Je veux juste discuter 💫"
  ];

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="aura-toolbar">
          <div className="toolbar-content">
            <IonButton 
              fill="clear" 
              className="back-button"
              onClick={handleBackToDashboard}
              title="Retour au Dashboard"
            >
              <IonIcon icon={home} slot="icon-only" />
            </IonButton>
            
            <div className="aura-header">
              <IonAvatar className="aura-avatar">
                <IonIcon icon={sparkles} />
              </IonAvatar>
              <IonTitle className="aura-title">
                Aura 💖
                <small>Coach Émotionnel</small>
              </IonTitle>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="aura-chat-content">
        {/* Messages */}
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "user" ? "user-message" : "aura-message"}`}
            >
              <div className="message-avatar">
                {msg.sender === "user" ? (
                  <IonIcon icon={heart} className="user-avatar" />
                ) : (
                  <IonIcon icon={sparkles} className="aura-avatar-icon" />
                )}
              </div>
              <div className="message-bubble">
                <IonText>
                  <p>{msg.text}</p>
                </IonText>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message aura-message">
              <div className="message-avatar">
                <IonIcon icon={sparkles} className="aura-avatar-icon" />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <IonSpinner name="dots" />
                  <span>Aura réfléchit...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 2 && (
          <div className="quick-replies">
            <IonText color="medium">
              <small>Suggestions pour démarrer :</small>
            </IonText>
            <div className="quick-replies-buttons">
              {quickReplies.map((reply, index) => (
                <IonButton
                  key={index}
                  size="small"
                  fill="outline"
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </IonButton>
              ))}
            </div>
          </div>
        )}
      </IonContent>

      <IonFooter className="input-footer">
        <div className="input-container">
          <IonInput
            placeholder="Écris ton message à Aura..."
            value={input}
            onIonInput={(e) => setInput(e.detail.value!)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="message-input"
            disabled={isLoading}
          />
          <IonButton 
            className="send-button"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <IonIcon icon={send} slot="icon-only" />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default AuraChatPage;