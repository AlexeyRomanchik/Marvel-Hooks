import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import decoration from '../../resources/img/vision.png';
import { useState } from "react";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

const App = () => {
    const [charId, setCharId] = useState(null);

    const onCharIdUpdated = (id) => setCharId(id);

    return (
        <div className="app">
            <AppHeader />
            <main>
                {/* <ErrorBoundary>
                    <RandomChar />
                </ErrorBoundary>
                <div className="char__content">
                    <ErrorBoundary>
                        <CharList onCharSelected={onCharIdUpdated} />
                        <CharInfo id={charId} />
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision" /> */}
                <AppBanner />
                <ComicsList />
            </main>
        </div>
    )
}

export default App;