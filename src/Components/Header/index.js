import { NavLink } from "react-router-dom"
import WalletInfo from "../WalletInfo"

const Header = () => {
    return (
        <header className="masthead mb-3">
                <h3 className="masthead-brand">Div NFT</h3>
                <nav className="nav nav-masthead justify-content-center">
                    <NavLink className="nav-link" activeclassname="active" to="/">
                        Home
                    </NavLink>
                    <NavLink className="nav-link" activeclassname="active" to="/mint">
                        Mint NFT
                    </NavLink>
                    <NavLink className="nav-link" activeclassname="active" to="/sample">
                        Sample Page
                    </NavLink>
                </nav>
                <div className="wallet-masthead">
                    <WalletInfo />
                </div>
        </header>
    )
}

export default Header
