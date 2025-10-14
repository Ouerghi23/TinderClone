import React, { useState } from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonLabel,
  IonLoading,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from "@ionic/react";
import { heart, flame, person } from "ionicons/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("❌ Veuillez remplir tous les champs");
      return;
    }

    if (!email.includes("@")) {
      setMessage("❌ Format d'email invalide");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Connexion réussie !");
      setTimeout(() => {
        history.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      if (error.code === "auth/invalid-email") {
        setMessage("❌ Adresse email invalide");
      } else if (error.code === "auth/user-not-found") {
        setMessage("❌ Aucun utilisateur trouvé avec cet email");
      } else if (error.code === "auth/wrong-password") {
        setMessage("❌ Mot de passe incorrect");
      } else if (error.code === "auth/too-many-requests") {
        setMessage("❌ Trop de tentatives. Veuillez réessayer plus tard");
      } else {
        setMessage("❌ Erreur de connexion: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <IonPage style={{
      background: 'linear-gradient(135deg, #fd297b 0%, #ff5864 50%, #ff655b 100%)'
    }}>
      <IonHeader translucent style={{ background: 'transparent' }}>
        <IonToolbar style={{ '--background': 'transparent', '--color': 'white' }}>
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
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding" style={{
        '--background': 'transparent'
      }}>
        <IonGrid style={{ height: '100%' }}>
          <IonRow className="ion-justify-content-center" style={{ height: '100%' }}>
            <IonCol size="12" size-md="8" size-lg="6" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              height: '100%'
            }}>
              
              {/* Header avec icône */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '40px',
                color: 'white'
              }}>
                <IonIcon 
                  icon={heart} 
                  style={{ 
                    fontSize: '60px', 
                    color: 'white',
                    marginBottom: '20px'
                  }} 
                />
                <h1 style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  margin: '0 0 10px 0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Bienvenue
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  opacity: 0.9,
                  margin: 0
                }}>
                  Connectez-vous pour trouver des matches
                </p>
              </div>

              {/* Formulaire */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px 25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <IonItem style={{
                  '--background': 'transparent',
                  '--border-color': 'rgba(255, 87, 100, 0.3)',
                  '--border-radius': '12px',
                  marginBottom: '20px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    <IonIcon icon={person} style={{ marginRight: '8px' }} />
                    Email
                  </IonLabel>
                  <IonInput 
                    type="email" 
                    value={email} 
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    style={{
                      '--color': '#333',
                      '--padding-start': '10px'
                    }}
                  />
                </IonItem>
                
                <IonItem style={{
                  '--background': 'transparent',
                  '--border-color': 'rgba(255, 87, 100, 0.3)',
                  '--border-radius': '12px',
                  marginBottom: '30px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    🔒 Mot de passe
                  </IonLabel>
                  <IonInput 
                    type="password" 
                    value={password} 
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    style={{
                      '--color': '#333',
                      '--padding-start': '10px'
                    }}
                  />
                </IonItem>
                
                <IonButton 
                  expand="block" 
                  onClick={handleLogin} 
                  disabled={loading}
                  style={{
                    '--background': 'linear-gradient(45deg, #fd297b 0%, #ff5864 100%)',
                    '--background-hover': 'linear-gradient(45deg, #ff5864 0%, #fd297b 100%)',
                    '--border-radius': '50px',
                    '--box-shadow': '0 4px 15px rgba(253, 41, 123, 0.4)',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                  }}
                >
                  {loading ? "Connexion..." : "Se connecter 🔥"}
                </IonButton>

                {/* Lien vers inscription */}
                <div style={{ textAlign: 'center' }}>
                  <IonButton 
                    fill="clear" 
                    onClick={() => history.push("/register")}
                    disabled={loading}
                    style={{
                      '--color': '#ff5764',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Pas de compte ? S'inscrire
                  </IonButton>
                </div>

                {/* Message d'erreur/succès */}
                {message && (
                  <IonText color={message.includes("✅") ? "success" : "danger"}>
                    <p style={{ 
                      textAlign: 'center', 
                      marginTop: '20px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: message.includes("✅") ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: message.includes("✅") ? '#4caf50' : '#ff5764',
                      fontWeight: '500'
                    }}>
                      {message}
                    </p>
                  </IonText>
                )}
              </div>

              {/* Footer */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '30px',
                color: 'white',
                opacity: 0.8
              }}>
                <p style={{ fontSize: '12px', margin: 0 }}>
                  En vous connectant, vous acceptez nos Conditions d'utilisation
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading 
          isOpen={loading} 
          message="Connexion en cours..." 
          spinner="crescent"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;