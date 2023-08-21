import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../Rutinas.css';

async function buscarRutinas(setRutinas) {
  try {
    const rutinasSnapshot = await getDocs(collection(db, 'rutinas'));
    const rutinasData = rutinasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRutinas(rutinasData);
  } catch (error) {
    console.error('Error al obtener los datos de las rutinas', error);
  }
}

function Rutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [inputRutina, setInputRutina] = useState({
    type: '',
    level: '',
    name: '',
    exercises: [{ exerciseName: '', sets: '', reps: '', time: '', weight: '' }],
  });

  useEffect(() => {
    buscarRutinas(setRutinas);
  }, []);

  const agregarRutina = async () => {
    try {
      await addDoc(collection(db, 'rutinas'), inputRutina);
      console.log('Rutina agregada exitosamente');
      buscarRutinas(setRutinas);
      setInputRutina({
        type: '',
        level: '',
        name: '',
        exercises: [{ exerciseName: '', sets: '', reps: '', time: '', weight: '' }],
      });
    } catch (error) {
      console.error('Error al agregar rutina', error);
    }
  };

  const InputChange = (event) => {
    const { name, value } = event.target;
    setInputRutina(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const ExerciseChange = (index, field, value) => {
    setInputRutina(prevState => {
      const exercises = [...prevState.exercises];
      exercises[index][field] = value;
      return {
        ...prevState,
        exercises,
      };
    });
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h1>Rutinas</h1>
        <form>
          <input
            className="input-field"
            type="text"
            name="type"
            placeholder="Tipo"
            value={inputRutina.type}
            onChange={InputChange}
          />
          <input
            className="input-field"
            type="text"
            name="level"
            placeholder="Nivel"
            value={inputRutina.level}
            onChange={InputChange}
          />
          <input
            className="input-field"
            type="text"
            name="name"
            placeholder="Nombre"
            value={inputRutina.name}
            onChange={InputChange}
          />

          {inputRutina.exercises.map((exercise, index) => (
            <div key={index} className="exercise-container">
              <input
                className="input-field"
                type="text"
                placeholder="Ejercicio"
                value={exercise.exerciseName}
                onChange={(e) => ExerciseChange(index, 'exerciseName', e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Sets"
                value={exercise.sets}
                onChange={(e) => ExerciseChange(index, 'sets', e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Reps"
                value={exercise.reps}
                onChange={(e) => ExerciseChange(index, 'reps', e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Tiempo"
                value={exercise.time}
                onChange={(e) => ExerciseChange(index, 'time', e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Peso"
                value={exercise.weight}
                onChange={(e) => ExerciseChange(index, 'weight', e.target.value)}
              />
            </div>
          ))}
          <button className="add-button" type="button" onClick={agregarRutina}>Agregar Rutina</button>
        </form>
      </div>
      <div className="rutina-list">
        {rutinas.length > 0 ? (
          rutinas.map((rutina) => (
            <div key={rutina.id} className="rutina-info">
              <h2>Nombre: {rutina.name}</h2>
              <p>Tipo: {rutina.type}</p>
              <p>Nivel: {rutina.level}</p>
              {rutina.exercises && rutina.exercises.map((exercise, i) => (
                <div key={i} className="exercise-info">
                  <p>Ejercicio: {exercise.exerciseName}</p>
                  <p>Sets: {exercise.sets}</p>
                  <p>Reps: {exercise.reps}</p>
                  <p>Tiempo: {exercise.time}</p>
                  <p>Peso: {exercise.weight}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Cargando rutinas...</p>
        )}
      </div>
    </div>
  );
}

export default Rutinas;

