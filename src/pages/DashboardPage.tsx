import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { 
  IonPage, 
  IonHeader, 
  IonTitle, 
  IonContent, 
  IonToolbar, 
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonChip,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from "@ionic/react";
import { 
  person, 
  flame, 
  chatbubble, 
  star, 
  close, 
  heart, 
  flash,
  settings
} from "ionicons/icons";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import "../theme/DashboardPage.css";

const DashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const history = useHistory();

  // Données fictives pour simuler des profils (à remplacer par Firestore)
  const mockProfiles = [
    {
      id: 1,
      name: "Sarah",
      age: 25,
      bio: "J'aime les voyages et la bonne cuisine 🍝✈️",
      distance: "2 km",
      images: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      interests: ["Voyage", "Cuisine", "Photographie"]
    },
    {
      id: 2,
      name: "Emma",
      age: 27,
      bio: "Artiste passionnée 🎨 | Amoureuse de la nature 🌿",
      distance: "5 km",
      images: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      interests: ["Art", "Nature", "Yoga"]
    },
    {
      id: 3,
      name: "Léa",
      age: 24,
      bio: "Sportive et aventurière 🏃‍♀️⛰️",
      distance: "3 km",
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      interests: ["Sport", "Aventure", "Musique"]
    },
    {
      id: 4,
      name: "Chloé",
      age: 26,
      bio: "Développeuse le jour, danseuse la nuit 💃👩‍💻",
      distance: "4 km",
      images: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      interests: ["Danse", "Tech", "Cinéma"]
    }
  ];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Pour l'instant on utilise les données fictives
        setProfiles(mockProfiles);
        
        // Récupérer le profil utilisateur
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
        setProfiles(mockProfiles); // Fallback sur données fictives
      }
    };
    
    fetchProfiles();
  }, []);

  const swiped = (direction: string, name: string, id: number) => {
    console.log(`You swiped ${direction} on ${name}`);
    setLastDirection(direction);
    setCurrentIndex(currentIndex + 1);
    
    if (direction === 'right') {
      // Simuler un match
      const matchedProfile = profiles.find(p => p.id === id);
      if (matchedProfile && Math.random() > 0.7) { // 30% de chance de match
        setMatches(prev => [...prev, matchedProfile]);
      }
    }
  };

  const outOfFrame = (name: string) => {
    console.log(`${name} left the screen!`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push("/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const swipe = async (dir: string) => {
    if (currentIndex < profiles.length) {
      const card = document.querySelector('.swipe') as HTMLElement;
      if (card) {
        card.style.transform = `translate(${dir === 'right' ? '200%' : '-200%'}, 0px) rotate(${dir === 'right' ? '20deg' : '-20deg'})`;
        setTimeout(() => {
          swiped(dir, profiles[currentIndex].name, profiles[currentIndex].id);
        }, 300);
      }
    }
  };

  return (
    <IonPage style={{
      background: 'linear-gradient(135deg, #fd297b 0%, #ff5864 50%, #ff655b 100%)'
    }}>
      {/* Header */}
      <IonHeader translucent style={{ background: 'transparent' }}>
        <IonToolbar style={{ 
          '--background': 'transparent', 
          '--color': 'white',
          '--border-width': '0'
        }}>
          <IonButtons slot="start">
            <IonButton onClick={handleLogout} style={{ '--color': 'white' }}>
              <IonIcon icon={person} slot="icon-only" />
            </IonButton>
          </IonButtons>
          
          <IonTitle style={{ 
            textAlign: 'center', 
            fontSize: '28px', 
            fontWeight: 'bold',
            letterSpacing: '-0.5px'
          }}>
            <IonIcon icon={flame} style={{ 
              marginRight: '8px',
              color: '#ffffff',
              fontSize: '32px'
            }} />
            Spark
          </IonTitle>

          <IonButtons slot="end">
            <IonButton routerLink="/matches" style={{ '--color': 'white' }}>
              <IonIcon icon={chatbubble} slot="icon-only" />
              {matches.length > 0 && (
                <IonBadge color="danger" style={{ 
                  position: 'absolute', 
                  top: '0px', 
                  right: '0px',
                  fontSize: '10px'
                }}>
                  {matches.length}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': 'transparent' }}>
        <div className="dashboard-container">
          {/* Zone des cartes Tinder */}
          <div className="tinder-cards">
            {profiles.map((profile, index) => (
              <TinderCard
                key={profile.id}
                className="swipe"
                onSwipe={(dir) => swiped(dir, profile.name, profile.id)}
                onCardLeftScreen={() => outOfFrame(profile.name)}
                preventSwipe={['up', 'down']}
              >
                <div
                  style={{ backgroundImage: `url(${profile.images[0]})` }}
                  className="tinder-card"
                >
                  {/* Overlay avec infos */}
                  <div className="card-overlay">
                    <div className="card-info">
                      <h2 className="profile-name">
                        {profile.name}, <span className="profile-age">{profile.age}</span>
                      </h2>
                      <p className="profile-bio">{profile.bio}</p>
                      <div className="profile-distance">
                        <IonIcon icon={flash} style={{ marginRight: '5px' }} />
                        {profile.distance}
                      </div>
                      
                      {/* Intérêts */}
                      <div className="interests-container">
                        {profile.interests.map((interest: string, i: number) => (
                          <IonChip 
                            key={i}
                            className="interest-chip"
                          >
                            {interest}
                          </IonChip>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge Like/Dislike pendant le swipe */}
                  <div className={`swipe-indicator like-indicator ${lastDirection === 'right' && index === currentIndex - 1 ? 'visible' : ''}`}>
                    LIKE
                  </div>
                  <div className={`swipe-indicator dislike-indicator ${lastDirection === 'left' && index === currentIndex - 1 ? 'visible' : ''}`}>
                    NOPE
                  </div>
                </div>
              </TinderCard>
            ))}
            
            {/* Message quand plus de profils */}
            {currentIndex >= profiles.length && (
              <div className="no-more-profiles">
                <IonIcon icon={star} style={{ fontSize: '60px', color: 'white', marginBottom: '20px' }} />
                <h2 style={{ color: 'white', textAlign: 'center' }}>
                  Plus de profils pour le moment !
                </h2>
                <p style={{ color: 'white', textAlign: 'center', opacity: 0.8 }}>
                  Revenez plus tard pour découvrir de nouvelles personnes
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="action-buttons">
            <IonButton 
              className="action-button dislike-button"
              onClick={() => swipe('left')}
              disabled={currentIndex >= profiles.length}
            >
              <IonIcon icon={close} />
            </IonButton>
            
            <IonButton 
              className="action-button super-like-button"
              disabled={currentIndex >= profiles.length}
            >
              <IonIcon icon={star} />
            </IonButton>
            
            <IonButton 
              className="action-button like-button"
              onClick={() => swipe('right')}
              disabled={currentIndex >= profiles.length}
            >
              <IonIcon icon={heart} />
            </IonButton>
          </div>
        </div>

        {/* Fab pour les paramètres */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            size="small" 
            style={{ 
              '--background': 'rgba(255, 255, 255, 0.2)',
              '--color': 'white'
            }}
            routerLink="/profile"
          >
            <IonIcon icon={settings} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;