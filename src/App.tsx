import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

/* Pages */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import LoadingPage from "./pages/LoadingPage";
import MatchesPage from "./pages/MatchesPage";
import AIChatPage from "./pages/AIChatPage";

/* Ionic setup */
import "./theme/variables.css";
import "@ionic/react/css/core.css";
import ChatPage from "./pages/ChatPage";
import MessagesPage from "./pages/Messages";

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Routes publiques */}
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/forgot-password" component={ForgotPassword} />

          {/* Routes protégées */}
          {user ? (
            <>
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/edit-profile" component={EditProfile} />
              <Route exact path="/matches" component={MatchesPage} />
              <Route exact path="/ai-chat" component={AIChatPage} />
<Route path="/chat/:matchedUserId" component={ChatPage} />
<Route path="/messages" component={MessagesPage} />

              <Redirect exact from="/" to="/dashboard" />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
