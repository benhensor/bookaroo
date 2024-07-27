import React, { useState } from 'react';
import axios from 'axios';

const Listing = () => {
  const [formData, setFormData] = useState({
    isbn: '',
    coverImg: '', // URL
    title: '',
    author: '',
    publishedDate: '', // YYYY-MM-DD
    publisher: '',
    genre: '',
    condition: '',
    notes: '',
  });

  const { 
    isbn,
    coverImg,
    title, 
    author,
    publishedDate,
    publisher,
    genre,
    condition,
    notes,
     
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/books', formData, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="isbn"
        value={isbn}
        onChange={onChange}
        placeholder="ISBN"
        required
      />
      <input
        type="text"
        name="coverImg"
        value={coverImg}
        onChange={onChange}
        placeholder="Cover Image URL"
        required
      />
      <input
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        placeholder="Title"
        required
      />
      <input
        type="text"
        name="author"
        value={author}
        onChange={onChange}
        placeholder="Author"
        required
      />
      <input
        type="date"
        name="publishedDate"
        value={publishedDate}
        onChange={onChange}
        placeholder="Published Date"
        required
      />
      <input
        type="text"
        name="publisher"
        value={publisher}
        onChange={onChange}
        placeholder="Publisher"
        required
      />
      <input
        type="text"
        name="genre"
        value={genre}
        onChange={onChange}
        placeholder="Genre"
        required
      />
      <select
        name="condition"
        value={condition}
        onChange={onChange}
        required
      >
        <option value="">Select Condition</option>
        <option value="New">New</option>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Poor">Poor</option>
      </select>
      <input
        type="textarea"
        name="notes"
        value={notes}
        onChange={onChange}
        placeholder="Notes"
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default Listing;
