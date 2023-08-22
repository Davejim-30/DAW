import { styled } from '@mui/material';
import { Alert, Avatar, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useIdentity } from '../providers/IdentityProvider';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';


const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: (theme) => theme.spacing(4),
});

const AvatarStyled = styled(Avatar)({
  width: (theme) => theme.spacing(12),
  height: (theme) => theme.spacing(12),
  marginBottom: (theme) => theme.spacing(2),
});

const Form = styled('form')({
  width: '100%',
  marginTop: (theme) => theme.spacing(1),
});

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

function Perfil() {
  const { user } = useIdentity();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bodyMeasurements, setBodyMeasurements] = useState([]);
  const [newMeasurement, setNewMeasurement] = useState({
    bodyFatPercentage: '',
    weight: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email || '');
          setLevel(userData.level || '');
        }
      }
    };

    const fetchBodyMeasurements = async () => {
      if (user) {
        const q = query(collection(db, 'bodyMeasurementRecords'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const measurements = [];
        querySnapshot.forEach((doc) => {
          const measurementData = doc.data();
          measurements.push({ ...measurementData, id: doc.id });
        });
        setBodyMeasurements(measurements);
      }
    };
        
    fetchUserData();
    fetchBodyMeasurements();
  }, [user]);

  const handleNameChange = (event) => {
    if (isEditingName) {
      setName(event.target.value);
    }
  };

  const handleLastNameChange = (event) => {
    if (isEditingLastName) {
      setLastName(event.target.value);
    }
  };

  const handleEmailChange = (event) => {
    if (isEditingEmail) {
      setEmail(event.target.value);
    }
  };

  const handleMeasurementChange = (event) => {
    setNewMeasurement({
      ...newMeasurement,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditingName || isEditingLastName || isEditingEmail) {
      console.log('Datos actualizados:', { name, lastName, email });
      setIsEditingName(false);
      setIsEditingLastName(false);
      setIsEditingEmail(false);

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          name: name,
          lastName: lastName,
          email: email,
        });
        setIsSaved(true);
      }
    }
  };

  const handleAddMeasurement = async (event) => {
    event.preventDefault();
    if (user) {
      const measurementData = {
        ...newMeasurement,
        userId: user.uid,
        measurementDate: Date.now(),
      };
      const docRef = await addDoc(collection(db, 'bodyMeasurementRecords'), measurementData);
      setBodyMeasurements([...bodyMeasurements, { ...measurementData, id: docRef.id }]);
      setNewMeasurement({
        bodyFatPercentage: '',
        weight: '',
      });
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    if (user) {
      await deleteDoc(doc(db, 'bodyMeasurementRecords', measurementId));
      setBodyMeasurements(bodyMeasurements.filter((measurement) => measurement.id !== measurementId));
    }
  };

  const handleEditMeasurement = async (measurementId) => {
    const measurementToUpdate = bodyMeasurements.find((measurement) => measurement.id === measurementId);
    if (measurementToUpdate) {
      setNewMeasurement({
        bodyFatPercentage: measurementToUpdate.bodyFatPercentage,
        weight: measurementToUpdate.weight,
      });
      handleDeleteMeasurement(measurementId);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleEditLastName = () => {
    setIsEditingLastName(true);
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  return (
    <Root>
      <Typography component="h1" variant="h5">
        Perfil
      </Typography>
      <AvatarStyled />
      <Form onSubmit={handleSubmit} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nombre"
          name="name"
          autoComplete="given-name"
          autoFocus
          value={name}
          onChange={handleNameChange}
          InputProps={{
            readOnly: !isEditingName,
          }}
        />
        {!isEditingName && (
          <Button variant="outlined" onClick={handleEditName}>
            Editar
          </Button>
        )}

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Apellido"
          name="lastName"
          autoComplete="family-name"
          value={lastName}
          onChange={handleLastNameChange}
          InputProps={{
            readOnly: !isEditingLastName,
          }}
        />
        {!isEditingLastName && (
          <Button variant="outlined" onClick={handleEditLastName}>
            Editar
          </Button>
        )}

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo electrónico"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
          InputProps={{
            readOnly: !isEditingEmail,
          }}
        />
        {!isEditingEmail && (
          <Button variant="outlined" onClick={handleEditEmail}>
            Editar
          </Button>
        )}

        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isEditingName && !isEditingLastName && !isEditingEmail}
        >
          Guardar cambios
        </SubmitButton>

        {isSaved && (
          <Alert severity="success">
            Los cambios han sido guardados correctamente.
          </Alert>
        )}
      </Form>

      <Typography component="h2" variant="h6">
        Tabla de mediciones
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Porcentaje de grasa corporal</TableCell>
              <TableCell align="right">Peso</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyMeasurements.map((measurement) => (
              <TableRow key={measurement.id}>
                <TableCell>{new Date(measurement.measurementDate).toLocaleDateString()}</TableCell>
                <TableCell>{measurement.bodyFatPercentage}%</TableCell>
                <TableCell align="right">{measurement.weight} Kg</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleEditMeasurement(measurement.id)}>
                    Editar
                  </Button>
                  <Button variant="outlined" onClick={() => handleDeleteMeasurement(measurement.id)}>
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="bodyFatPercentage"
                  label="Porcentaje de grasa corporal"
                  name="bodyFatPercentage"
                  type="number"
                  value={newMeasurement.bodyFatPercentage}
                  onChange={handleMeasurementChange}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="weight"
                  label="Peso"
                  name="weight"
                  type="number"
                  value={newMeasurement.weight}
                  onChange={handleMeasurementChange}
                />
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={handleAddMeasurement}>
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default Perfil;
