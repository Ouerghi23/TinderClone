import React, { useState, useEffect } from "react";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowBack, chatbubbleEllipsesOutline, star } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import "../theme/MatchesPage.css";

interface Match {
  id: string;
  matchedUserId: string;
  name: string;
  age: number;
  image: string;
  isSuperLike: boolean;
  createdAt: any;
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const history = useHistory();
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const matchesQuery = query(
      collection(db, "matches"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(matchesQuery, (snapshot) => {
      const matchesData: Match[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Match)
      );
      matchesData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setMatches(matchesData);
    });

    return () => unsubscribe();
  }, [db]);

  const startChat = (match: Match) => {
    history.push(`/chat/${match.matchedUserId}`, {
      matchName: match.name,
      matchImage: match.image,
    });
  };

  const handleBack = () => {
    history.goBack(); // Ou history.push("/dashboard") si vous préférez
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color="light">
          <div className="toolbar-content">
            <button className="back-btn" onClick={handleBack}>
              <IonIcon icon={arrowBack} />
            </button>
            <IonTitle className="matches-title">💞 Vos Matches</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding matches-container">
        {matches.length === 0 ? (
          <div className="no-matches">
            <img src="/assets/empty-heart.svg" alt="no matches" />
            <h2>Aucun match pour le moment 😢</h2>
            <p>Swipez à droite pour liker des profils et créer des matches !</p>
          </div>
        ) : (
          <IonList className="matches-list">
            {matches.map((match) => (
              <IonItem
                key={match.id}
                className={`match-item ${match.isSuperLike ? "superlike" : ""}`}
              >
                <IonAvatar slot="start">
                  <img
                    src={match.image || "/assets/default.jpg"}
                    alt={match.name}
                  />
                </IonAvatar>
                <IonLabel>
                  <h2>
                    {match.name}, {match.age}{" "}
                    {match.isSuperLike && (
                      <IonIcon icon={star} className="superlike-star" />
                    )}
                  </h2>
                  <p>
                    {match.isSuperLike ? "Super Like 💫" : "Match 💖"} —{" "}
                    {match.createdAt.toDate().toLocaleDateString()}
                  </p>
                </IonLabel>
                <IonButton
                  fill="solid"
                  color="tertiary"
                  className="chat-btn"
                  onClick={() => startChat(match)}
                >
                  <IonIcon icon={chatbubbleEllipsesOutline} slot="start" />
                  Chat
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonApp>
  );
};

export default MatchesPage;