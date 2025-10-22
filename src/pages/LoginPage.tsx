import React, { useState } from "react"; 
// Import de React et du hook useState pour gérer les états internes du composant.

import { useHistory } from 'react-router-dom';
// Import de useHistory pour naviguer entre les pages (redirections après connexion, etc.)

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
// Import des composants Ionic React pour construire l'interface utilisateur :
// IonPage : conteneur principal d'une page
// IonContent : zone scrollable de la page
// IonLoading : affiche un spinner de chargement
// IonGrid, IonRow, IonCol : système de grille responsive
// IonIcon : pour afficher des icônes
// IonButton : bouton interactif
// IonInput : champ de saisie

import { mail, lockClosed, flameSharp, arrowForward, logoGoogle } from "ionicons/icons";
// Import des icônes prédéfinies de Ionicons pour l'UI : mail, mot de passe, logo de l'app, flèche, Google

import { signInWithEmailAndPassword } from "firebase/auth";
// Fonction Firebase pour se connecter avec email et mot de passe

import { auth } from "../firebaseConfig";
// Import de la configuration Firebase pour l'authentification

import "../theme/LoginPage.css"
// Import du fichier CSS spécifique à cette page

const LoginPage: React.FC = () => {
  // Déclaration du composant fonctionnel LoginPage

  const [email, setEmail] = useState(""); 
  // État pour stocker l'email saisi par l'utilisateur

  const [password, setPassword] = useState(""); 
  // État pour stocker le mot de passe saisi

  const [message, setMessage] = useState(""); 
  // État pour afficher des messages d'erreur ou d'information

  const [loading, setLoading] = useState(false); 
  // État pour indiquer si une action est en cours (spinner)

  const history = useHistory(); 
  // Permet la navigation vers d'autres pages

  const handleLogin = async () => {
    // Fonction asynchrone pour gérer la connexion

    if (!email || !password) {
      setMessage("Tous les champs sont requis");
      return;
    }
    // Vérifie que tous les champs sont remplis

    if (!email.includes("@")) {
      setMessage("Format d'email invalide");
      return;
    }
    // Vérifie que l'email contient au moins "@"

    setLoading(true);
    // Active le spinner de chargement

    setMessage("");
    // Réinitialise le message d'erreur

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Tente de connecter l'utilisateur avec Firebase

      setTimeout(() => {
        history.push("/dashboard");
      }, 500);
      // Redirection vers le dashboard après 500ms en cas de succès

    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      // Affiche l'erreur dans la console pour le débogage

      if (error.code === "auth/invalid-email") {
        setMessage("Adresse email invalide");
      } else if (error.code === "auth/user-not-found") {
        setMessage("Aucun compte trouvé avec cet email");
      } else if (error.code === "auth/wrong-password") {
        setMessage("Email ou mot de passe incorrect");
      } else if (error.code === "auth/too-many-requests") {
        setMessage("Trop de tentatives. Réessayez plus tard");
      } else if (error.code === "auth/invalid-credential") {
        setMessage("Email ou mot de passe incorrect");
      } else {
        setMessage("Erreur de connexion. Veuillez réessayer");
      }
      // Gestion complète des erreurs Firebase avec messages adaptés
    } finally {
      setLoading(false);
      // Désactive le spinner dans tous les cas
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
    // Permet d'appuyer sur "Entrée" pour se connecter
  };

  return (
    <IonPage>
      {/* Conteneur principal Ionic */}
      <IonContent fullscreen className="login-content">
        {/* Zone de contenu scrollable */}

        {/* Background Gradient */}
        <div className="gradient-bg"></div>
        {/* Dégradé de fond de la page */}

        {/* Animated Background Shapes */}
        <div className="animated-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        {/* Formes animées décoratives */}

        <IonGrid className="main-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol size="12" sizeMd="8" sizeLg="5" sizeXl="4">
              {/* Centrage du contenu responsive */}

              {/* Logo Header */}
              <div className="logo-header">
                <div className="flame-container">
                  <IonIcon icon={flameSharp} className="flame-logo" />
                </div>
                <h1 className="app-name">Aura</h1>
                <div className="divider-line"></div>
              </div>
              {/* Logo et nom de l'application */}

              {/* Main Title */}
              <div className="main-title-section">
                <h2 className="login-title">Bon retour !</h2>
                <p className="login-subtitle">Connectez-vous pour continuer votre aventure</p>
              </div>
              {/* Titre principal et sous-titre */}

              {/* Form Container */}
              <div className="form-wrapper">

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
                {/* Champ de saisie pour email avec icône */}

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
                {/* Champ de saisie pour mot de passe avec icône */}

                {/* Forgot Password Link */}
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
                {/* Lien pour récupérer le mot de passe */}

                {/* Error Message */}
                {message && (
                  <div className="error-banner">
                    <span>{message}</span>
                  </div>
                )}
                {/* Affichage du message d'erreur si présent */}

                {/* Login Button */}
                <IonButton 
                  expand="block"
                  onClick={handleLogin} 
                  disabled={loading}
                  className="login-btn"
                >
                  {loading ? "Connexion..." : "SE CONNECTER"}
                  {!loading && <IonIcon icon={arrowForward} slot="end" className="arrow-icon" />}
                </IonButton>
                {/* Bouton de connexion avec spinner et icône */}

                {/* Divider */}
                <div className="divider">
                  <span>OU</span>
                </div>
                {/* Séparateur pour options alternatives */}

                {/* Google Login Button */}
                <IonButton 
                  expand="block"
                  fill="outline"
                  className="social-btn google-btn" 
                  disabled={loading}
                >
                  <IonIcon icon={logoGoogle} slot="start" className="social-icon" />
                  Continuer avec Google
                </IonButton>
                {/* Bouton de connexion via Google (fonctionnalité à ajouter) */}

                {/* Sign Up Button */}
                <IonButton 
                  expand="block"
                  fill="outline"
                  className="signup-btn"
                  onClick={() => history.push("/register")}
                  disabled={loading}
                >
                  Créer un nouveau compte
                </IonButton>
                {/* Bouton pour créer un nouveau compte */}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Loader */}
        <IonLoading 
          isOpen={loading} 
          message="Connexion en cours..." 
          spinner="crescent"
          cssClass="custom-loader"
        />
        {/* Spinner de chargement affiché pendant la connexion */}
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
// Export du composant pour pouvoir l'utiliser dans l'application
