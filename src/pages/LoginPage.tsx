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
  IonIcon
} from "@ionic/react";
import { mail, lockClosed, heart, sparkles } from "ionicons/icons"; // Utilisé heart et sparkles pour la cohérence
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

// Définition des couleurs du thème rosé (identiques à la page Register)
const PRIMARY_ROSE = "#E91E63"; // Rose framboise
const LIGHT_ROSE = "#FFC0CB"; // Rose clair
const GRADIENT_START = "#f093fb"; // Rose pastel
const GRADIENT_END = "#f5576c"; // Corail
const TEXT_COLOR = "#4A4A4A"; // Gris foncé

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
      background: `linear-gradient(135deg, ${GRADIENT_START} 0%, ${GRADIENT_END} 100%)` // Dégradé rosé
    }}>
      <IonHeader translucent className="ion-no-border" style={{ background: 'transparent' }}>
        <IonToolbar style={{ '--background': 'transparent', '--color': 'white' }}>
          <IonTitle style={{ 
            textAlign: 'center', 
            fontSize: '26px', 
            fontWeight: '700',
            letterSpacing: '-0.3px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <IonIcon icon={heart} style={{ 
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
        
        {/* Cercles d'arrière-plan (pour l'effet de flou) */}
        <div className="background-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>

        {/* Grille responsive et centrée */}
        <IonGrid className="login-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12" size-md="8" size-lg="6" className="ion-align-self-center">
              
              {/* Header de la page */}
              <div className="login-header-content fade-in-up">
                <div className="icon-wrapper">
                  <IonIcon 
                    icon={heart} 
                    className="main-icon"
                  />
                </div>
                <h1 className="main-title">
                  Heureux de vous revoir
                </h1>
                <p className="subtitle">
                  Entrez vos identifiants pour vous reconnecter
                </p>
              </div>

              {/* Formulaire (Carte vitrée) */}
              <div className="form-container scale-in">
                
                <div className="input-wrapper">
                  <IonItem className="custom-item">
                    <IonLabel position="stacked" className="custom-label">
                      <IonIcon icon={mail} className="input-icon" />
                      Email
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
                      Mot de passe
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
                
                <IonButton 
                  expand="block" 
                  onClick={handleLogin} 
                  disabled={loading}
                  className="login-button"
                >
                  <span className="button-text">
                    {loading ? "Connexion..." : "Se connecter 💖"}
                  </span>
                </IonButton>

                {/* Lien vers inscription */}
                <div className="register-link-container">
                  <IonButton 
                    fill="clear" 
                    onClick={() => history.push("/register")}
                    disabled={loading}
                    className="register-link-button"
                  >
                    Pas de compte ? <strong>Créer un compte</strong>
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
              <div className="login-footer fade-in-up-delay">
                <p>
                  En vous connectant, vous acceptez nos <strong>Conditions d'utilisation</strong>
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading 
          isOpen={loading} 
          message="Connexion en cours..." 
          spinner="crescent"
          cssClass="custom-loading"
        />
      </IonContent>

      <style>{`
        /* ---------------------------------------------------- */
        /* STYLES GÉNÉRAUX ET THÈME ROSÉ */
        /* ---------------------------------------------------- */

        .login-grid {
            /* Retirer les styles de hauteur fixe pour permettre le défilement */
            height: auto; 
        }

        .ion-align-items-center {
            /* Assure le centrage vertical uniquement s'il y a de l'espace, sinon permet le scroll */
            min-height: 100%;
        }

        .login-header-content {
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
          background: rgba(255, 255, 255, 0.95); /* Effet vitré */
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
        }

        .input-wrapper {
          margin-bottom: 20px;
          position: relative;
        }
        
        /* Styles des champs de saisie (Item/Label/Input) */
        .custom-item {
          --background: rgba(255, 250, 250, 0.8);
          --border-radius: 14px;
          --padding-start: 16px;
          --padding-end: 16px;
          --inner-padding-end: 12px;
          --min-height: 56px;
          border: 1.2px solid #ffe4e6; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          backdrop-filter: blur(10px);
        }

        .custom-item:hover {
          border-color: ${PRIMARY_ROSE}40;
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
          color: ${PRIMARY_ROSE};
        }

        .custom-input {
          --color: ${TEXT_COLOR};
          --padding-start: 0;
          --padding-top: 18px;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.1px;
        }

        /* Bouton de connexion */
        .login-button {
          --background: linear-gradient(135deg, ${PRIMARY_ROSE} 0%, ${GRADIENT_END} 100%);
          --background-hover: linear-gradient(135deg, #c41852 0%, #d44d5c 100%);
          --border-radius: 14px;
          --box-shadow: 0 8px 30px rgba(233, 30, 99, 0.2);
          height: 56px; /* Taille cohérente avec le bouton de la page Register */
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          letter-spacing: 0.2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .login-button:hover {
          transform: translateY(-2px);
          --box-shadow: 0 12px 40px rgba(233, 30, 99, 0.3);
        }

        /* Lien d'inscription */
        .register-link-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .register-link-button {
          --color: ${TEXT_COLOR}a0;
          font-size: 14px;
          font-weight: 500;
          text-transform: none;
          letter-spacing: 0.1px;
        }

        .register-link-button:hover {
          --color: ${PRIMARY_ROSE};
        }

        .register-link-button strong {
          font-weight: 600;
          color: ${PRIMARY_ROSE};
        }
        
        /* Message d'erreur/succès */
        .message-box {
          text-align: center;
          margin-top: 20px;
          padding: 14px 16px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14px;
          animation: message-slide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.1px;
          line-height: 1.4;
        }

        .message-box.success {
          background: rgba(255, 240, 245, 0.9);
          color: #c084fc;
          border: 1px solid rgba(233, 30, 99, 0.2); 
        }

        .message-box.error {
          background: rgba(254, 242, 242, 0.9);
          color: #991b1b;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 32px;
          color: white;
          opacity: 0.8;
        }

        .login-footer p {
          font-size: 12px;
          margin: 0;
          line-height: 1.6;
          letter-spacing: 0.1px;
          font-weight: 400;
        }

        .login-footer strong {
          font-weight: 500;
          opacity: 0.95;
        }
        
        /* ---------------------------------------------------- */
        /* ANIMATIONS ET CERCLES D'ARRIÈRE-PLAN */
        /* (Repris de la page Register pour la cohérence) */
        /* ---------------------------------------------------- */
        .background-circles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          opacity: 0.4;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          filter: blur(1.5px);
        }

        .circle-1 {
          width: 320px;
          height: 320px;
          top: -100px;
          right: -100px;
          animation: float-subtle 20s ease-in-out infinite;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -60px;
          left: -60px;
          animation: float-subtle 18s ease-in-out infinite reverse;
          animation-delay: 3s;
        }

        .circle-3 {
          width: 140px;
          height: 140px;
          top: 30%;
          left: 70%;
          animation: float-subtle 15s ease-in-out infinite;
          animation-delay: 6s;
        }

        @keyframes float-subtle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -20px) rotate(120deg); }
          66% { transform: translate(-20px, 10px) rotate(240deg); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes message-slide {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }


        .fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .fade-in-up-delay { animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards; }
        .scale-in { animation: scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards; }
        
        .custom-loading {
          --background: rgba(0, 0, 0, 0.65);
          --spinner-color: ${PRIMARY_ROSE};
          backdrop-filter: blur(4px);
        }
      `}</style>
    </IonPage>
  );
};

export default LoginPage;