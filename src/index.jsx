import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Request } from './request/Request';
import { Done } from './request/Done';
import { ProjectApprove } from './manage/ProjectApprove';
import { ProjectList } from './manage/ProjectList';
import reportWebVitals from './reportWebVitals';
import Login from './manage/Login';
import SignUp from "./signup/SignUp";
import {SignUpDone} from "./signup/SignUpDone";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/request" element={<Request/>}></Route>
        <Route path="/done" element={<Done/>}></Route>
        <Route path="/admin/approve" element={<ProjectApprove/>}></Route>
        <Route path="/admin/list" element={<ProjectList/>}></Route>
        <Route path="/admin" element={<Login/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/signup/done" element={<SignUpDone/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
