import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import WordButton from '../components/buttons/WordButton';
import ExchangePreview from '../components/books/ExchangePreview';
import { PageHeader, Content } from '../assets/styles/GlobalStyles';
import ActionButton from '../components/buttons/ActionButton';
import axios from 'axios';

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const { book, bookOwner } = location.state;
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('authToken');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/send`,
        {
          bookId: book.id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Redirect to the dashboard or a confirmation page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error, perhaps show an error message
    }
  };

  return (
    <section>
      <PageHeader>
        <h1>Contact</h1>
        <WordButton to="/dashboard" text="Return" />
      </PageHeader>

      <Content>
        <ExchangePreview book={book} bookOwner={bookOwner} />
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <ActionButton type="action" text="Submit"/>
        </Form>
      </Content>
    </section>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  height: 150px;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid var(--greyGreen);
  border-radius: var(--xs);
  margin-bottom: 1rem;
  resize: vertical;
`;