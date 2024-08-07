import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();

  const fetchMessages = async () => {
    const token = sessionStorage.getItem('authToken');
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/inbox`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };

  const { data, isMessagesLoading, isError } = useQuery('messages', fetchMessages, {
    onSuccess: (data) => setMessages(data),
  });

  const deleteMessage = useMutation(
    async (messageId) => {
      const token = sessionStorage.getItem('authToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/delete/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages'); // Refetch messages after deletion
      },
    }
  );

  const markAsRead = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isMessagesLoading,
        isError,
        deleteMessage: deleteMessage.mutate,
        markAsRead,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
