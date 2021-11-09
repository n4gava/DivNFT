import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1 className="cover-heading">Create a NFT for your Website</h1>
            <p className="lead">Div NFT allows you to sell a part of your website.</p>
            <p className="lead">
                <Link className="btn btn-lg btn-secondary" to="/mint">Mint my first Div NFT</Link>
            </p>
        </>
    )
}

export default Home;
