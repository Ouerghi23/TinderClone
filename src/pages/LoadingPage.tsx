import React from "react";
import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { heart, flameSharp } from "ionicons/icons";
import "../theme/LoadingPage.css"
const LoadingPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="loading-content">
        
        {/* Background Gradient */}
        <div className="gradient-bg"></div>
        
        {/* Animated Background Shapes */}
        <div className="animated-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        {/* Container principal */}
        <div className="loading-container">
          
          {/* Logo Aura avec animation */}
          <div className="logo-wrapper">
            <div className="icon-glow-container">
              <IonIcon icon={flameSharp} className="main-icon-loading" />
              <div className="pulse-glow" />
            </div>
            
            <h1 className="app-title-loading">Aura</h1>
            <div className="divider-line"></div>
          </div>

          {/* Spinner premium avec design moderne */}
          <div className="spinner-wrapper">
            {/* Cercle externe animé */}
            <div className="spinner-circle spinner-outer" />
            
            {/* Cercle progressif */}
            <div className="spinner-circle spinner-inner" />
            
            {/* Cœur central avec pulsation */}
            <IonIcon icon={heart} className="center-heart-icon" />
          </div>

          {/* Contenu textuel */}
          <div className="text-content">
            <h2 className="loading-message">
              Rencontrez votre
              <br />
              <span className="gradient-text">prochaine étincelle</span>
            </h2>
            <p className="loading-subtitle">
              Nous personnalisons votre expérience pour des rencontres authentiques
            </p>
          </div>

          {/* Indicateurs de progression (Points animés) */}
          <div className="dots-indicator">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="dot"
                style={{
                  animationDelay: `${index * 0.6}s`
                }}
              />
            ))}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default LoadingPage;