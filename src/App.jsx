import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import avatar1 from './avatars/character1.png';
import avatar2 from './avatars/character2.png';
import avatar3 from './avatars/character3.png';
import avatar4 from './avatars/character4.png';
import avatar5 from './avatars/character5.png';
import avatar6 from './avatars/character6.png';
import avatar7 from './avatars/character7.png';
import avatar8 from './avatars/character8.png';
import avatar9 from './avatars/character9.png';
import avatar10 from './avatars/character10.png';
import iceCream1 from './icecream/flavor1.png';
import iceCream2 from './icecream/flavor2.png';
import iceCream3 from './icecream/flavor3.png';
import iceCream4 from './icecream/flavor4.png';
import iceCream5 from './icecream/flavor5.png';
import coneImage from './icecream/cone.png';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
const iceCreams = [iceCream1, iceCream2, iceCream3, iceCream4, iceCream5];

const questions = [
  {
    question: 'What is ice cream mainly made from?',
    options: ['Milk and cream', 'Flour and water', 'Rice', 'Butter only'],
    correct: 0,
  },
  {
    question: 'What flavor is usually white or pale yellow?',
    options: ['Chocolate', 'Vanilla', 'Strawberry', 'Mint'],
    correct: 1,
  },
  {
    question: 'Where do you usually buy ice cream on the street?',
    options: ['A bakery', 'An ice cream truck or stand', 'A shoe store', 'A pharmacy'],
    correct: 1,
  },
  {
    question: 'What do you put ice cream in to eat it while walking?',
    options: ['A cone', 'A frying pan', 'A teapot', 'A box'],
    correct: 0,
  },
  {
    question: 'Which of these is a popular ice cream topping?',
    options: ['Sprinkles', 'Salt', 'Pepper', 'Ketchup'],
    correct: 0,
  },
  {
    question: 'What happens to ice cream if you leave it out of the freezer too long?',
    options: ['It gets harder', 'It melts', 'It turns into cake', 'Nothing happens'],
    correct: 1,
  },
  {
    question: 'Which fruit flavor is very common in ice cream?',
    options: ['Strawberry', 'Garlic', 'Onion', 'Potato'],
    correct: 0,
  },
  {
    question: 'What is a "sundae"?',
    options: ['A day of the week', 'Ice cream with toppings like sauce and cherries', 'A type of bread', 'A cold soup'],
    correct: 1,
  },
  {
    question: 'What do we call ice cream on a stick?',
    options: ['Popsicle', 'Pancake', 'Waffle', 'Muffin'],
    correct: 0,
  },
  {
    question: 'What is chocolate chip ice cream mixed with?',
    options: ['Small pieces of chocolate', 'Pieces of bread', 'Pieces of cheese', 'Pieces of meat'],
    correct: 0,
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [screen, setScreen] = useState('start');
  const [startStep, setStartStep] = useState('nickname');
  const [nickname, setNickname] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const [currentIceCreamIndex, setCurrentIceCreamIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIceCreamIndex((prev) => (prev + 1) % iceCreams.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = questions[currentIndex];

  useEffect(() => {
    if (finished && !scoreSaved && screen === 'quiz') {
      saveScore();
      setScoreSaved(true);
    }
  }, [finished, scoreSaved, screen]);

  async function saveScore() {
    try {
      await addDoc(collection(db, 'leaderboard'), {
        nickname,
        avatarIndex,
        score,
        total: questions.length,
        time: startTime ? Date.now() - startTime : 0,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error('Error saving score:', err);
    }
  }

  async function loadLeaderboard() {
    setLoadingLeaderboard(true);
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.time || 0) - (b.time || 0);
      });
      setLeaderboardData(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
    setLoadingLeaderboard(false);
  }

  function handleAnswer(index) {
    if (selected !== null) return;
    setSelected(index);
    if (index === current.correct) setScore(score + 1);
    setTimeout(() => {
      setSelected(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  }

  function startQuiz() {
    setStartTime(Date.now());
    setScreen('quiz');
  }

  function resetToStart() {
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setScreen('start');
    setStartStep('nickname');
    setScoreSaved(false);
    setStartTime(null);
  }

        return (
    <>

      <div className="quiz-container">
        <img 
          src={iceCreams[currentIceCreamIndex]} 
          alt="Ice cream" 
          className="ice-cream-top"
          key={currentIceCreamIndex}
        />

        <div className="content-area">
          {screen === 'start' && startStep === 'nickname' && (
            <>
              <h1>Ice cream Quiz</h1>
              <p>Enter your nickname</p>
              <input
                type="text"
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="nickname-input"
                maxLength={15}
              />
            </>
          )}

          {screen === 'start' && startStep === 'profile' && (
            <>
              <div className="profile-avatar-wrap">
                <img src={avatars[avatarIndex]} alt="Avatar" className="profile-avatar" />
                <button className="edit-avatar-btn" onClick={() => setStartStep('avatarPicker')}>✎</button>
              </div>
              <h2>{nickname}</h2>
              <p>You're in! Ready to play?</p>
            </>
          )}

          {screen === 'start' && startStep === 'avatarPicker' && (
            <>
              <h2>Pick character</h2>
              <div className="avatar-grid">
                {avatars.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Char ${idx}`}
                    className={idx === avatarIndex ? 'avatar-option selected' : 'avatar-option'}
                    onClick={() => setAvatarIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}

          {screen === 'quiz' && !finished && (
            <>
              <p>Question {currentIndex + 1}/{questions.length}</p>
              <h2>{current.question}</h2>
              <div className="options">
                {current.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-button"
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    style={{
                      backgroundColor: selected !== null 
                        ? idx === current.correct ? '#d4edda' : idx === selected ? '#f8d7da' : '#fff'
                        : '#fff'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === 'quiz' && finished && (
            <>
              <h2>Score: {score}/{questions.length}</h2>
              <p>Great job!</p>
            </>
          )}

          {screen === 'leaderboard' && (
            <>
              <h2>Leaderboard</h2>
              {loadingLeaderboard ? <p>Loading...</p> : (
                <div className="leaderboard-list">
                  {leaderboardData.map((entry, i) => (
                    <div key={entry.id || i} className="leaderboard-row">
                      <span className="leaderboard-rank">#{i + 1}</span>
                      <img src={avatars[entry.avatarIndex] || avatars[0]} alt="" className="leaderboard-avatar" />
                      <div className="leaderboard-info">
                        <div className="leaderboard-name">{entry.nickname}</div>
                      </div>
                      <span className="leaderboard-score">{entry.score}/{entry.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="buttons-row">
          {screen === 'start' && startStep === 'nickname' && (
            <button className="primary-button" disabled={!nickname.trim()} onClick={() => setStartStep('profile')}>
              OK, go!
            </button>
          )}

          {screen === 'start' && startStep === 'profile' && (
            <>
              <button className="primary-button" onClick={startQuiz}>Start Quiz</button>
              <button className="secondary-button" onClick={() => { setScreen('leaderboard'); loadLeaderboard(); }}>
                View Leaderboard
              </button>
            </>
          )}

          {screen === 'start' && startStep === 'avatarPicker' && (
            <button className="primary-button" onClick={() => setStartStep('profile')}>Done</button>
          )}

          {screen === 'quiz' && finished && (
            <>
              <button className="primary-button" onClick={resetToStart}>Play again</button>
              <button className="secondary-button" onClick={() => { setScreen('leaderboard'); loadLeaderboard(); }}>
                View Leaderboard
              </button>
            </>
          )}

          {screen === 'leaderboard' && (
            <button className="primary-button" onClick={resetToStart}>Back</button>
          )}
        </div>

        <div className="cone-bottom">
          <img src={coneImage} alt="Cone" className="cone-image" />
        </div>
      </div>
    </> 
  ); }

export default App;