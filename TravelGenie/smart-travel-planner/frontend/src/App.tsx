import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import ItineraryDisplay from './components/ItineraryDisplay';
import './App.css';

function App() {
  const [itinerary, setItinerary] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>Smart Travel Planner</h1>
      </header>
      <main>
        <div className="chat-section">
          <ChatPanel onItineraryGenerated={setItinerary} />
        </div>
        <div className="itinerary-section">
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      </main>
    </div>
  );
}

export default App; 