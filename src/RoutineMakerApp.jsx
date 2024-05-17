import React, { useState } from 'react';

const RoutineMakerApp = () => {
  const [numDays, setNumDays] = useState('');
  const [numClassesPerDay, setNumClassesPerDay] = useState('');
  const [numSubjects, setNumSubjects] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [routine, setRoutine] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedNumDays = parseInt(numDays, 10);
    const parsedNumClassesPerDay = parseInt(numClassesPerDay, 10);
    const parsedSubjects = subjects.map((subject, index) => ({
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

  const addSubject = () => {
    setSubjects([...subjects, { sub: '', teacher: '', count: '' }]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Number of working days in a week:
            <input
              type="number"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Number of classes per day:
            <input
              type="number"
              value={numClassesPerDay}
              onChange={(e) => setNumClassesPerDay(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Number of subjects:
            <input
              type="number"
              value={numSubjects}
              onChange={(e) => setNumSubjects(e.target.value)}
              required
            />
          </label>
        </div>
        {subjects.map((subject, index) => (
          <div key={index}>
            <label>
              Subject {index + 1}:
              <input
                type="text"
                value={subject.sub}
                onChange={(e) => handleSubjectChange(index, 'sub', e.target.value)}
                required
              />
            </label>
            <label>
              Teacher:
              <input
                type="text"
                value={subject.teacher}
                onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                required
              />
            </label>
            <label>
              Classes per week:
              <input
                type="number"
                value={subject.count}
                onChange={(e) => handleSubjectChange(index, 'count', e.target.value)}
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addSubject}>
          Add Subject
        </button>
        <button type="submit">Generate Routine</button>
      </form>
      {routine && (
        <div>
          <h2>Routine:</h2>
          {routine.map((day, index) => (
            <div key={index}>
              <h3>Day {index + 1}:</h3>
              <ul>
                {day.map((classItem, classIndex) => (
                  <li key={classIndex}>
                    {classItem.sub} - {classItem.teacher}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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

export default RoutineMakerApp;
