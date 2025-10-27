# 💕 Aura - Dating App

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Ionic-7.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white" alt="Ionic" />
  <img src="https://img.shields.io/badge/Firebase-10.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br />

<div align="center">
  <h3>Une application de rencontres moderne inspirée de Tinder</h3>
  <p>Swipez, Matchez, Chattez - Trouvez votre âme sœur avec Aura 💖</p>
</div>


---

## ✨ Fonctionnalités

### 🔥 Découverte de profils
- **Swipe Cards** : Interface style Tinder avec animations fluides
- **Navigation d'images** : Tap gauche/droite pour voir plusieurs photos
- **Super Like** : Swipe up pour montrer un intérêt particulier
- **Filtrage intelligent** : Profils affichés sauf le vôtre

### 💬 Messagerie
- **Chat en temps réel** : Messages instantanés avec Firebase Firestore
- **Interface moderne** : Bulles de messages avec timestamps
- **Statut en ligne** : Indicateur de présence animé
- **Message de bienvenue** : Animation d'accueil pour les nouveaux matches

### 👤 Profil utilisateur
- **Gestion complète** : Nom, âge, bio, intérêts
- **Multi-photos** : Jusqu'à 6 photos par profil
- **Géolocalisation** : Localisation automatique
- **Intérêts personnalisés** : Tags dynamiques pour vos passions

### 🤖 AI Coach
- **Aura AI** : Coach émotionnel personnel
- **Conversations naturelles** : Réponses contextuelles intelligentes
- **Support 24/7** : Conseils dating et soutien émotionnel
- **Quick Replies** : Suggestions de sujets de conversation

### 🎨 Design
- **Theme Rose Tinder** : Interface moderne et attractive
- **Animations fluides** : Transitions et micro-interactions soignées
- **Responsive** : Optimisé mobile, tablet et desktop
- **Dark mode ready** : Support du mode sombre

---

## 🛠️ Technologies

### Frontend
- **React 18.2** - Library UI
- **Ionic Framework 7** - Composants mobile
- **TypeScript** - Type safety
- **CSS3** - Styling avancé avec variables CSS

### Backend & Services
- **Firebase Authentication** - Gestion des utilisateurs
- **Firebase Firestore** - Base de données temps réel
- **Firebase Storage** - Stockage d'images (optionnel)

### Routing & State
- **React Router v5** - Navigation
- **React Hooks** - State management local
- **Refs & Context** - Gestion d'état avancée

---

## 🚀 Installation

### Prérequis

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Cloner le repository

```bash
git clone https://github.com/Ouerghi23/TinderClone.git
cd aura-dating-appTinderClone
```

### Installer les dépendances

```bash
npm install
```

### Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez **Authentication** (Email/Password)
3. Créez une base de données **Firestore**
4. Copiez vos credentials Firebase
5. Créez un fichier `src/firebaseConfig.ts` :

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Lancer l'application

```bash
# Mode développement
npm start

# Build production
npm run build

# Test
npm test
```

L'application sera accessible sur `http://localhost:3000`

---

## 📁 Structure du projet

```
aura-dating-app/
├── public/
│   ├── assets/
│   │   └── default-avatar.jpg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RegisterPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EditProfile.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── ChatPage.tsx
│   │   └── AIChatPage.tsx
│   ├── theme/
│   │   ├── DashboardPage.css
│   │   ├── ChatPage.css
│   │   └── MatchesPage.css
│   ├── firebaseConfig.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗃️ Structure Firestore

### Collection `users`

```json
{
  "userId": {
    "name": "string",
    "age": "number",
    "bio": "string",
    "interests": ["array"],
    "location": "string",
    "distance": "string",
    "images": ["array"],
    "updatedAt": "timestamp"
  }
}
```

### Collection `matches`

```json
{
  "matchId": {
    "userId": "string",
    "matchedUserId": "string",
    "name": "string",
    "age": "number",
    "image": "string",
    "isSuperLike": "boolean",
    "createdAt": "timestamp"
  }
}
```

### Collection `chats/{chatId}/messages`

```json
{
  "messageId": {
    "senderId": "string",
    "text": "string",
    "timestamp": "timestamp"
  }
}
```

---

## 🎯 Fonctionnement

### 1. Authentification
- Inscription avec email/mot de passe
- Connexion sécurisée
- Réinitialisation de mot de passe par email

### 2. Swipe System
```typescript
// Swipe droite = Like → Crée un match
swipe("right") → addMatch(profile, false)

// Swipe gauche = Nope → Passe au suivant
swipe("left") → next profile

// Swipe haut = Super Like → Match spécial
swipe("up") → addMatch(profile, true)
```

### 3. Matching
- Lorsqu'un utilisateur swipe right, un document est créé dans `matches`
- Les matches apparaissent dans la page Matches
- Click sur un match ouvre le chat

### 4. Chat temps réel
- Messages synchronisés avec Firestore
- Scroll automatique vers le dernier message
- Indicateur "En train d'écrire" (à venir)

---

## 🎨 Personnalisation

### Changer les couleurs

Modifiez les variables CSS dans chaque fichier de style :

```css
/* Couleurs principales */
--primary-rose: #FE3C72;
--gradient-start: #FF6B9D;
--gradient-end: #FE3C72;
--background: #F5F5F5;
```

### Ajouter des fonctionnalités

1. **Filtres de recherche** : Âge, distance, intérêts
2. **Stories** : Comme Instagram
3. **Video calls** : Intégration WebRTC
4. **Vérification de profil** : Badge vérifié
5. **Boost** : Mise en avant du profil

---

## 📱 Deployment

### Web (Netlify/Vercel)

```bash
npm run build
# Upload le dossier build/
```

### iOS (via Capacitor)

```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync
npx cap open ios
```

### Android (via Capacitor)

```bash
npm install @capacitor/android
npx cap add android
npx cap sync
npx cap open android
```

---

## 🐛 Debug

### Problèmes courants

**Les matches ne s'affichent pas :**
- Vérifiez que `userId` dans Firestore correspond à l'UID de l'utilisateur connecté
- Consultez la console pour les erreurs Firebase

**Images ne chargent pas :**
- Vérifiez les URLs des images
- Assurez-vous que les CORS sont configurés

**Chat ne fonctionne pas :**
- Vérifiez les règles Firestore
- Assurez-vous que le `chatId` est correct (format: `user1_user2`)

### Règles Firestore recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - lecture publique, écriture propriétaire
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Matches - lecture/écriture propriétaire
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.matchedUserId == request.auth.uid);
      allow write: if request.auth != null;
    }
    
    // Chats - lecture/écriture participants
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@Ouerghi23](https://github.com/Ouerghi23)
- Email: shaymaouerghi0@gmail.com
  

---

## 🙏 Remerciements

- [Ionic Framework](https://ionicframework.com/) pour les composants UI
- [Firebase](https://firebase.google.com/) pour le backend
- [React](https://react.dev/) pour la library
- Tinder pour l'inspiration du design

---

## ⭐ Support

Si vous aimez ce projet, n'hésitez pas à lui donner une étoile ⭐

Pour toute question ou bug, ouvrez une [issue](https://github.com/Ouerghi23/TinderClone/issues)

---

<div align="center">
  <p>Made with 💕 by Ouerghi Chaima</p>
  <p>© 2025 Aura Dating App. All rights reserved.</p>
</div>
