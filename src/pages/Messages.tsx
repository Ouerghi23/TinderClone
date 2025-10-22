import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBack, searchOutline, ellipsisVertical } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getFirestore,
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import "../theme/MessagesPage.css";

interface Conversation {
  userId: string;
  name: string;
  photoURL: string;
  age: number;
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: number;
  online?: boolean;
}

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

    console.log("🔍 Current User UID:", currentUser.uid);

    // Récupérer les matches
    const matchesQuery = query(
      collection(db, "matches"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(matchesQuery, async (matchSnapshot) => {
      const matchedUsers = matchSnapshot.docs.map(doc => ({
        userId: doc.data().matchedUserId,
        name: doc.data().name,
        photoURL: doc.data().image,
        age: doc.data().age
      }));

      console.log("📋 Matches trouvés:", matchedUsers.length);

      if (matchedUsers.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Pour chaque match, récupérer le dernier message
      const conversationsData: Conversation[] = [];

      for (const match of matchedUsers) {
        const chatId = [currentUser.uid, match.userId].sort().join('_');
        
        try {
          // Récupérer le dernier message de ce chat
          const messagesRef = collection(db, "chats", chatId, "messages");
          const lastMessageQuery = query(
            messagesRef, 
            orderBy("timestamp", "desc"), 
            limit(1)
          );
          
          const messagesSnapshot = await getDocs(lastMessageQuery);
          
          if (!messagesSnapshot.empty) {
            const lastMessageDoc = messagesSnapshot.docs[0];
            const lastMessageData = lastMessageDoc.data();
            
            conversationsData.push({
              userId: match.userId,
              name: match.name,
              photoURL: match.photoURL,
              age: match.age,
              lastMessage: lastMessageData.text || "",
              lastMessageTime: lastMessageData.timestamp,
              unreadCount: 0,
              online: Math.random() > 0.5
            });
          } else {
            // Nouveau match sans messages
            conversationsData.push({
              userId: match.userId,
              name: match.name,
              photoURL: match.photoURL,
              age: match.age,
              lastMessage: "Nouveau match ! Dites bonjour 👋",
              lastMessageTime: null,
              unreadCount: 0,
              online: Math.random() > 0.5
            });
          }
        } catch (error) {
          console.error(`❌ Erreur conversation ${match.userId}:`, error);
          // Ajouter quand même le match
          conversationsData.push({
            userId: match.userId,
            name: match.name,
            photoURL: match.photoURL,
            age: match.age,
            lastMessage: "Nouveau match ! Dites bonjour 👋",
            lastMessageTime: null,
            unreadCount: 0,
            online: Math.random() > 0.5
          });
        }
      }

      // Trier par date
      conversationsData.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis();
      });

      console.log("✅ Conversations chargées:", conversationsData.length);
      setConversations(conversationsData);
      setLoading(false);
    }, (error) => {
      console.error("❌ Erreur Firestore matches:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, db, history]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (userId: string) => {
    history.push(`/chat/${userId}`);
  };

  return (
    <IonPage>
      <IonContent className="messages-content">
        
        {/* Header */}
        <div className="messages-header">
          <button className="back-btn" onClick={() => history.push("/dashboard")}>
            <IonIcon icon={arrowBack} />
          </button>
          <h1 className="header-title">Messages</h1>
          <button className="options-btn">
            <IonIcon icon={ellipsisVertical} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="conversations-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement de vos conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>
                {searchQuery 
                  ? "Aucune conversation trouvée" 
                  : "Aucune conversation"}
              </h3>
              <p>
                {searchQuery
                  ? "Essayez un autre terme de recherche"
                  : "Vos matches apparaîtront ici une fois que vous commencerez à swiper !"}
              </p>
              {!searchQuery && (
                <button 
                  className="start-swiping-btn" 
                  onClick={() => history.push("/dashboard")}
                >
                  Commencer à swiper
                </button>
              )}
            </div>
          ) : (
            <div className="conversations-list">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className="conversation-item"
                  onClick={() => handleConversationClick(conversation.userId)}
                >
                  <div className="avatar-wrapper">
                    <img
                      src={conversation.photoURL || "/assets/default-avatar.jpg"}
                      alt={conversation.name}
                      className="conversation-avatar"
                    />
                    {conversation.online && <div className="online-indicator"></div>}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3 className="conversation-name">
                        {conversation.name}
                      </h3>
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className="conversation-preview">
                      <p className={`last-message ${conversation.unreadCount > 0 ? 'unread' : ''}`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="unread-badge">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default MessagesPage;