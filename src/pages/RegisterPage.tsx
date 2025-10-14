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
  IonAlert,
  IonIcon
} from "@ionic/react";
import { person, mail, lockClosed, sparkles } from "ionicons/icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const history = useHistory();

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
      setMessage("❌ Veuillez remplir tous les champs");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("❌ Format d'email invalide");
      return false;
    }

    if (password.length < 6) {
      setMessage("❌ Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim()
        });
      }

      setShowSuccessAlert(true);
      
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      
      if (error.code === "auth/email-already-in-use") {
        setMessage("❌ Cet email est déjà utilisé");
      } else if (error.code === "auth/invalid-email") {
        setMessage("❌ Adresse email invalide");
      } else if (error.code === "auth/weak-password") {
        setMessage("❌ Le mot de passe est trop faible");
      } else if (error.code === "auth/operation-not-allowed") {
        setMessage("❌ L'inscription par email/mot de passe n'est pas activée");
      } else {
        setMessage("❌ Erreur lors de l'inscription: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessAlert = () => {
    setShowSuccessAlert(false);
    history.push("/login");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
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
            <IonIcon icon={sparkles} style={{ 
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
                marginBottom: '30px',
                color: 'white'
              }}>
                <IonIcon 
                  icon={sparkles} 
                  style={{ 
                    fontSize: '60px', 
                    color: 'white',
                    marginBottom: '15px'
                  }} 
                />
                <h1 style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  margin: '0 0 10px 0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Rejoignez-nous
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  opacity: 0.9,
                  margin: 0
                }}>
                  Créez votre compte pour commencer l'aventure
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
                  marginBottom: '15px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    <IonIcon icon={person} style={{ marginRight: '8px' }} />
                    Nom d'affichage
                  </IonLabel>
                  <IonInput 
                    type="text" 
                    value={displayName} 
                    onIonChange={(e) => setDisplayName(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    style={{
                      '--color': '#333',
                      '--padding-start': '10px'
                    }}
                    placeholder="Comment voulez-vous qu'on vous appelle ?"
                  />
                </IonItem>
                
                <IonItem style={{
                  '--background': 'transparent',
                  '--border-color': 'rgba(255, 87, 100, 0.3)',
                  '--border-radius': '12px',
                  marginBottom: '15px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    <IonIcon icon={mail} style={{ marginRight: '8px' }} />
                    Email *
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
                  marginBottom: '15px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    <IonIcon icon={lockClosed} style={{ marginRight: '8px' }} />
                    Mot de passe *
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
                
                <IonItem style={{
                  '--background': 'transparent',
                  '--border-color': 'rgba(255, 87, 100, 0.3)',
                  '--border-radius': '12px',
                  marginBottom: '25px'
                }}>
                  <IonLabel position="floating" style={{
                    color: '#ff5764',
                    fontWeight: '500'
                  }}>
                    🔒 Confirmer le mot de passe *
                  </IonLabel>
                  <IonInput 
                    type="password" 
                    value={confirmPassword} 
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    style={{
                      '--color': '#333',
                      '--padding-start': '10px'
                    }}
                  />
                </IonItem>

                {/* Indication mot de passe */}
                <div style={{
                  background: 'rgba(255, 87, 100, 0.1)',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 87, 100, 0.2)'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#ff5764',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    🔒 Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>
                
                <IonButton 
                  expand="block" 
                  onClick={handleRegister} 
                  disabled={loading}
                  style={{
                    '--background': 'linear-gradient(45deg, #fd297b 0%, #ff5864 100%)',
                    '--background-hover': 'linear-gradient(45deg, #ff5864 0%, #fd297b 100%)',
                    '--border-radius': '50px',
                    '--box-shadow': '0 4px 15px rgba(253, 41, 123, 0.4)',
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}
                >
                  {loading ? "Création en cours..." : "Créer mon compte ✨"}
                </IonButton>

                {/* Lien vers connexion */}
                <div style={{ textAlign: 'center' }}>
                  <IonButton 
                    fill="clear" 
                    onClick={() => history.push("/login")}
                    disabled={loading}
                    style={{
                      '--color': '#ff5764',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Déjà un compte ? Se connecter
                  </IonButton>
                </div>

                {/* Message d'erreur/succès */}
                {message && (
                  <IonText>
                    <p style={{ 
                      textAlign: 'center', 
                      marginTop: '20px',
                      padding: '12px',
                      borderRadius: '10px',
                      background: message.includes("✅") ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: message.includes("✅") ? '#4caf50' : '#ff5764',
                      fontWeight: '500',
                      border: message.includes("✅") ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)'
                    }}>
                      {message}
                    </p>
                  </IonText>
                )}
              </div>

              {/* Footer */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '25px',
                color: 'white',
                opacity: 0.8
              }}>
                <p style={{ fontSize: '12px', margin: 0 }}>
                  En créant un compte, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading 
          isOpen={loading} 
          message="Création de votre compte..." 
          spinner="crescent"
        />

        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={handleSuccessAlert}
          header="🎉 Compte créé avec succès !"
          message="Votre compte a été créé. Vous allez être redirigé vers la page de connexion pour vous connecter."
          buttons={[
            {
              text: 'OK',
              handler: handleSuccessAlert,
              cssClass: 'tinder-button'
            }
          ]}
          cssClass="tinder-alert"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;