import { styled } from '@mui/material';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

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

function Perfil({ nameProp, lastNameProp, emailProp, levelProp }) {
  const [name, setName] = useState(nameProp);
  const [lastName, setLastName] = useState(lastNameProp);
  const [email, setEmail] = useState(emailProp);
  const [level, setLevel] = useState(levelProp);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingLevel, setIsEditingLevel] = useState(false);

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

  const handleLevelChange = (event) => {
    if (isEditingLevel) {
      setLevel(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditingName || isEditingLastName || isEditingEmail || isEditingLevel) {
      console.log('Datos actualizados:', { name, lastName, email, level });
      setIsEditingName(false);
      setIsEditingLastName(false);
      setIsEditingEmail(false);
      setIsEditingLevel(false);
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

  const handleEditLevel = () => {
    setIsEditingLevel(true);
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

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="level"
          label="Nivel"
          name="level"
          value={level}
          onChange={handleLevelChange}
          InputProps={{
            readOnly: !isEditingLevel,
          }}
        />
        {!isEditingLevel && (
          <Button variant="outlined" onClick={handleEditLevel}>
            Editar
          </Button>
        )}

        {(isEditingName || isEditingLastName || isEditingEmail || isEditingLevel) && (
          <SubmitButton type="submit" fullWidth variant="contained" color="primary">
            Guardar cambios
          </SubmitButton>
        )}
      </Form>
    </Root>
  );
}

export default Perfil;
