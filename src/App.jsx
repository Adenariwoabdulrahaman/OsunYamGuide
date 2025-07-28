import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [symptomInput, setSymptomInput] = useState('');
  const [dropdownSymptom, setDropdownSymptom] = useState('');
  const [symptomList, setSymptomList] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/symptoms')
      .then((res) => setSymptomList(res.data))
      .catch((err) => {
        console.error('Failed to fetch symptoms:', err);
        setSymptomList([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const symptom = symptomInput.trim() || dropdownSymptom.trim();

    if (!symptom) {
      alert("Please enter or select a symptom.");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/diagnose', {
        symptoms: [symptom]
      });
      setResult(response.data);
    } catch (error) {
      console.error('Axios error:', error);
      setResult([{ diagnosis: 'Error', type: '', treatment: 'Could not connect to backend.' }]);
    }
  };

  const handleInputChange = (e) => {
    setSymptomInput(e.target.value);
    setDropdownSymptom('');
    if (e.target.value.trim() === '') setResult([]);
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setDropdownSymptom(value);
    setSymptomInput('');
    if (value === '') setResult([]);
  };

  return (
    <div>
      <div className="logo">
        <span className="system-name">OsunYamGuide</span>
      </div>
      <div className="container">
        <div className="card">
          <h1>Yam Diagnosis System</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={symptomInput}
              onChange={handleInputChange}
              placeholder="Enter symptom"
              disabled={dropdownSymptom !== ''}
            />
            <select
              value={dropdownSymptom}
              onChange={handleDropdownChange}
              disabled={symptomInput.trim() !== ''}
            >
              <option value="">Select symptom from list</option>
              {symptomList.map((sym, i) => (
                <option key={i} value={sym}>{sym}</option>
              ))}
            </select>
            <button type="submit">Diagnose</button>
          </form>
          {result.length === 0 && (
            <p style={{ marginTop: "20px", color: "#888" }}>
              Enter or select a symptom to begin diagnosis.
            </p>
          )}
          {result.length > 0 && (
            <div className="result">
              {result.map((r, index) => (
                <div key={index}>
                  <h3>Diagnosis: {r.diagnosis}</h3>
                  <p>Type: {r.type}</p>
                  <p>Recommendation: {r.treatment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

