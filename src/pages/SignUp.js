import { styled } from '@mui/material';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useIdentity } from '../providers/IdentityProvider';
import { doc, getDoc } from 'firebase/firestore';
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

    fetchUserData();
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditingName || isEditingLastName || isEditingEmail) {
      console.log('Datos actualizados:', { name, lastName, email });
      setIsEditingName(false);
      setIsEditingLastName(false);
      setIsEditingEmail(false);
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
      </Form>
    </Root>
  );
}

export default Perfil;
