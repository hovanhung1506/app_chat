import React from 'react';
import { BiPowerOff } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    color: #ebe7ff;
  }
`;

const Logout = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
};

export default Logout;
