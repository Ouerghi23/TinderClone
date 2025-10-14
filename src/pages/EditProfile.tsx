import React, { useState, useEffect } from "react";
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
  IonTextarea,
  IonList,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonAlert,
  IonChip,
  IonText,
} from "@ionic/react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { camera, close, add, trash, link } from "ionicons/icons";

const EditProfile: React.FC = () => {
  const db = getFirestore();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  /* Charger le profil existant */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setAge(data.age || undefined);
        setBio(data.bio || "");
        setInterests((data.interests || []).join(", "));
        setLocation(data.location || "");
        setImages(data.images || []);
      } else {
        console.log("Aucun profil trouvé pour cet utilisateur.");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  /* Fonction pour récupérer la localisation */
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      showMessage("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        setLocation(loc);
      },
      (error) => {
        showMessage("Erreur de géolocalisation : " + error.message);
      }
    );
  };

  /* Ajouter une image par URL */
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      showMessage("❌ Veuillez entrer une URL d'image");
      return;
    }

    // Validation basique de l'URL
    if (!newImageUrl.startsWith('http')) {
      showMessage("❌ URL invalide. Doit commencer par http:// ou https://");
      return;
    }

    if (images.length >= 6) {
      showMessage("❌ Maximum 6 images autorisées");
      return;
    }

    // Vérifier si l'image existe déjà
    if (images.includes(newImageUrl)) {
      showMessage("❌ Cette image est déjà dans votre profil");
      return;
    }

    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
    showMessage("✅ Image ajoutée avec succès !");
  };

  /* Supprimer une image */
  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    showMessage("✅ Image supprimée");
  };

  /* Réorganiser les images */
  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  /* Sauvegarder le profil */
  const handleSave = async () => {
    if (!user) return;
    
    if (!name || !age) {
      showMessage("❌ Le nom et l'âge sont obligatoires");
      return;
    }

    if (age < 18 || age > 100) {
      showMessage("❌ L'âge doit être entre 18 et 100 ans");
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const newData = {
        name,
        age,
        bio,
        interests: interests.split(",").map(i => i.trim()).filter(i => i),
        location,
        images,
        updatedAt: new Date(),
      };

      await setDoc(userRef, newData, { merge: true });
      showMessage("✅ Profil mis à jour avec succès !");
      
    } catch (error: any) {
      console.error("Erreur sauvegarde:", error);
      showMessage("❌ Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <IonTitle style={{ color: 'white', fontWeight: '600' }}>
            Modifier mon profil ✨
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonList style={{ background: 'transparent' }}>
          {/* Section Images */}
          <IonItem style={{ '--background': 'transparent', marginBottom: '20px' }}>
            <IonLabel>
              <h2 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '15px' }}>
                Photos de profil
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <IonChip color="medium">
                  {images.length}/6 photos
                </IonChip>
                <IonText color="medium">
                  <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>
                    Ajoutez des URLs d'images depuis internet
                  </p>
                </IonText>
              </div>

              {/* Ajout d'image par URL */}
              <div style={{ marginBottom: '20px' }}>
                <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)' }}>
                  <IonLabel position="stacked">
                    <IonIcon icon={link} style={{ marginRight: '8px' }} />
                    URL de l'image
                  </IonLabel>
                  <IonInput
                    value={newImageUrl}
                    onIonChange={(e) => setNewImageUrl(e.detail.value!)}
                    placeholder="https://example.com/image.jpg"
                    style={{ '--padding-start': '10px' }}
                  />
                </IonItem>
                <IonButton 
                  expand="block" 
                  onClick={handleAddImage}
                  disabled={images.length >= 6}
                  style={{ 
                    '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    marginTop: '10px'
                  }}
                >
                  <IonIcon icon={add} style={{ marginRight: '8px' }} />
                  Ajouter l'image
                </IonButton>
              </div>

              {/* Grille d'images */}
              {images.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <IonText color="medium">
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                      Glissez-déposez pour réorganiser (première image = photo principale)
                    </p>
                  </IonText>
                  
                  <IonGrid>
                    <IonRow>
                      {images.map((imageUrl, index) => (
                        <IonCol size="6" size-md="4" key={index}>
                          <div 
                            className="image-container"
                            style={{
                              position: 'relative',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              background: 'white'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={`Profile ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              onError={(e) => {
                                // En cas d'erreur de chargement
                                e.currentTarget.style.backgroundColor = '#e2e8f0';
                                e.currentTarget.alt = 'Image non disponible';
                              }}
                            />
                            
                            {/* Badge photo principale */}
                            {index === 0 && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'rgba(102, 126, 234, 0.9)',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                Principale
                              </div>
                            )}
                            
                            {/* Bouton suppression */}
                            <IonButton
                              fill="clear"
                              color="danger"
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                '--padding-start': '4px',
                                '--padding-end': '4px',
                                '--background': 'rgba(239, 68, 68, 0.9)',
                                '--color': 'white'
                              }}
                              onClick={() => handleDeleteImage(index)}
                            >
                              <IonIcon icon={trash} size="small" />
                            </IonButton>
                            
                            {/* Boutons de réorganisation */}
                            {images.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                right: '8px',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}>
                                {index > 0 && (
                                  <IonButton
                                    fill="clear"
                                    color="light"
                                    size="small"
                                    style={{
                                      '--padding-start': '4px',
                                      '--padding-end': '4px',
                                      '--background': 'rgba(0, 0, 0, 0.6)'
                                    }}
                                    onClick={() => moveImage(index, index - 1)}
                                  >
                                    ↑
                                  </IonButton>
                                )}
                                {index < images.length - 1 && (
                                  <IonButton
                                    fill="clear"
                                    color="light"
                                    size="small"
                                    style={{
                                      '--padding-start': '4px',
                                      '--padding-end': '4px',
                                      '--background': 'rgba(0, 0, 0, 0.6)'
                                    }}
                                    onClick={() => moveImage(index, index + 1)}
                                  >
                                    ↓
                                  </IonButton>
                                )}
                              </div>
                            )}
                          </div>
                        </IonCol>
                      ))}
                    </IonRow>
                  </IonGrid>
                </div>
              )}

              {/* Message si aucune image */}
              {images.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e0'
                }}>
                  <IonIcon 
                    icon={camera} 
                    style={{ fontSize: '48px', color: '#cbd5e0', marginBottom: '10px' }} 
                  />
                  <IonText color="medium">
                    <p style={{ margin: 0 }}>Aucune photo ajoutée</p>
                    <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>
                      Ajoutez des URLs d'images pour personnaliser votre profil
                    </p>
                  </IonText>
                </div>
              )}
            </IonLabel>
          </IonItem>

          {/* Informations personnelles */}
          <IonItem style={{ '--background': 'transparent' }}>
            <IonLabel>
              <h2 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '15px' }}>
                Informations personnelles
              </h2>
              
              <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)', marginBottom: '10px' }}>
                <IonLabel position="stacked">Nom *</IonLabel>
                <IonInput
                  value={name}
                  onIonChange={(e) => setName(e.detail.value!)}
                  placeholder="Votre nom"
                />
              </IonItem>

              <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)', marginBottom: '10px' }}>
                <IonLabel position="stacked">Âge *</IonLabel>
                <IonInput
                  type="number"
                  value={age}
                  onIonChange={(e) => setAge(parseInt(e.detail.value!, 10))}
                  placeholder="Votre âge"
                />
              </IonItem>

              <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)', marginBottom: '10px' }}>
                <IonLabel position="stacked">Bio</IonLabel>
                <IonTextarea
                  value={bio}
                  onIonChange={(e) => setBio(e.detail.value!)}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                />
              </IonItem>

              <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)', marginBottom: '10px' }}>
                <IonLabel position="stacked">Centres d'intérêt</IonLabel>
                <IonInput
                  value={interests}
                  onIonChange={(e) => setInterests(e.detail.value!)}
                  placeholder="Voyage, Musique, Sport..."
                />
              </IonItem>

              <IonItem style={{ '--background': 'rgba(255, 255, 255, 0.8)' }}>
                <IonLabel position="stacked">Localisation</IonLabel>
                <IonInput 
                  value={location} 
                  readonly 
                  placeholder="Appuyez pour autoriser la géolocalisation" 
                />
                <IonButton 
                  slot="end" 
                  onClick={getUserLocation}
                  style={{ '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  📍 Localiser
                </IonButton>
              </IonItem>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Bouton de sauvegarde */}
        <div style={{ padding: '20px' }}>
          <IonButton 
            expand="block" 
            onClick={handleSave}
            disabled={loading}
            style={{ 
              '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '--border-radius': '12px',
              height: '50px',
              fontWeight: '600'
            }}
          >
            {loading ? "Sauvegarde..." : "💾 Sauvegarder le profil"}
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="Sauvegarde en cours..." />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;