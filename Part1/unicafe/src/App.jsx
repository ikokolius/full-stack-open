import { useState } from 'react';

const Header = () => {
  return <h1>Unicafe Feedback</h1>;
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Feedback = ({ onGoodClick, onNeutralClick, onBadClick }) => {
  return (
    <>
      <h2>Overall feedback</h2>
      <Button text="Good" onClick={onGoodClick} />{' '}
      <Button text="Neutral" onClick={onNeutralClick} />{' '}
      <Button text="Bad" onClick={onBadClick} />
    </>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td style={{ padding: '0.5em' }}>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good = 0, neutral = 0, bad = 0 }) => {
  const getAll = () => good + neutral + bad;
  const getAverage = () =>
    getAll() !== 0 ? (good * 1 + bad * -1) / getAll() : 0;
  const getPositiveInPercents = () =>
    `${(getAll() !== 0 ? good / getAll() : 0) * 100}%`;

  {
    if (getAll() <= 0) {
      return (
        <>
          <h2>Statistics</h2>
          <div>No feedback given</div>
        </>
      );
    } else {
      return (
        <>
          <h2>Statistics</h2>
          <table style={{ tableLayout: 'fixed' }}>
            <tbody>
              <StatisticLine text="Good" value={good} />
              <StatisticLine text="Neutral" value={neutral} />
              <StatisticLine text="Bad" value={bad} />
              <StatisticLine text="All" value={getAll()} />
              <StatisticLine text="Average" value={getAverage()} />
              <StatisticLine text="Positive" value={getPositiveInPercents()} />
            </tbody>
          </table>
        </>
      );
    }
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);

  const handleNeutralClick = () => setNeutral(neutral + 1);

  const handleBadClick = () => setBad(bad + 1);

  return (
    <>
      <Header />
      <main>
        <Feedback
          onGoodClick={handleGoodClick}
          onNeutralClick={handleNeutralClick}
          onBadClick={handleBadClick}
        />
        <Statistics good={good} neutral={neutral} bad={bad} />
      </main>
    </>
  );
};

export default App;
