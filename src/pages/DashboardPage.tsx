import React from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push("/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tableau de Bord</IonTitle>
          <IonButton slot="end" onClick={handleLogout}>
            Déconnexion
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Bienvenue !</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Connecté en tant que : <strong>{user?.email}</strong></p>
                  <p>Nom : <strong>{user?.displayName || "Non défini"}</strong></p>
                  <IonButton 
                    expand="block" 
                    routerLink="/profile"
                    style={{ marginTop: "20px" }}
                  >
                    Modifier le profil
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;