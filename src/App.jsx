import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Parents from './pages/Parents';
import UserType from './pages/UserType';
import Onboarding from './pages/Onboarding';
import AssessmentFlow from './pages/AssessmentFlow';
import Questions from './pages/Questions';
import Class12Questionnaire from './pages/Class12Questionnaire';
import PathResults from './pages/PathResults';
import Recommendations from './pages/Recommendations';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Advisor from './pages/Advisor';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import About from './pages/About';
import StudyAbroad from './pages/StudyAbroad';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import CookiePolicy from './pages/legal/CookiePolicy';
import Disclaimer from './pages/legal/Disclaimer';
import Accessibility from './pages/legal/Accessibility';
import AcceptableUse from './pages/legal/AcceptableUse';
import Security from './pages/legal/Security';
import Account from './pages/Account';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Support from './pages/Support';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Offline from './pages/Offline';
import SessionExpired from './pages/SessionExpired';

function RequireAnswers({ children }) {
  const { answers } = useUser();
  const hasAnswers = answers && Object.keys(answers).length > 0;
  if (!hasAnswers) return <Navigate to="/get-started" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login" element={<Layout showHeader={false} showFooter={false}><Login /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/parents" element={<Layout><Parents /></Layout>} />
          <Route path="/get-started" element={<Layout><UserType /></Layout>} />
          <Route path="/onboarding/:userType" element={<Layout><Onboarding /></Layout>} />
          <Route path="/assessment" element={<Layout><AssessmentFlow /></Layout>} />
          <Route path="/questions/class12" element={<Layout><Class12Questionnaire /></Layout>} />
          <Route path="/path/:userType" element={<Layout><RequireAnswers><PathResults /></RequireAnswers></Layout>} />
          <Route path="/questions/:userType" element={<Layout><Questions /></Layout>} />
          <Route path="/recommendations/:userType" element={<Layout><RequireAnswers><Recommendations /></RequireAnswers></Layout>} />
          <Route path="/compare" element={<Layout><Compare /></Layout>} />
          <Route path="/study-abroad" element={<Layout><StudyAbroad /></Layout>} />
          <Route path="/dashboard" element={<Layout><RequireAuth><RequireAnswers><Dashboard /></RequireAnswers></RequireAuth></Layout>} />
          <Route path="/advisor" element={<Layout showHeader={false}><RequireAuth><RequireAnswers><Advisor /></RequireAnswers></RequireAuth></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/cookies" element={<Layout><CookiePolicy /></Layout>} />
          <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
          <Route path="/accessibility" element={<Layout><Accessibility /></Layout>} />
          <Route path="/acceptable-use" element={<Layout><AcceptableUse /></Layout>} />
          <Route path="/security" element={<Layout><Security /></Layout>} />
          <Route path="/account" element={<Layout><Account /></Layout>} />
          <Route path="/verify-email" element={<Layout><VerifyEmail /></Layout>} />
          <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/403" element={<Layout><Forbidden /></Layout>} />
          <Route path="/500" element={<Layout><ServerError /></Layout>} />
          <Route path="/offline" element={<Layout><Offline /></Layout>} />
          <Route path="/session-expired" element={<Layout><SessionExpired /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
