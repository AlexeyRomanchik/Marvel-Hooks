import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const RandomChar = () => {
    const [character, setCharacter] = useState({}),
        [loading, setLoading] = useState(true),
        [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, []);

    const onError = () => {
        setCharacter({});
        setLoading(false);
        setError(true);
    }

    const resetLoading = () => {
        setLoading(true);
        setError(false);
    }

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        resetLoading();

        marvelService.getCharacter(id)
            .then(character => onCharacterLoaded(character))
            .catch(onError);
    }

    const onCharacterLoaded = (character) => {
        setCharacter(character);
        setLoading(false);
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <RandomCharView character={character} /> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                    onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )

}

const RandomCharView = ({ character }) => {
    const { name, description, thunbnail, homepage, wiki } = character;

    const imageStyle = character.thunbnail.indexOf("image_not_available.jpg") > -1 ?
        { objectFit: "fill" } : null;

    return (
        <div className="randomchar__block">
            <img src={thunbnail} alt="Random character" style={imageStyle} className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RandomChar;