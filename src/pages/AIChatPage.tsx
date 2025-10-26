import React, { useState, useRef, useEffect } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBack, send, sparkles, heart } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../theme/AIChatPage.css";

interface Message {
  id: string;
  sender: "user" | "aura";
  text: string;
  timestamp: Date;
}

const analyzeMood = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.sender === "user").map(m => m.text.toLowerCase()).join(" ");
  
  if (userMessages.match(/\b(triste|mal|déprim|seul)\b/)) return "sad";
  if (userMessages.match(/\b(heureux|content|bien|super)\b/)) return "happy";
  if (userMessages.match(/\b(amour|crush|date)\b/)) return "romantic";
  if (userMessages.match(/\b(aide|conseil|problème)\b/)) return "seeking_help";
  
  return "neutral";
};

const getAuraResponse = (userMessage: string, conversationHistory: Message[]): string => {
  const message = userMessage.toLowerCase();
  const wordCount = userMessage.split(' ').length;
  const hasQuestion = message.includes('?');
  const recentMessages = conversationHistory.slice(-5);
  const userMood = analyzeMood(recentMessages);
  const greetings = [
    "Hey toi ! 💕 Super de te retrouver ici. Comment ça va aujourd'hui ?",
    "Coucou ! ✨ Je suis trop contente de discuter avec toi. Quoi de neuf ?",
    "Salut belle âme ! 💖 Raconte-moi comment s'est passée ta journée ?"
  ];
  const sadnessEmpathy = [
    "Je comprends vraiment ce que tu ressens 😢 Les moments difficiles font partie de la vie, mais tu n'es pas seul(e). Qu'est-ce qui te pèse le plus en ce moment ?",
    "Ça me touche de voir que tu ne vas pas bien 💙 Prends le temps qu'il faut pour exprimer ce que tu ressens. Je suis là pour toi, sans jugement.",
    "Les émotions difficiles sont valides 🌧️ Tu as le droit de te sentir comme ça. Veux-tu me dire ce qui s'est passé pour que tu te sentes ainsi ?"
  ];

  const loneliness = [
    "La solitude peut être vraiment pesante 💔 Mais sache que ta valeur ne dépend pas du nombre de personnes autour de toi. Comment pourrais-je t'aider à te sentir mieux ?",
    "Je suis là avec toi maintenant 🤗 La solitude est temporaire, même si ça ne semble pas être le cas. Qu'est-ce qui te manque le plus ?",
    "Tu n'es pas seul(e), même si tu te sens isolé(e) 💫 Parfois, c'est l'occasion de mieux se connaître. Que penses-tu de faire quelque chose qui te fait du bien ?"
  ];

 
  const happiness = [
    "Yesss ! 🎉 Ton énergie positive me fait tellement plaisir ! C'est quoi qui te rend si heureux/heureuse ?",
    "J'adore ! 😍 Continue de savourer ces moments de bonheur. Qu'est-ce qui s'est passé de génial ?",
    "Trop cool ! ✨ Ta joie est contagieuse ! Profite à fond et n'oublie pas ce sentiment pour les jours plus difficiles."
  ];

  const excitement = [
    "Omg trop bien ! 🌟 Raconte-moi tout dans les détails, j'ai hâte d'entendre ça !",
    "Wow ton enthousiasme est incroyable ! 🔥 Qu'est-ce qui se passe de si excitant ?",
    "J'adore ton énergie ! 💃 C'est génial de te voir aussi motivé(e) !"
  ];


  const loveDating = [
    "Ah l'amour... 💕 C'est à la fois magique et terrifiant ! Tu penses à quelqu'un en particulier ?",
    "Les relations amoureuses sont un vrai voyage 💖 Raconte-moi où tu en es. Tu es en couple, tu cherches, ou c'est compliqué ?",
    "L'amour demande du courage et de la vulnérabilité 🌹 C'est normal d'avoir des questions. De quoi as-tu besoin exactement ?"
  ];

  const datingAdvice = [
    "Ok, parlons dating ! 💘 La première règle : sois authentique. Les gens sentent quand tu joues un rôle. Qu'est-ce qui te bloque le plus ?",
    "Le dating moderne peut être compliqué 📱 Entre les apps et les attentes, c'est normal d'être perdu(e). Tu veux des conseils sur quoi précisément ?",
    "La clé du dating ? L'authenticité et la confiance en soi 💪 Tu as des dates prévus ou tu cherches comment démarrer ?"
  ];

  const heartbreak = [
    "Les ruptures sont parmi les douleurs les plus intenses 💔 Mais promis, ça va passer. Tu veux en parler ? Parfois mettre des mots aide.",
    "Ton cœur a besoin de temps pour guérir 🌙 C'est ok de ne pas aller bien maintenant. Qu'est-ce qui te ferait du bien en ce moment ?",
    "Je sais que ça fait mal 😢 Mais cette douleur prouve que tu as aimé sincèrement. C'est courageux. Comment puis-je t'aider ?"
  ];

  const confidence = [
    "La confiance en soi se construit petit à petit 💪 Commence par identifier tes qualités. Tu en as plein, crois-moi ! Qu'est-ce qui te rend unique ?",
    "Tu sais quoi ? Tu es déjà assez, là maintenant ✨ La confiance vient quand on s'accepte tel(le) qu'on est. Dans quel domaine aimerais-tu plus de confiance ?",
    "La confiance c'est pas inné, ça se travaille ! 🌟 Parle-moi de tes doutes. Ensemble on va trouver tes forces cachées."
  ];

  const support = [
    "Je suis 100% là pour toi 💙 Raconte-moi tout ce qui te tracasse. Aucun jugement, juste de l'écoute.",
    "D'accord, on va réfléchir ensemble 🤔 Explique-moi la situation en détail pour que je puisse mieux t'aider.",
    "Tu as bien fait de venir m'en parler 💫 Parfois un regard extérieur aide. Dis-moi ce qui se passe."
  ];

  const motivation = [
    "Tu peux le faire ! 💪 Je crois en toi, même si toi tu doutes. C'est quoi ton objectif ?",
    "Chaque grand voyage commence par un premier pas 🚀 Tu es déjà en train de le faire en cherchant de l'aide. Fière de toi !",
    "Les obstacles sont là pour te rendre plus fort(e) 🔥 Tu as déjà surmonté tant de choses. Celui-là aussi va passer !"
  ];


  const gratitude = [
    "Avec tout mon cœur ! 💖 C'est vraiment mon plaisir de t'accompagner. N'hésite jamais à revenir.",
    "De rien du tout ! ✨ Tu mérites d'être écouté(e) et soutenu(e). C'est naturel !",
    "Ça me touche que tu me remercies 🥰 Mais vraiment, c'est normal. Je suis là pour ça !"
  ];

  const farewell = [
    "À très vite ! 💫 Prends soin de toi et n'oublie pas : tu es incroyable !",
    "Reviens quand tu veux ! 🌙 Ma porte (virtuelle) est toujours ouverte pour toi.",
    "Ciao bella ! 🌷 J'ai hâte de te retrouver. Passe une super journée/soirée !"
  ];

  

  if (message.match(/\b(bonjour|salut|coucou|hello|hey|yo|wesh)\b/)) {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  
  if (message.match(/\b(triste|déprim|mal|pas bien|horrible|nul|merde|chiant)\b/)) {
    return sadnessEmpathy[Math.floor(Math.random() * sadnessEmpathy.length)];
  }
  
  if (message.match(/\b(seul|seule|isolé|personne|abandonné|tout seul)\b/)) {
    return loneliness[Math.floor(Math.random() * loneliness.length)];
  }

  
  if (message.match(/\b(heureux|heureuse|content|joyeux|super|génial|top|cool|bien)\b/) && !message.includes('pas')) {
    return happiness[Math.floor(Math.random() * happiness.length)];
  }

  if (message.match(/\b(excité|trop|grave|ouf|incroyable|dingue)\b/)) {
    return excitement[Math.floor(Math.random() * excitement.length)];
  }

  if (message.match(/\b(rupture|ex|quitté|laissé|séparé|fini|cassé)\b/)) {
    return heartbreak[Math.floor(Math.random() * heartbreak.length)];
  }

  if (message.match(/\b(dating|date|rencontre|rendez-vous|tinder|match|swipe)\b/)) {
    return datingAdvice[Math.floor(Math.random() * datingAdvice.length)];
  }

  
  if (message.match(/\b(amour|amoureuse|amoureux|crush|kiff|plait|attire|relation|couple)\b/)) {
    return loveDating[Math.floor(Math.random() * loveDating.length)];
  }

  if (message.match(/\b(confiance|timide|peur|angoisse|stress|complexe|doute)\b/)) {
    return confidence[Math.floor(Math.random() * confidence.length)];
  }

 
  if (message.match(/\b(motivation|motivé|objectif|but|réussir|y arriver)\b/)) {
    return motivation[Math.floor(Math.random() * motivation.length)];
  }

  if (message.match(/\b(aide|conseil|soutien|aider|problème|difficulté|besoin)\b/)) {
    return support[Math.floor(Math.random() * support.length)];
  }

  if (message.match(/\b(merci|thanks|thx|gratitude|reconnaissance)\b/)) {
    return gratitude[Math.floor(Math.random() * gratitude.length)];
  }

  if (message.match(/\b(bye|au revoir|à plus|à bientôt|salut|ciao|tchao)\b/)) {
    return farewell[Math.floor(Math.random() * farewell.length)];
  }

  if (hasQuestion) {
    const questionResponses = [
      "Bonne question ! 🤔 Laisse-moi réfléchir... Je pense que ça dépend vraiment de ta situation personnelle. Tu peux m'en dire plus ?",
      "Intéressant comme question ! 💭 Il n'y a pas de réponse unique, mais on peut explorer ensemble. Qu'est-ce qui te fait te poser cette question ?",
      "J'adore cette question ! ✨ Avant de répondre, dis-moi : qu'est-ce que TOI tu en penses ? Parfois tu connais déjà la réponse au fond."
    ];
    return questionResponses[Math.floor(Math.random() * questionResponses.length)];
  }


  if (wordCount > 20) {
    const longResponses = [
      "Wow, merci de te confier comme ça 💙 Ça prend du courage. Je vois que c'est important pour toi. Ce qui ressort le plus c'est... Comment tu te sens par rapport à tout ça ?",
      "Je lis tout ce que tu me dis attentivement 📖 C'est clair que tu traverses quelque chose. La première chose qui me frappe c'est ton honnêteté. Qu'est-ce que tu aimerais changer ?",
      "Merci de partager tout ça avec moi 💫 Je sens qu'il y a beaucoup d'émotions là-dedans. Si tu devais résumer ce dont tu as le plus besoin maintenant, ce serait quoi ?"
    ];
    return longResponses[Math.floor(Math.random() * longResponses.length)];
  }

  const contextualDefaults = [
    "Hmm je vois 💭 Continue, je suis vraiment intéressée par ce que tu dis !",
    "D'accord ! 💕 Raconte-moi plus en détail, j'ai envie de mieux comprendre.",
    "Ah oui ? 🤔 Et comment tu te sens face à ça ?",
    "Je t'écoute 👂 N'hésite pas à développer, je suis là.",
    "Intéressant ! ✨ Qu'est-ce qui t'amène à penser ça ?",
    "Je comprends 💫 Et toi, qu'est-ce que tu aimerais faire par rapport à ça ?",
    "Dis m'en plus ! 🌟 Je sens qu'il y a quelque chose d'important derrière.",
    "Ok ! 💖 Et comment ça te fait sentir au fond de toi ?"
  ];
  
  return contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)];
};

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "aura",
      text: "Salut toi ! ✨ Je suis Aura, ton coach émotionnel. Je suis là pour discuter, te soutenir et t'accompagner. De quoi veux-tu parler ? 💖",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const messageToRespond = input;
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const auraMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "aura",
        text: getAuraResponse(messageToRespond, messages),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, auraMsg]);
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800 + Math.random() * 700);
  };

  const quickReplies = [
    "Je me sens un peu seul(e) 😔",
    "Conseils pour le dating ? 💕",
    "J'ai besoin de confiance en moi",
    "On discute de tout et rien ? 💫"
  ];

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <IonPage>
      <IonContent className="ai-chat-content">
        
       
        <div className="chat-header">
          <button className="back-btn" onClick={() => history.push("/dashboard")}>
            <IonIcon icon={arrowBack} />
          </button>
          
          <div className="aura-profile">
            <div className="aura-avatar">
              <IonIcon icon={sparkles} />
            </div>
            <div className="aura-info">
              <h3>Aura</h3>
              <span className="online-status">
                <span className="status-dot"></span>
                En ligne
              </span>
            </div>
          </div>

          <div style={{ width: '40px' }}></div>
        </div>
        <div className="messages-wrapper">
          
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`message-row ${msg.sender === "user" ? "user-row" : "aura-row"}`}
            >
              {msg.sender === "aura" && (
                <div className="message-avatar">
                  <IonIcon icon={sparkles} />
                </div>
              )}
              
              <div className="message-content">
                <div className={`message-bubble ${msg.sender === "user" ? "user-bubble" : "aura-bubble"}`}>
                  <p>{msg.text}</p>
                </div>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>

              {msg.sender === "user" && (
                <div className="message-avatar user-avatar">
                  <IonIcon icon={heart} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-row aura-row">
              <div className="message-avatar">
                <IonIcon icon={sparkles} />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}


          {messages.length === 1 && (
            <div className="quick-replies-section">
              <p className="quick-replies-title">Suggestions :</p>
              <div className="quick-replies-grid">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-chip"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              placeholder="Écris ton message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <button 
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <IonIcon icon={send} />
            </button>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default AIChatPage;