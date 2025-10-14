import React from "react";
import { 
  IonPage, 
  IonContent, 
  IonSpinner, 
  IonText 
} from "@ionic/react";

const LoadingPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh" 
        }}>
          <IonSpinner style={{ width: "50px", height: "50px" }} />
          <IonText>
            <h2 style={{ marginTop: "20px" }}>Chargement...</h2>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingPage;