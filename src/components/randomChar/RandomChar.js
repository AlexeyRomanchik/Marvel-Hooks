import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import Spinner from '../spinner/Spinner'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar();
    }

    state = {
        character: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    onCharacterLoaded = (character) => {
        this.setState({ character, loading: false });
    }

    onError = () => {
        this.setState({
            character: {},
            loading: false,
            error: true
        });
    }

    resetLoading = () => {
        this.setState({ loading: true, error: false });
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        this.resetLoading();

        this.marvelService.getCharacter(id)
            .then(character => this.onCharacterLoaded(character))
            .catch(this.onError);
    }

    render() {
        const { character, loading, error } = this.state;
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
                        onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
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