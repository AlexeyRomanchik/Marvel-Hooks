import './charInfo.scss';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CharInfo = ({ id }) => {
    const [character, setCharacter] = useState(null),
        { getCharacter, loading, error } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [id]);

    const updateChar = () => {
        if (!id) {
            return;
        }
        getCharacter(id).then(onCharacterLoaded)
    }

    const onCharacterLoaded = (character) => {
        setCharacter(character);
    }

    const skeleton = character || error || loading ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !character) ? <CharInfoView character={character} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}

const CharInfoView = ({ character }) => {
    const { name, description, thunbnail, homepage, wiki, comics } = character;

    const imageStyle = character.thunbnail.indexOf("image_not_available.jpg") > -1 ?
        { objectFit: "fill" } : null;

    return (
        <>
            <div className="char__basics">
                <img src={thunbnail}
                    alt="abyss"
                    style={imageStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There is no comics with this character"}
                {comics.map((item, index) => {
                    const comicsId = item.resourceURI.match(/\/\d+/);
                    return (
                        <li key={index}>
                            <Link className="char__comics-item" to={`/comics${comicsId}`}>
                                {item.name}
                            </Link>
                        </li>

                    )
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    id: PropTypes.number
}

export default CharInfo;