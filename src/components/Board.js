import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';
import CARD_DATA from '../data/card-data.json';

const API_CARDS_URL = 'https://inspiration-board.herokuapp.com/cards'

const Board = (props) => {

  const [cards, setCards] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios.get(`${props.url}${props.boardName}/cards`)
      .then( (response) => {
        const apiCards = response.data;
        setCards(apiCards);
      })
      .catch( (error) => {
        setErrorMessage(error.message);
        console.log(error.message);
      });
  }, []);

  const deleteCard = (id) => {

    const newCards = cards.filter((singleCard) => {
      return singleCard.card.id !== id;
    }) 

    if (newCards.length < cards.length) {
      axios.delete(`${API_CARDS_URL}/${id}`)
      .then((response) => {
        setErrorMessage(`Card ${id} was deleted!`);
        setCards(newCards);
      })
      .catch((error) => {
        setErrorMessage(`Unable to delete card #${id}`);
      })
      
    }
  }

  const addCard = (card) => {
    axios.post(`${props.url}${props.boardName}/cards`, card)
      .then( response => {
        const newCard = [...cards, response.data]
        setCards(newCard)
        setErrorMessage('')
      })
      .catch( error => {
        setErrorMessage(error.message)
      });
  };


  const cardComponents = cards.map(({card}) => {
    return (
      <Card text={card.text} emojiText={card.emoji} key={card.id} id={card.id} onDeleteCallback={deleteCard}/>
    )
  })
  return (
    <div className="board">
      <NewCardForm onAddCallBack={addCard}/>
      { errorMessage ? <div className='validation-errors-display'>
          <ul className='validation-errors-display__list'>{ errorMessage }</ul>
          </div> : '' }
      {cardComponents}
    </div>
  )
};
Board.propTypes = {
  url: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired
};

export default Board;
