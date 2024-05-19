import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RoutineMakerApp = () => {
  const [numDays, setNumDays] = useState('');
  const [numClassesPerDay, setNumClassesPerDay] = useState('');
  const [numSubjects, setNumSubjects] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [routine, setRoutine] = useState(null);
  const [showSubjectInputs, setShowSubjectInputs] = useState(false);

  const handleNumSubjectsChange = (event) => {
    const value = event.target.value;
    setNumSubjects(value);
    setSubjects(Array.from({ length: parseInt(value, 10) }, () => ({ sub: '', teacher: '', count: '' })));
    setShowSubjectInputs(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedNumDays = parseInt(numDays, 10);
    const parsedNumClassesPerDay = parseInt(numClassesPerDay, 10);
    const parsedSubjects = subjects.map((subject) => ({
      ...subject,
      count: parseInt(subject.count, 10)
    }));

    setRoutine(routineMaker(parsedNumDays, parsedNumClassesPerDay, parsedSubjects));
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = subjects.slice();
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Routine", 20, 10);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const tableData = routine.map((day, dayIndex) => {
      const row = Array(numClassesPerDay).fill('');
      day.forEach((classItem, classIndex) => {
        row[classIndex] = `${classItem.sub} - ${classItem.teacher}`;
      });
      return [days[dayIndex % days.length], ...row];
    });

    doc.autoTable({
      head: [['Day', ...Array.from({ length: numClassesPerDay }, (_, i) => `Class ${i + 1}`)]],
      body: tableData,
    });

    doc.save('routine.pdf');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Number of working days in a week:
            <input
              type="number"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Number of classes per day:
            <input
              type="number"
              value={numClassesPerDay}
              onChange={(e) => setNumClassesPerDay(e.target.value)}
              required
              style={styles.input}
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Number of subjects:
            <input
              type="number"
              value={numSubjects}
              onChange={handleNumSubjectsChange}
              required
              style={styles.input}
            />
          </label>
        </div>
        {showSubjectInputs && subjects.map((subject, index) => (
          <div key={index} style={styles.subjectGroup}>
            <label style={styles.label}>
              Subject {index + 1}:
              <input
                type="text"
                value={subject.sub}
                onChange={(e) => handleSubjectChange(index, 'sub', e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Teacher:
              <input
                type="text"
                value={subject.teacher}
                onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Classes per week:
              <input
                type="number"
                value={subject.count}
                onChange={(e) => handleSubjectChange(index, 'count', e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>
        ))}
        {showSubjectInputs && subjects.length > 0 && (
          <button type="submit" style={styles.button}>
            Generate Routine
          </button>
        )}
      </form>
      {routine && (
        <div>
          <h2>Routine:</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                {Array.from({ length: numClassesPerDay }, (_, i) => (
                  <th key={i}>Class {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routine.map((day, index) => (
                <tr key={index}>
                  <td>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index % 7]}</td>
                  {day.map((classItem, classIndex) => (
                    <td key={classIndex}>
                      {classItem.sub} - {classItem.teacher}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF} style={styles.button}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

function routineMaker(numDays, numClassesPerDay, subjects) {
  let week = Array.from({ length: numDays }, () => []);

  subjects.sort((a, b) => b.count - a.count);

  let dayIndices = new Array(subjects.length).fill(0);

  for (let subIndex in subjects) {
    let sub = subjects[subIndex];
    let count = sub.count;

    while (count > 0) {
      let dayIndex = dayIndices[subIndex] % numDays;

      if (week[dayIndex].length < numClassesPerDay) {
        week[dayIndex].push({ sub: sub.sub, teacher: sub.teacher });
        count--;
      }

      dayIndices[subIndex]++;
    }
  }

  return week;
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px'
  },
  subjectGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
    paddingLeft: '20px'
  },
  label: {
    marginBottom: '5px'
  },
  input: {
    padding: '5px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    marginTop: '10px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    textAlign: 'left'
  },
  th: {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f2f2f2'
  },
  td: {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px'
  }
};

export default RoutineMakerApp;
