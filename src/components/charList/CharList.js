import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

const CharList = ({ onCharSelected }) => {
    const [characters, setCharacters] = useState([]),
        [itemsLoading, setItemsLoading] = useState(false),
        [offset, setOffset] = useState(210),
        [charactersEnded, setCharactersEnded] = useState(false),
        { getAllCharacters, loading, error } = useMarvelService();

    const itemRefs = useRef([]);

    useEffect(() => {
        updateCharacters(offset, true);
    }, []);

    const updateCharacters = (offset, first = false) => {
        setItemsLoading(!first);
        getAllCharacters(offset).then(onCharactersLoaded);
    }

    const onCharactersLoaded = (newCharacters) => {
        const ended = newCharacters.length < 9;

        setCharacters(characters => (
            [...characters, ...newCharacters]
        ));
        setItemsLoading(false);
        setOffset(offset => offset + 9);
        setCharactersEnded(ended);
    }

    const onItemFocus = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const onCharacterSelected = (id) => {
        onCharSelected(id)
    }

    const renderCharacters = (characters) => {
        const listCharacters = characters.map((character, i) => {
            const imageStyle = character.thunbnail.indexOf("image_not_available.jpg") > -1 ?
                { objectFit: "fill" } : null;

            return (
                <CSSTransition key={character.id} timeout={500} classNames="char__item">
                    <li className="char__item"
                    key={character.id}
                    tabIndex={0}
                    onClick={() => {
                        onCharacterSelected(character.id);
                        onItemFocus(i);
                    }}
                    ref={el => itemRefs.current[i] = el}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            onCharacterSelected(character.id)
                            onItemFocus(i);
                        }
                    }}>
                    <img src={character.thunbnail} alt={character.name}
                        style={imageStyle} />
                    <div className="char__name">{character.name}</div>
                </li>
                </CSSTransition>
            );
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                {listCharacters}
                </TransitionGroup>
            </ul>
        );
    }

    const charactersList = renderCharacters(characters);

    const errorMessage = error ? <ErrorMessage /> : null,
        spinner = loading && !itemsLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {charactersList}
            <button className="button button__main button__long"
                disabled={itemsLoading}
                style={{ display: charactersEnded ? "none" : "block" }}
                onClick={() => updateCharacters(offset)}>
                <div className="inner">load more</div>
            </button>
        </div >
    );
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;