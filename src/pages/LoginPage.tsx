import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonInput
} from "@ionic/react";
import { mail, lockClosed, flameSharp, arrowForward, logoGoogle } from "ionicons/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "../theme/LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Tous les champs sont requis");
      return;
    }
    if (!email.includes("@")) {
      setMessage("Format d'email invalide");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        history.push("/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      switch (error.code) {
        case "auth/invalid-email":
          setMessage("Adresse email invalide");
          break;
        case "auth/user-not-found":
          setMessage("Aucun compte trouvé avec cet email");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setMessage("Email ou mot de passe incorrect");
          break;
        case "auth/too-many-requests":
          setMessage("Trop de tentatives. Réessayez plus tard");
          break;
        default:
          setMessage("Erreur de connexion. Veuillez réessayer");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
      
        <div className="gradient-bg"></div>

      
        <div className="animated-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <IonGrid className="main-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol size="12" sizeMd="8" sizeLg="5" sizeXl="4">
             
              <div className="logo-header">
                <div className="flame-container">
                  <IonIcon icon={flameSharp} className="flame-logo" />
                </div>
                <h1 className="app-name">Aura</h1>
                <div className="divider-line"></div>
              </div>

              <div className="main-title-section">
                <h2 className="login-title">Bon retour !</h2>
                <p className="login-subtitle">
                  Connectez-vous pour continuer votre aventure
                </p>
              </div>

             
              <div className="form-wrapper">
             
                <div className="input-field">
                  <div className="input-icon">
                    <IonIcon icon={mail} />
                  </div>
                  <IonInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="custom-ion-input"
                  />
                </div>

               
                <div className="input-field">
                  <div className="input-icon">
                    <IonIcon icon={lockClosed} />
                  </div>
                  <IonInput
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="custom-ion-input"
                  />
                </div>

                <div className="forgot-password">
                  <IonButton
                    fill="clear"
                    onClick={() => history.push("/forgot-password")}
                    className="forgot-btn"
                    disabled={loading}
                  >
                    Mot de passe oublié ?
                  </IonButton>
                </div>

               
                {message && (
                  <div className="error-banner">
                    <span>{message}</span>
                  </div>
                )}

              
                <IonButton
                  expand="block"
                  onClick={handleLogin}
                  disabled={loading}
                  className="login-btn"
                >
                  {loading ? "Connexion..." : "SE CONNECTER"}
                  {!loading && (
                    <IonIcon
                      icon={arrowForward}
                      slot="end"
                      className="arrow-icon"
                    />
                  )}
                </IonButton>

                <div className="divider">
                  <span>OU</span>
                </div>

                <IonButton
                  expand="block"
                  fill="outline"
                  className="social-btn google-btn"
                  disabled={loading}
                >
                  <IonIcon icon={logoGoogle} slot="start" className="social-icon" />
                  Continuer avec Google
                </IonButton>

                
                <IonButton
                  expand="block"
                  fill="outline"
                  className="signup-btn"
                  onClick={() => history.push("/register")}
                  disabled={loading}
                >
                  Créer un nouveau compte
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>


        <IonLoading
          isOpen={loading}
          message="Connexion en cours..."
          spinner="crescent"
          cssClass="custom-loader"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
