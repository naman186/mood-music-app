
import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const moods = [
    { name: 'Happy', emoji: '😊', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f093fb' },
    { name: 'Sad', emoji: '😢', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe' },
    { name: 'Calm', emoji: '😌', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#43e97b' },
    { name: 'Energetic', emoji: '⚡', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fa709a' }
  ];

  const fetchPlaylist = async (mood) => {
    setLoading(true);
    setSelectedMood(mood);

    try {
      const response = await fetch(`https://mood-music-backend-5n42.onrender.com/api/recommend/${mood}`);
      const data = await response.json();
      setPlaylist(data);
      setCurrentSong(null);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = () => {
    const mood = moods.find(m => m.name === selectedMood);
    return mood ? mood.gradient : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor" className="logo-icon">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <h1>MoodSync</h1>
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
            <span>Search</span>
          </div>
          <div className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 12H3M16 6H3M12 18H3"></path></svg>
            <span>Your Library</span>
          </div>
        </nav>

        <div className="mood-sidebar-section">
          <h3>Select Your Mood</h3>
          <div className="mood-pills">
            {moods.map((mood) => (
              <button
                key={mood.name}
                className={`mood-pill ${selectedMood === mood.name ? 'active' : ''}`}
                onClick={() => fetchPlaylist(mood.name)}
                style={{
                  background: selectedMood === mood.name ? mood.gradient : 'transparent',
                  borderColor: mood.color
                }}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span>{mood.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ background: selectedMood ? getMoodColor() : '#121212' }}>
        <div className="content-overlay">
          {!playlist && !loading && (
            <div className="welcome-screen">
              <div className="welcome-content">
                <h1>Welcome to MoodSync</h1>
                <p>Select a mood from the sidebar to discover your perfect playlist</p>
                <div className="welcome-moods">
                  {moods.map((mood) => (
                    <div
                      key={mood.name}
                      className="welcome-mood-card"
                      onClick={() => fetchPlaylist(mood.name)}
                      style={{ background: mood.gradient }}
                    >
                      <span className="welcome-emoji">{mood.emoji}</span>
                      <h3>{mood.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-screen">
              <div className="vinyl-spinner"></div>
              <p>Creating your {selectedMood} playlist...</p>
            </div>
          )}

          {playlist && !loading && (
            <div className="playlist-view">
              <div className="playlist-hero">
                <div className="playlist-cover" style={{ background: getMoodColor() }}>
                  <span className="hero-emoji">{moods.find(m => m.name === selectedMood)?.emoji}</span>
                </div>
                <div className="playlist-meta">
                  <span className="playlist-type">PLAYLIST</span>
                  <h1 className="playlist-title">{playlist.mood} Vibes</h1>
                  <p className="playlist-desc">{playlist.description}</p>
                  <div className="playlist-stats">
                    <span>{playlist.songCount} songs</span>
                    <span className="dot">•</span>
                    <span>{playlist.totalDuration}</span>
                  </div>
                </div>
              </div>

              <div className="playlist-controls">
                <button className="play-all-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play All
                </button>
              </div>

              <div className="songs-table">
                <div className="table-header">
                  <div className="col-index">#</div>
                  <div className="col-title">TITLE</div>
                  <div className="col-artist">ARTIST</div>
                  <div className="col-genre">GENRE</div>
                  <div className="col-duration">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                  </div>
                </div>

                {playlist.songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`song-row ${currentSong === song.id ? 'playing' : ''}`}
                    onClick={() => setCurrentSong(song.id)}
                  >
                    <div className="col-index">
                      {currentSong === song.id ? (
                        <div className="equalizer">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : (
                        <span className="track-number">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-title">
                      <div className="song-info">
                        <span className="song-name">{song.title}</span>
                      </div>
                    </div>
                    <div className="col-artist">{song.artist}</div>
                    <div className="col-genre">{song.genre}</div>
                    <div className="col-duration">{song.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
