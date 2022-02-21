import './charInfo.scss';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setContent } from '../../utils/setContent';
import { state } from '../../hooks/useHttp';

const CharInfo = ({ id }) => {
    const [character, setCharacter] = useState(null),
        { getCharacter, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [id]);

    const updateChar = () => {
        if (!id) {
            return;
        }
        getCharacter(id)
            .then(onCharacterLoaded)
            .then(() => setProcess(state.confirmed));
    }

    const onCharacterLoaded = (character) => {
        setCharacter(character);
    }

    return (
        <div className="char__info">
            {setContent(process, CharInfoView, character)}
        </div>
    )

}

const CharInfoView = ({ data }) => {
    const { name, description, thunbnail, homepage, wiki, comics } = data;

    const imageStyle = data.thunbnail.indexOf("image_not_available.jpg") > -1 ?
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