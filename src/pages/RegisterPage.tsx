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
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonIcon
} from "@ionic/react";
import { person, mail, lockClosed, heart, sparkles } from "ionicons/icons"; // Ajout de 'heart' pour la touche douce
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

// Définition des couleurs du thème rosé
const PRIMARY_ROSE = "#E91E63"; // Rose framboise
const LIGHT_ROSE = "#FFC0CB"; // Rose clair
const GRADIENT_START = "#f093fb"; // Rose pastel
const GRADIENT_END = "#f5576c"; // Corail
const TEXT_COLOR = "#4A4A4A"; // Gris foncé

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
      background: `linear-gradient(135deg, ${GRADIENT_START} 0%, ${GRADIENT_END} 100%)` // Dégradé rosé
    }}>
      <IonHeader translucent style={{ background: 'transparent' }}>
        <IonToolbar style={{ '--background': 'transparent', '--color': 'white' }}>
          <IonTitle style={{ 
            textAlign: 'center', 
            fontSize: '26px', 
            fontWeight: '700',
            letterSpacing: '-0.3px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <IonIcon icon={heart} style={{ // Icône coeur pour le thème rose
              marginRight: '8px',
              color: '#ffffff',
              fontSize: '28px',
              opacity: 0.95
            }} />
            Aura
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding" style={{
        '--background': 'transparent'
      }}>
        {/* Cercles d'arrière-plan */}
        <div className="background-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>

      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol size="12" size-md="8" size-lg="6" className="ion-align-self-center">

              {/* Header avec icône */}
              <div className="register-header-content fade-in-up">
                <div className="icon-wrapper">
                  <IonIcon 
                    icon={heart} // Icône coeur
                    className="main-icon"
                  />
                </div>
                <h1 className="main-title">
                  Rejoignez Aura
                </h1>
                <p className="subtitle">
                  Créez votre compte pour découvrir des connexions authentiques
                </p>
              </div>

              {/* Formulaire */}
              <div className="form-container scale-in">
                <div className="input-wrapper">
                  <IonItem className="custom-item">
                    <IonLabel position="stacked" className="custom-label">
                      <IonIcon icon={person} className="input-icon" />
                      Nom d'affichage
                    </IonLabel>
                    <IonInput 
                      type="text" 
                      value={displayName} 
                      onIonChange={(e) => setDisplayName(e.detail.value!)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="custom-input"
                      placeholder="Comment voulez-vous qu'on vous appelle ?"
                    />
                  </IonItem>
                </div>
                
                <div className="input-wrapper">
                  <IonItem className="custom-item">
                    <IonLabel position="stacked" className="custom-label">
                      <IonIcon icon={mail} className="input-icon" />
                      Email *
                    </IonLabel>
                    <IonInput 
                      type="email" 
                      value={email} 
                      onIonChange={(e) => setEmail(e.detail.value!)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="custom-input"
                    />
                  </IonItem>
                </div>
                
                <div className="input-wrapper">
                  <IonItem className="custom-item">
                    <IonLabel position="stacked" className="custom-label">
                      <IonIcon icon={lockClosed} className="input-icon" />
                      Mot de passe *
                    </IonLabel>
                    <IonInput 
                      type="password" 
                      value={password} 
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="custom-input"
                    />
                  </IonItem>
                </div>
                
                <div className="input-wrapper">
                  <IonItem className="custom-item">
                    <IonLabel position="stacked" className="custom-label">
                      <IonIcon icon={lockClosed} className="input-icon" />
                      Confirmer le mot de passe *
                    </IonLabel>
                    <IonInput 
                      type="password" 
                      value={confirmPassword} 
                      onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="custom-input"
                    />
                  </IonItem>
                </div>

                {/* Info sécurité */}
                <div className="security-info">
                  <p>🔒 Le mot de passe doit contenir au moins 6 caractères</p>
                </div>
                
                <IonButton 
                  expand="block" 
                  onClick={handleRegister} 
                  disabled={loading}
                  className="register-button"
                >
                  <span className="button-text">
                    {loading ? "Création en cours..." : "Créer mon compte"}
                  </span>
                </IonButton>

                {/* Lien vers connexion */}
                <div className="login-link-container">
                  <IonButton 
                    fill="clear" 
                    onClick={() => history.push("/login")}
                    disabled={loading}
                    className="login-link-button"
                  >
                    Déjà un compte ? <strong>Se connecter</strong>
                  </IonButton>
                </div>

                {/* Message d'erreur/succès */}
                {message && (
                  <div className={`message-box ${message.includes("✅") ? "success" : "error"}`}>
                    {message}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="register-footer fade-in-up-delay">
                <p>
                  En créant un compte, vous acceptez nos <strong>Conditions d'utilisation</strong><br />
                  et notre <strong>Politique de confidentialité</strong>
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading 
          isOpen={loading} 
          message="Création de votre compte..." 
          spinner="crescent"
          cssClass="custom-loading"
        />

        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={handleSuccessAlert}
          header="💖 Bienvenue sur Aura !" // Icône coeur
          message="Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion."
          buttons={[
            {
              text: 'Commencer',
              handler: handleSuccessAlert,
              cssClass: 'alert-button-confirm'
            }
          ]}
          cssClass="custom-alert"
        />
      </IonContent>

      <style>{`
        /* ---------------------------------------------------- */
        /* NOUVEAUX STYLES CSS POUR THÈME ROSÉ ET ADOUCI */
        /* ---------------------------------------------------- */

        .register-header-content {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }

        .icon-wrapper {
          margin-bottom: 16px;
        }

        .main-icon {
          font-size: 56px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
          opacity: 0.95;
          color: ${LIGHT_ROSE}; /* Couleur claire pour l'icône sur fond foncé */
        }

        .main-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.5px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          opacity: 0.95;
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.85;
          margin: 0;
          font-weight: 400;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          letter-spacing: 0.1px;
          line-height: 1.5;
        }

        .form-container {
          background: rgba(255, 255, 255, 0.95); /* Légèrement plus opaque */
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.1), /* Ombre plus douce */
                      inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7); /* Bordure plus douce */
          margin-bottom: 20px;
        }

        .input-wrapper {
          margin-bottom: 20px;
          position: relative;
        }

        .custom-item {
          --background: rgba(255, 250, 250, 0.8); /* Fond blanc/rose très léger */
          --border-radius: 14px;
          --padding-start: 16px;
          --padding-end: 16px;
          --inner-padding-end: 12px;
          --min-height: 56px;
          border: 1.2px solid #ffe4e6; /* Bordure rose très claire */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          backdrop-filter: blur(10px);
        }

        .custom-item:hover {
          border-color: ${PRIMARY_ROSE}40; /* Rose transparent au survol */
          --background: rgba(255, 255, 255, 0.95);
        }

        .custom-label {
          color: ${TEXT_COLOR} !important;
          font-weight: 500;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.1px;
        }

        .input-icon {
          font-size: 16px;
          opacity: 0.7;
          color: ${PRIMARY_ROSE}; /* Icônes en rose */
        }

        .custom-input {
          --color: ${TEXT_COLOR};
          --padding-start: 0;
          --padding-top: 18px;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.1px;
        }

        .security-info {
          /* Conserve un fond blanc/rose très clair pour la cohérence */
          background: rgba(255, 250, 250, 0.9); 
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(233, 30, 99, 0.1); /* Bordure rose légère */
        }

        .security-info p {
          margin: 0;
          font-size: 13px;
          color: ${TEXT_COLOR}99;
          text-align: center;
          font-weight: 500;
          letter-spacing: 0.1px;
          line-height: 1.4;
        }

        .register-button {
          --background: linear-gradient(135deg, ${PRIMARY_ROSE} 0%, ${GRADIENT_END} 100%); /* Dégradé de bouton rosé */
          --background-hover: linear-gradient(135deg, #c41852 0%, #d44d5c 100%);
          --border-radius: 14px;
          --box-shadow: 0 8px 30px rgba(233, 30, 99, 0.2); /* Ombre rosée */
          height: 56px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          letter-spacing: 0.2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .register-button:hover {
          transform: translateY(-2px);
          --box-shadow: 0 12px 40px rgba(233, 30, 99, 0.3);
        }

        .login-link-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .login-link-button {
          --color: ${TEXT_COLOR}a0;
          font-size: 14px;
          font-weight: 500;
          text-transform: none;
          letter-spacing: 0.1px;
        }

        .login-link-button:hover {
          --color: ${PRIMARY_ROSE};
        }

        .login-link-button strong {
          font-weight: 600;
          color: ${PRIMARY_ROSE}; /* Lien en rose primaire */
        }

        .message-box.error {
          background: rgba(254, 242, 242, 0.9);
          color: #991b1b;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        /* Ajustement du message de succès pour le rose */
        .message-box.success {
          background: rgba(255, 240, 245, 0.9); /* Rose très très clair */
          color: #c084fc; /* Tonalité douce de violet/rose */
          border: 1px solid rgba(233, 30, 99, 0.2); 
        }


        .register-footer {
          text-align: center;
          margin-top: 32px;
          color: white;
          opacity: 0.8;
        }

        .register-footer strong {
          font-weight: 500;
          opacity: 0.95; /* Légèrement plus visible */
        }

        /* Les cercles d'arrière-plan restent efficaces pour l'effet de flou sur le dégradé */

        .custom-loading {
          --background: rgba(0, 0, 0, 0.65);
          --spinner-color: ${PRIMARY_ROSE}; /* Spinner en rose */
          backdrop-filter: blur(4px);
        }

        .custom-alert {
          --background: white;
          --max-width: 300px;
          border-radius: 16px;
        }

        .alert-button-confirm {
          color: ${PRIMARY_ROSE} !important; /* Bouton d'alerte en rose */
          font-weight: 700 !important;
          font-size: 15px !important;
        }

        /* Animations restent les mêmes */

      `}</style>
    </IonPage>
  );
};

export default RegisterPage;