import React, { useState } from "react";
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
  IonSpinner,
} from "@ionic/react";
import "../theme/AIChatPage.css";

interface Message {
  sender: "user" | "aura";
  text: string;
}

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const auraMsg: Message = {
        sender: "aura",
        text: data.choices?.[0]?.message?.content || "Je n’ai pas compris 💭",
      };
      setMessages((prev) => [...prev, auraMsg]);
    } catch (error) {
      const errorMsg: Message = {
        sender: "aura",
        text: "⚠️ Une erreur est survenue, réessaie plus tard.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Aura 💖 — Coach AI</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding aura-chat">
        <IonList>
          {messages.map((msg, idx) => (
            <IonItem
              key={idx}
              className={msg.sender === "user" ? "user-msg" : "aura-msg"}
            >
              <IonLabel>{msg.text}</IonLabel>
            </IonItem>
          ))}
          {loading && (
            <IonItem className="aura-msg">
              <IonSpinner name="dots" />
              <IonLabel> Aura réfléchit... 💭</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>

      <IonFooter className="ion-padding">
        <IonInput
          placeholder="Écris ton message à Aura..."
          value={input}
          onIonChange={(e) => setInput(e.detail.value!)}
          className="aura-input"
        />
        <IonButton expand="block" color="secondary" onClick={sendMessage}>
          Envoyer 💌
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default AIChatPage;
