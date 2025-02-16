
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import CompanySignup from "@/pages/CompanySignup";
import SurveyCreation from "@/pages/SurveyCreation";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/company-signup" element={<CompanySignup />} />
        <Route path="/survey-creation" element={<SurveyCreation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
