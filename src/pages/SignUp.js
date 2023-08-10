import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { UserLevels, UserRoles } from '../constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useIdentity } from '../providers/IdentityProvider';
import Perfil from './Perfil'; 

function SignUp() {
  const { updateIdentity } = useIdentity();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        lastName: lastName,
        level: level,
        email: email,
        role: UserRoles.USUARIO
      });

      updateIdentity(user);
      navigate('/');

    } catch (error) {
      console.error('Error al registrarse con correo electrónico y contraseña', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.paper"
        p={2}
        boxShadow={1}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Registrarse
        </Typography>
        <TextField
          label="Nombre"
          margin="normal"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Apellido"
          margin="normal"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="user-level-label">Nivel</InputLabel>
          <Select
            labelId="user-level-label"
            value={level}
            onChange={handleChange}
            label="Nivel"
          >
            {Object.values(UserLevels).map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Correo electrónico"
          margin="normal"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          margin="normal"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Registrarse
          </Button>
        </Box>
        <Typography variant="body1" align="center">
          ¿Ya tienes una cuenta? <Link to="/signin">Iniciar sesión</Link>
        </Typography>
      </Box>
      <Perfil nameProp={name} lastNameProp={lastName} emailProp={email} levelProp={level} /> 
    </Container>
  );
}

export default SignUp;
