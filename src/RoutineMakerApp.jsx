import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RoutineMakerApp = () => {
  const [numDays, setNumDays] = useState("");
  const [numClassesPerDay, setNumClassesPerDay] = useState("");
  const [numSubjects, setNumSubjects] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [routine, setRoutine] = useState(null);
  const [showSubjectInputs, setShowSubjectInputs] = useState(false);

  const handleNumSubjectsChange = (event) => {
    const value = event.target.value;
    setNumSubjects(value);
    setSubjects(
      Array.from({ length: parseInt(value, 10) }, () => ({
        sub: "",
        teacher: "",
        count: "",
      }))
    );
    setShowSubjectInputs(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedNumDays = parseInt(numDays, 10);
    const parsedNumClassesPerDay = parseInt(numClassesPerDay, 10);
    const parsedSubjects = subjects.map((subject) => ({
      ...subject,
      count: parseInt(subject.count, 10),
    }));

    setRoutine(
      routineMaker(parsedNumDays, parsedNumClassesPerDay, parsedSubjects)
    );
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = subjects.slice();
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Routine", 20, 10);

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const tableData = routine.map((day, dayIndex) => {
      const row = Array(numClassesPerDay).fill("");
      day.forEach((classItem, classIndex) => {
        row[classIndex] = `${classItem.sub} - ${classItem.teacher}`;
      });
      return [days[dayIndex % days.length], ...row];
    });

    doc.autoTable({
      head: [
        [
          "Day",
          ...Array.from(
            { length: numClassesPerDay },
            (_, i) => `Class ${i + 1}`
          ),
        ],
      ],
      body: tableData,
    });

    doc.save("routine.pdf");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <div className="base">
          <span id="infoLabel">Basic Classes info</span>
          <div className="inputGroup">
            <label className="label">Working days:</label>
            <input
              type="number"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
              required
              className="input"
              placeholder="no of working days/week"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Classes per day:</label>
            <input
              type="number"
              value={numClassesPerDay}
              onChange={(e) => setNumClassesPerDay(e.target.value)}
              required
              className="input"
              placeholder="class/day"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Number of subjects:</label>
            <input
              type="number"
              value={numSubjects}
              onChange={handleNumSubjectsChange}
              required
              className="input"
              placeholder="subject count"
            />
          </div>
        </div>
        <div className="subjectContainer">
          <span id="infoLabel">individual class info</span>
          {showSubjectInputs &&
            subjects.map((subject, index) => (
              <div key={index} className="subjectGroup">
                <label className="label">Subject {index + 1}:</label>
                <input
                  type="text"
                  value={subject.sub}
                  onChange={(e) =>
                    handleSubjectChange(index, "sub", e.target.value)
                  }
                  required
                  className="input"
                />
                <label className="label">Teacher:</label>
                <input
                  type="text"
                  value={subject.teacher}
                  onChange={(e) =>
                    handleSubjectChange(index, "teacher", e.target.value)
                  }
                  required
                  className="input"
                />
                <label className="label">Classes per week:</label>
                <input
                  type="number"
                  value={subject.count}
                  onChange={(e) =>
                    handleSubjectChange(index, "count", e.target.value)
                  }
                  required
                  className="input"
                />
              </div>
            ))}
        </div>
        {showSubjectInputs && subjects.length > 0 && (
          <button type="submit" className="button">
            Generate Routine
          </button>
        )}
      </form>
      {routine && (
        <div className="table">
          <h2>Generated Routine:</h2>
          <table>
            <thead>
              <tr>
                <th className="th">Day</th>
                {Array.from({ length: numClassesPerDay }, (_, i) => (
                  <th key={i} className="th">
                    Class {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routine.map((day, index) => (
                <tr key={index}>
                  <td className="td">
                    {
                      [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ][index % 7]
                    }
                  </td>
                  {day.map((classItem, classIndex) => (
                    <td key={classIndex} className="td">
                      {classItem.sub} - {classItem.teacher}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF} className="button">
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

export default RoutineMakerApp;
