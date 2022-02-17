import './appHeader.scss';
import { Link, NavLink } from 'react-router-dom';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink end to="/"
                        style={({ isActive }) => ({ color: isActive ? '#9f0013' : 'inherit' })}>Characters</NavLink></li>

                    <li><NavLink end to="/comics"
                        style={({ isActive }) => ({ color: isActive ? '#9f0013' : 'inherit' })}>Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;