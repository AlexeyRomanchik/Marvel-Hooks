import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

class CharList extends Component {

    state = {
        characters: [],
        loading: true,
        error: false,
        itemsLoading: false,
        offset: 210,
        charactersEnded: false
    }

    itemRefs = [];

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharacters();
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            this.updateCharacters(this.state.offset);
        }
    }

    onItemFocus = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    onCharacterSelected = (id) => {
        this.props.onCharSelected(id)
    }

    updateCharacters = (offset) => {
        console.log("update");
        this.onItemsLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersLoaded)
            .catch(this.onError);
    }

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    onItemsLoading = () => this.setState({ itemsLoading: true });

    onCharactersLoaded = (newCharacters) => {
        const ended = newCharacters.length < 9 ? true : false;

        this.setState(({ characters, offset }) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            itemsLoading: false,
            offset: offset + 9,
            charactersEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            characters: [],
            loading: false,
            error: true
        });
    }

    renderCharacters(characters) {
        const listCharacters = characters.map((character, i) => {
            const imageStyle = character.thunbnail.indexOf("image_not_available.jpg") > -1 ?
                { objectFit: "fill" } : null;

            let itemClassName = "char__item";
            if (this.state.activeCharacter === character.id) {
                itemClassName += " char__item_selected";
            }

            return (
                <li className={itemClassName}
                    key={character.id}
                    tabIndex={0}
                    onClick={() => {
                        this.onCharacterSelected(character.id);
                        this.onItemFocus(i);
                    }}
                    ref={this.setRef}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.onCharacterSelected(character.id)
                            this.onItemFocus(i);
                        }
                    }}>
                    <img src={character.thunbnail} alt={character.name}
                        style={imageStyle} />
                    <div className="char__name">{character.name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {listCharacters}
            </ul>
        );
    }

    render() {
        const { characters, loading, error, itemsLoading, offset, charactersEnded } = this.state,
            charactersList = this.renderCharacters(characters);

        const errorMessage = error ? <ErrorMessage /> : null,
            spinner = loading ? <Spinner /> : null,
            content = !(loading || error) ? charactersList : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    disabled={itemsLoading}
                    style={{ display: charactersEnded ? "none" : "block" }}
                    onClick={() => this.updateCharacters(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div >
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;