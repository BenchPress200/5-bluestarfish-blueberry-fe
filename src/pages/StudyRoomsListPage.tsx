import React, { useState } from 'react';
import Header from '../components/common/Header';
import StudyRoomsListContainer from '../components/Container/StudyRoomsListContainer';
import Footer from '../components/common/Footer';

const StudyRoomsListPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <StudyRoomsListContainer />
      <Footer />
    </div>
  );
};

export default StudyRoomsListPage;