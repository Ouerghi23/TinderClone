import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IonApp, IonContent, IonButton, IonIcon } from "@ionic/react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import { personCircleOutline, close, heart, flash } from "ionicons/icons";
import "../theme/DashboardPage.css";

/* ---------- Types ---------- */
interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  distance: string;
  images: string[];
  interests: string[];
}

interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
}

/* ---------- Composant principal ---------- */
const DashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });
  const history = useHistory();

  const currentIndex = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const db = getFirestore(app);

  /* 🔥 Charger profils Firestore */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedProfiles: Profile[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Profile, "id">),
      }));
      setProfiles(fetchedProfiles);
    });
    return () => unsubscribe();
  }, [db]);

  /* 🔄 Swipe */
  const swipe = useCallback((direction: "left" | "right") => {
    const currentCardRef = cardRefs.current[currentIndex.current];
    if (!currentCardRef) return;
    const moveX = direction === "left" ? -300 : 300;
    currentCardRef.style.transform = `translate(${moveX}px, 0) rotate(${direction === "left" ? -15 : 15}deg)`;
    currentCardRef.style.opacity = "0";
    currentIndex.current += 1;
  }, []);

  /* 🖱 Gestion drag */
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragState({ isDragging: true, startX: clientX, currentX: clientX });
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragState.isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragState((prev) => ({ ...prev, currentX: clientX }));
    const diff = clientX - dragState.startX;
    const card = cardRefs.current[currentIndex.current];
    if (!card) return;
    card.style.transform = `translate(${diff}px, 0) rotate(${diff * 0.05}deg)`;
  };

  const handleDragEnd = () => {
    if (!dragState.isDragging) return;
    const diff = dragState.currentX - dragState.startX;
    const threshold = 120;
    if (Math.abs(diff) > threshold) swipe(diff > 0 ? "right" : "left");
    else {
      const card = cardRefs.current[currentIndex.current];
      if (card) card.style.transform = "translate(0, 0)";
    }
    setDragState({ isDragging: false, startX: 0, currentX: 0 });
  };

  /* 🚪 Déconnexion */
  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    history.push("/login");
  };

  /* 💳 Affichage des cartes */
  const renderCards = useMemo(
    () =>
      profiles
        .slice(currentIndex.current)
        .map((profile, index) => (
          <div
            key={profile.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="tinder-card"
            style={{
              zIndex: profiles.length - index,
              transform: `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <img
              src={profile.images?.[0] || "/assets/default.jpg"}
              alt={profile.name}
              className="profile-image"
            />
            <div className="profile-info">
              <h2>
                {profile.name}, {profile.age}
              </h2>
              <p>{profile.bio}</p>
              <p className="distance">{profile.distance}</p>
              <div className="interests">
                {profile.interests?.map((interest, i) => (
                  <span key={i} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )),
    [profiles, dragState]
  );

  return (
    <IonApp>
      <IonContent className="dashboard-content">
        {/* Top Bar avec profil et logo Aura */}
        <div className="top-bar">
          <IonButton
            fill="clear"
            color="light"
            className="profile-icon"
            onClick={() => history.push("/edit-profile")}
          >
            <IonIcon icon={personCircleOutline} size="large" />
          </IonButton>
          
          <div className="aura-logo">
            <IonIcon icon={flash} className="logo-icon" />
            <span>Aura</span>
          </div>

          <IonButton
            fill="clear"
            color="light"
            className="logout-button"
            onClick={handleLogout}
          >
            Déconnexion
          </IonButton>
        </div>

        {/* Container des cartes */}
        <div className="tinder-container">{renderCards}</div>

        {/* Actions */}
        <div className="actions">
          <IonButton 
            color="light" 
            onClick={() => swipe("left")} 
            className="action-button nope"
          >
            <IonIcon icon={close} />
          </IonButton>
          <IonButton 
            color="light" 
            onClick={() => swipe("right")} 
            className="action-button like"
          >
            <IonIcon icon={heart} />
          </IonButton>
        </div>
      </IonContent>

      <style>{`
        .dashboard-content {
          --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        /* Top Bar */
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .aura-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 24px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .logo-icon {
          font-size: 28px;
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .profile-icon, .logout-button {
          --color: white;
          --background-hover: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }

        /* Container des cartes */
        .tinder-container {
          position: relative;
          width: 100%;
          height: 65vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }

        /* Cartes */
        .tinder-card {
          position: absolute;
          width: 90%;
          max-width: 400px;
          height: 500px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.15),
            0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: grab;
        }

        .tinder-card:active {
          cursor: grabbing;
        }

        .profile-image {
          width: 100%;
          height: 70%;
          object-fit: cover;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
        }

        .profile-info {
          padding: 20px;
          color: #2d3748;
        }

        .profile-info h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
        }

        .profile-info p {
          margin: 0 0 12px 0;
          color: #718096;
          line-height: 1.4;
        }

        .distance {
          color: #667eea;
          font-weight: 600;
          font-size: 14px;
        }

        .interests {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .interest-tag {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Actions */
        .actions {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding: 20px;
          margin-top: 20px;
        }

        .action-button {
          width: 70px;
          height: 70px;
          --border-radius: 50%;
          --box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-button:hover {
          transform: scale(1.1);
          --box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .action-button.nope {
          --background: rgba(239, 68, 68, 0.9);
          --background-hover: rgba(239, 68, 68, 1);
        }

        .action-button.like {
          --background: rgba(16, 185, 129, 0.9);
          --background-hover: rgba(16, 185, 129, 1);
        }

        /* Cercles d'arrière-plan */
        .dashboard-content::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          filter: blur(2px);
          animation: float-subtle 20s ease-in-out infinite;
        }

        .dashboard-content::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          filter: blur(2px);
          animation: float-subtle 18s ease-in-out infinite reverse;
        }

        @keyframes float-subtle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -20px) rotate(120deg); }
          66% { transform: translate(-20px, 10px) rotate(240deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tinder-card {
            width: 95%;
            height: 450px;
          }

          .actions {
            gap: 30px;
          }

          .action-button {
            width: 60px;
            height: 60px;
          }
        }

        @media (max-width: 480px) {
          .top-bar {
            padding: 12px 16px;
          }

          .aura-logo {
            font-size: 20px;
          }

          .tinder-card {
            height: 400px;
          }

          .profile-info {
            padding: 16px;
          }

          .profile-info h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </IonApp>
  );
};

export default DashboardPage;