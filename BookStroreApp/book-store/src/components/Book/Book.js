import { Button } from '@mui/material';
import React from 'react';
import './Book.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Book = (props) => {
    const history = useNavigate();
    const {_id,name,author,description,price,image}=props.book;
    const deleteHandler = async () => {
        await axios
          .delete(`http://localhost:5000/books/${_id}`)
          .then((res) => res.data)
          .then(() => history("/books"))
          .then(()=>window.location.reload(false));
      };

  return (
    <div className='card'>
        <img src={image} alt={name}></img>
        <article>By {author}</article>
        <h3>{name}</h3>
        <p>{description}</p>
        <h3>Rs. {price}</h3>
        <Button LinkComponent={Link} to={`/books/${_id}`} sx={{mt:'auto'}}>Update</Button>
        <Button onClick={deleteHandler} sx={{mt:'auto'}}>Delete</Button>

    </div>
  )
}

export default Book