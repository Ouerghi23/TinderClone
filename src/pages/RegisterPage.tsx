import React, { useState } from "react";
import { 
  IonPage, 
  IonContent, 
  IonInput, 
  IonButton, 
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonIcon
} from "@ionic/react";
import { person, mail, lockClosed, flameSharp, arrowForward } from "ionicons/icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import"../theme/RegisterPage.css"
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
      setMessage("Tous les champs sont requis");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Format d'email invalide");
      return false;
    }

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
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
        setMessage("Cet email est déjà utilisé");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Adresse email invalide");
      } else if (error.code === "auth/weak-password") {
        setMessage("Le mot de passe est trop faible");
      } else if (error.code === "auth/operation-not-allowed") {
        setMessage("L'inscription par email/mot de passe n'est pas activée");
      } else {
        setMessage("Erreur lors de l'inscription: " + error.message);
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
    <IonPage>
      <IonContent fullscreen className="register-content">
        
        {/* Background Gradient */}
        <div className="gradient-bg"></div>
        
        {/* Animated Background Shapes */}
        <div className="animated-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <IonGrid className="main-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol size="12" sizeMd="8" sizeLg="5" sizeXl="4">
              
              {/* Logo Header */}
              <div className="logo-header">
                <div className="flame-container">
                  <IonIcon icon={flameSharp} className="flame-logo" />
                </div>
                <h1 className="app-name">Aura</h1>
                <div className="divider-line"></div>
              </div>

              {/* Main Title */}
              <div className="main-title-section">
                <h2 className="signup-title">Créer un compte</h2>
                <p className="signup-subtitle">Rejoignez des milliers de personnes qui trouvent l'amour sur Aura</p>
              </div>

              {/* Form Container */}
              <div className="form-wrapper">
                
                {/* Name Field */}
                <div className="input-field">
                  <div className="input-icon">
                    <IonIcon icon={person} />
                  </div>
                  <IonInput
                    type="text"
                    placeholder="Prénom"
                    value={displayName}
                    onIonInput={(e) => setDisplayName(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="custom-ion-input"
                  />
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Confirm Password Field */}
                <div className="input-field">
                  <div className="input-icon">
                    <IonIcon icon={lockClosed} />
                  </div>
                  <IonInput
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="custom-ion-input"
                  />
                </div>

                {/* Error Message */}
                {message && (
                  <div className="error-banner">
                    <span>{message}</span>
                  </div>
                )}

                {/* Register Button */}
                <IonButton 
                  expand="block"
                  onClick={handleRegister} 
                  disabled={loading}
                  className="register-btn"
                >
                  {loading ? "Création..." : "CRÉER MON COMPTE"}
                  {!loading && <IonIcon icon={arrowForward} slot="end" className="arrow-icon" />}
                </IonButton>

                {/* Terms */}
                <p className="terms">
                  En continuant, vous acceptez nos <span>Conditions</span> et notre <span>Politique de confidentialité</span>
                </p>
              </div>

              {/* Login Link */}
              <div className="login-redirect">
                <p>Vous avez déjà un compte ?</p>
                <IonButton 
                  fill="outline"
                  onClick={() => history.push("/login")}
                  disabled={loading}
                  className="login-link-btn"
                >
                  SE CONNECTER
                </IonButton>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading 
          isOpen={loading} 
          message="Création de votre compte..." 
          spinner="crescent"
          cssClass="custom-loader"
        />

        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={handleSuccessAlert}
          header="🎉 Bienvenue !"
          message="Votre compte a été créé. Commencez votre aventure maintenant !"
          buttons={[
            {
              text: 'COMMENCER',
              handler: handleSuccessAlert
            }
          ]}
          cssClass="success-alert"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;