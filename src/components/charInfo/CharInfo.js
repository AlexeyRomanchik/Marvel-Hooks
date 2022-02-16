import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';


class CharInfo extends Component {

    state = {
        character: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.updateChar();
        }
    }

    componentDidMount() {
        this.updateChar();
    }

    updateChar = () => {
        const { id } = this.props;
        if (!id) {
            return;
        }

        this.onCharLoading();

        this.marvelService.getCharacter(id)
            .then(this.onCharacterLoaded)
            .catch(this.onError);
    }

    onCharacterLoaded = (character) => {
        this.setState({ character, loading: false });
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render() {
        const { character, loading, error } = this.state;

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
                    return (
                        <li key={index} className="char__comics-item">
                            {item.name}
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