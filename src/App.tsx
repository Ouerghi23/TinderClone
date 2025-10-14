import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

/* Pages */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingPage from "./pages/LoadingPage";

/* Ionic CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import EditProfile from "./pages/EditProfile";

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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Routes publiques */}
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />

          {/* Routes protégées */}
          <Route
           exact
           path="/edit-profile"
           render={() => (user ? <EditProfile /> : <Redirect to="/login" />)}
/>

          <Route
            exact
            path="/dashboard"
            render={() => (user ? <DashboardPage /> : <Redirect to="/login" />)}
          />
          <Route
            exact
            path="/profile"
            render={() => (user ? <ProfilePage /> : <Redirect to="/login" />)}
          />

          {/* Redirection par défaut */}
          <Route
            exact
            path="/"
            render={() => <Redirect to={user ? "/dashboard" : "/login"} />}
          />

          {/* Fallback pour les pages non trouvées */}
          <Route
            render={() => <Redirect to={user ? "/dashboard" : "/login"} />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
