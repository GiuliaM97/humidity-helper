import { useEffect, useState } from 'react'
import {loadCurrentData} from "./repositories/weatherCalls";

function App() {
  const [temp, setTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [dewPoint, setDewPoint] = useState<number | null>(null);
  const [homeTemp, setHomeTemp] = useState<number>(0);
  const [homeHumidity, setHomeHumidity] = useState<number>(0);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [needleX2, setNeedleX2] = useState<number>(100);
  const [needleY2, setNeedleY2] = useState<number>(35);

  useEffect(() => {
    async function loadWeather() {
      const res = await loadCurrentData();

      console.log("response: ", res);

      setTemp(res.current.temp_c);
      setHumidity(res.current.humidity);
      setDewPoint(res.current.dewpoint_c);

    }

    loadWeather()
  }, [])

  function computeResult() {

    if (temp === null || humidity === null || dewPoint === null) {
      return;
    }

    const a = 17.27;
    const b = 237.3;

    const gamma = (a * homeTemp) / (b + homeTemp) + Math.log(homeHumidity / 100);
    const dewIn = (b * gamma) / (a - gamma);

    const delta = dewPoint - dewIn;

    let score = 5 - (delta * 1.2);

    if (isNaN(score))
      score = 0;

    score = Math.max(0, Math.min(10, score));
    score = Math.round(score);

    setResultScore(score);

    //UPDATE DIAL
    const angle = 180 - (score / 10) * 180;

    const rad = angle * Math.PI / 180;

    const length = 70;

    const x = 100 + length * Math.cos(rad);
    const y = 100 - length * Math.sin(rad);

    setNeedleX2(x);
    setNeedleY2(y);
  }

  function getVentilationMessage() {
    if (resultScore === null) {
      return "Errore nei calcoli!";
    }
    if (resultScore <= 3) {
      return "Le finestre dovrebbero restare chiuse";
    }
    if (resultScore <= 5) {
      return "Aprire non è necessario in questo momento";
    }
    if (resultScore <= 7) {
      return "Aprire può aiutare a migliorare l’aria in casa";
    }
    return "È consigliato aprire le finestre ora";
  }

  return (
      <div id="div-container">
        <h1>Meteo Parma</h1>

        {temp !== null ? (
            <div>
              <p>Temperatura: {temp}°C</p>
              <p>Umidità: {humidity}%</p>
              <p>Punto di rugiada: {dewPoint}°C</p>
            </div>

        ) : (
            <p>Caricamento...</p>
        )}

        <h1>Dati casa</h1>

        <div>
          <div>Temperatura (°C):</div>
          <input type={"number"} value={homeTemp} onChange={e => {setHomeTemp(Number(e.target.value))}} />
          <div>Umidità (%):</div>
          <input type={"number"} value={homeHumidity} onChange={e => {setHomeHumidity(Number(e.target.value))}} />
        </div>

        <button onClick={computeResult}>Calcola</button>

        {resultScore !== null ? (
            <div className="dial-container">
              <svg viewBox="0 0 200 120" className="dial">
                <path d="M20,100 A80,80 0 0,1 60,30"
                      stroke="#2ecc71" strokeWidth="12" fill="none"/>
                <path d="M60,30 A80,80 0 0,1 100,20"
                      stroke="#f1c40f" strokeWidth="12" fill="none"/>
                <path d="M100,20 A80,80 0 0,1 140,30"
                      stroke="#e67e22" strokeWidth="12" fill="none"/>
                <path d="M140,30 A80,80 0 0,1 180,100"
                      stroke="#e74c3c" strokeWidth="12" fill="none"/>
                <line id="needle"
                      x1="100" y1="100"
                      x2={needleX2} y2={needleY2}
                      stroke="#333"
                      strokeWidth="3"
                      strokeLinecap="round"/>
                <circle cx="100" cy="100" r="4" fill="#333"/>
              </svg>

              <div id="scoreText" className="score-text">Score: {resultScore}</div>
              <div id="scoreMessage" className="score-message">
                {getVentilationMessage()}
              </div>
            </div>
        ) : ""}
      </div>

  )
}

export default App
