import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

import Companies from "./pages/recruiter/Companies.jsx";
import CompanyForm from "./pages/recruiter/CompanyForm.jsx";
import PostJob from "./pages/recruiter/PostJob.jsx";
import AdminJobs from "./pages/recruiter/AdminJobs.jsx";
import Applicants from "./pages/recruiter/Applicants.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/companies"
          element={
            <ProtectedRoute role="recruiter">
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/companies/new"
          element={
            <ProtectedRoute role="recruiter">
              <CompanyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/companies/:id/edit"
          element={
            <ProtectedRoute role="recruiter">
              <CompanyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute role="recruiter">
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <ProtectedRoute role="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jid/applicants"
          element={
            <ProtectedRoute role="recruiter">
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
