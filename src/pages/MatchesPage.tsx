import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBack, chatbubbleEllipses, star, heart, sparkles } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import "../theme/MatchesPage.css"
interface Match {
  chatId: string;
  participants: string[];
  participantsInfo: {
    [key: string]: {
      name: string;
      photoURL: string;
      age?: number;
    };
  };
  lastMessage: string;
  lastMessageTime: any;
  createdAt: any;
  isSuperLike?: boolean;
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      history.push("/login");
      return;
    }

    const matchesQuery = query(
      collection(db, "matches"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(matchesQuery, (snapshot) => {
      const matchesData: Match[] = snapshot.docs.map((doc) => ({
        chatId: doc.id,
        ...(doc.data() as Omit<Match, "chatId">),
      }));
      
      // Trier par date de création (plus récent en premier)
      matchesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setMatches(matchesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, db, history]);

  const getOtherUserInfo = (match: Match) => {
    const otherUserId = match.participants.find((id) => id !== currentUser?.uid);
    return otherUserId ? match.participantsInfo[otherUserId] : null;
  };

  const handleChatClick = (chatId: string) => {
    history.push(`/chat/${chatId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <IonPage>
      <IonContent className="matches-content">
        
        {/* Header */}
        <div className="matches-header">
          <button className="back-btn" onClick={() => history.push("/dashboard")}>
            <IonIcon icon={arrowBack} />
          </button>
          <h1 className="header-title">Matches</h1>
          <div className="header-count">
            <span>{matches.length}</span>
          </div>
        </div>

        <div className="matches-container">
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement de vos matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <IonIcon icon={heart} className="empty-icon" />
                <IonIcon icon={sparkles} className="sparkle sparkle-1" />
                <IonIcon icon={sparkles} className="sparkle sparkle-2" />
              </div>
              <h3>Aucun match pour le moment</h3>
              <p>Commencez à swiper pour trouver votre match parfait !</p>
              <button className="start-swiping-btn" onClick={() => history.push("/dashboard")}>
                <IonIcon icon={heart} style={{ marginRight: '8px' }} />
                Découvrir des profils
              </button>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map((match) => {
                const otherUser = getOtherUserInfo(match);
                if (!otherUser) return null;

                return (
                  <div
                    key={match.chatId}
                    className="match-card"
                    onClick={() => handleChatClick(match.chatId)}
                  >
                    <div className="match-image-wrapper">
                      <img
                        src={otherUser.photoURL || "/assets/default-avatar.jpg"}
                        alt={otherUser.name}
                        className="match-image"
                      />
                      {match.isSuperLike && (
                        <div className="super-like-badge">
                          <IonIcon icon={star} />
                        </div>
                      )}
                      <div className="match-overlay">
                        <div className="match-info">
                          <h3 className="match-name">
                            {otherUser.name}
                            {otherUser.age && <span>, {otherUser.age}</span>}
                          </h3>
                          <p className="match-date">
                            {match.isSuperLike ? "⭐ Super Like" : "💕 Match"} • {formatDate(match.createdAt)}
                          </p>
                        </div>
                        <button className="chat-icon-btn">
                          <IonIcon icon={chatbubbleEllipses} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </IonContent>


    </IonPage>
  );
};

export default MatchesPage;