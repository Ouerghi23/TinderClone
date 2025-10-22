import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBack, chatbubbleEllipses, star, heart, sparkles } from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  name: string;
  age: number;
  image: string;
  status: string;
  createdAt: any;
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

    // Query pour récupérer les matches où userId = currentUser.uid
    const matchesQuery = query(
      collection(db, "matches"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(matchesQuery, (snapshot) => {
      const matchesData: Match[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Match, "id">),
      }));
      
      // Trier par date de création (plus récent en premier)
      matchesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log("✅ Matches trouvés:", matchesData.length);
      console.log("📋 Matches data:", matchesData);
      setMatches(matchesData);
      setLoading(false);
    }, (error) => {
      console.error("❌ Erreur Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, db, history]);

  const getOtherUserInfo = (match: Match) => {
    // Retourne directement les infos du match
    return {
      name: match.name,
      photoURL: match.image,
      age: match.age
    };
  };

  const handleChatClick = (match: Match) => {
    // Utiliser matchedUserId pour la conversation
    history.push(`/chat/${match.matchedUserId}`);
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
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="match-card"
                  onClick={() => handleChatClick(match)}
                >
                  <div className="match-image-wrapper">
                    <img
                      src={match.image || "/assets/default-avatar.jpg"}
                      alt={match.name}
                      className="match-image"
                    />
                    <div className="match-overlay">
                      <div className="match-info">
                        <h3 className="match-name">
                          {match.name}, {match.age}
                        </h3>
                        <p className="match-date">
                          💕 Match • {formatDate(match.createdAt)}
                        </p>
                      </div>
                      <button className="chat-icon-btn">
                        <IonIcon icon={chatbubbleEllipses} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </IonContent>

      <style>{`
        /* ====================================== */
        /*      MATCHES PAGE - TINDER PRO         */
        /* ====================================== */

        * {
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }

        .matches-content {
          --background: #F5F5F5;
        }

        /* ========== HEADER ========== */
        .matches-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #FFFFFF;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #F6F6F6;
          color: #1C1C1E;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-btn:hover {
          background: #FE3C72;
          color: white;
          transform: scale(1.08);
        }

        .back-btn:active {
          transform: scale(0.95);
        }

        .header-title {
          font-size: 22px;
          font-weight: 800;
          color: #1C1C1E;
          margin: 0;
          letter-spacing: -0.5px;
          flex: 1;
          text-align: center;
        }

        .header-count {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B9D 0%, #FE3C72 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(254, 60, 114, 0.35);
        }

        .header-count span {
          color: white;
          font-size: 17px;
          font-weight: 800;
        }

        /* ========== CONTAINER ========== */
        .matches-container {
          padding: 24px 16px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ========== LOADING ========== */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          color: #8E8E93;
        }

        .spinner {
          width: 56px;
          height: 56px;
          border: 4px solid #F0F0F0;
          border-top-color: #FE3C72;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-bottom: 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          font-size: 17px;
          font-weight: 600;
          margin: 0;
          color: #4A4A4A;
        }

        /* ========== EMPTY STATE ========== */
        .empty-state {
          text-align: center;
          padding: 100px 24px;
        }

        .empty-icon-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 36px;
        }

        .empty-icon {
          width: 140px;
          height: 140px;
          color: #FE3C72;
          opacity: 0.15;
        }

        .sparkle {
          position: absolute;
          font-size: 36px;
          color: #FF6B9D;
          animation: sparkleFloat 3s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 5px;
          right: 5px;
          animation-delay: 0s;
        }

        .sparkle-2 {
          bottom: 5px;
          left: 5px;
          animation-delay: 1.5s;
        }

        @keyframes sparkleFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) rotate(180deg) scale(1.1);
            opacity: 1;
          }
        }

        .empty-state h3 {
          font-size: 26px;
          font-weight: 800;
          color: #1C1C1E;
          margin: 0 0 16px 0;
          letter-spacing: -0.8px;
        }

        .empty-state p {
          font-size: 17px;
          color: #8E8E93;
          margin: 0 0 40px 0;
          line-height: 1.6;
          font-weight: 500;
        }

        .start-swiping-btn {
          background: linear-gradient(135deg, #FF6B9D 0%, #FE3C72 100%);
          border: none;
          color: white;
          padding: 18px 36px;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 28px rgba(254, 60, 114, 0.45);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .start-swiping-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(254, 60, 114, 0.55);
        }

        .start-swiping-btn:active {
          transform: translateY(-1px);
        }

        /* ========== MATCHES GRID ========== */
        .matches-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .match-card {
          cursor: pointer;
          animation: fadeIn 0.6s ease-out;
          animation-fill-mode: both;
        }

        .match-card:nth-child(1) { animation-delay: 0.05s; }
        .match-card:nth-child(2) { animation-delay: 0.1s; }
        .match-card:nth-child(3) { animation-delay: 0.15s; }
        .match-card:nth-child(4) { animation-delay: 0.2s; }
        .match-card:nth-child(5) { animation-delay: 0.25s; }
        .match-card:nth-child(6) { animation-delay: 0.3s; }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .match-image-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .match-card:hover .match-image-wrapper {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
        }

        .match-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .match-card:hover .match-image {
          transform: scale(1.08);
        }

        .super-like-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          z-index: 2;
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
          animation: pulseBadge 2.5s ease-in-out infinite;
          border: 3px solid rgba(255, 255, 255, 0.9);
        }

        @keyframes pulseBadge {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
          }
          50% {
            transform: scale(1.12);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.7);
          }
        }

        .match-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%);
          padding: 20px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .match-card:hover .match-overlay {
          opacity: 1;
        }

        .match-info {
          flex: 1;
          color: white;
        }

        .match-name {
          font-size: 19px;
          font-weight: 800;
          margin: 0 0 6px 0;
          letter-spacing: -0.4px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }

        .match-date {
          font-size: 14px;
          margin: 0;
          opacity: 0.95;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .chat-icon-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B9D 0%, #FE3C72 100%);
          border: none;
          color: white;
          font-size: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 16px rgba(254, 60, 114, 0.6);
          flex-shrink: 0;
        }

        .chat-icon-btn:hover {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 8px 24px rgba(254, 60, 114, 0.75);
        }

        .chat-icon-btn:active {
          transform: scale(0.92);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 576px) {
          .matches-header {
            padding: 14px 16px;
          }

          .back-btn, .header-count {
            width: 40px;
            height: 40px;
          }

          .header-title {
            font-size: 19px;
          }

          .header-count span {
            font-size: 15px;
          }

          .matches-container {
            padding: 18px 12px;
          }

          .matches-grid {
            gap: 14px;
          }

          .match-image-wrapper {
            border-radius: 16px;
          }

          .match-name {
            font-size: 17px;
          }

          .match-date {
            font-size: 13px;
          }

          .chat-icon-btn {
            width: 46px;
            height: 46px;
            font-size: 23px;
          }

          .super-like-badge {
            width: 38px;
            height: 38px;
            font-size: 19px;
            top: 10px;
            right: 10px;
          }

          .empty-state {
            padding: 80px 20px;
          }

          .empty-icon-wrapper {
            width: 110px;
            height: 110px;
          }

          .empty-icon {
            width: 110px;
            height: 110px;
          }

          .sparkle {
            font-size: 28px;
          }

          .empty-state h3 {
            font-size: 23px;
          }

          .empty-state p {
            font-size: 16px;
          }

          .start-swiping-btn {
            font-size: 16px;
            padding: 15px 30px;
          }
        }

        @media (min-width: 768px) {
          .matches-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
          }

          .matches-container {
            padding: 28px 24px;
          }

          .match-overlay {
            padding: 22px 20px;
          }
        }

        @media (min-width: 1024px) {
          .matches-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }

          .matches-container {
            padding: 32px 28px;
          }
        }

        @media (min-width: 1280px) {
          .matches-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (min-width: 1536px) {
          .matches-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        /* Hover effect only on desktop */
        @media (hover: hover) {
          .match-overlay {
            opacity: 0;
          }

          .match-card:hover .match-overlay {
            opacity: 1;
          }
        }

        /* Always show overlay on touch devices */
        @media (hover: none) {
          .match-overlay {
            opacity: 1;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
          }
        }

        /* Smooth scrolling */
        .matches-content {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        .matches-content::-webkit-scrollbar {
          width: 8px;
        }

        .matches-content::-webkit-scrollbar-track {
          background: #F5F5F5;
        }

        .matches-content::-webkit-scrollbar-thumb {
          background: #E5E5EA;
          border-radius: 4px;
        }

        .matches-content::-webkit-scrollbar-thumb:hover {
          background: #D1D1D6;
        }
      `}</style>
    </IonPage>
  );
};

export default MatchesPage;