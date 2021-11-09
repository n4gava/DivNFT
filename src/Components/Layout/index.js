import Header from "../Header"
import Footer from "../Footer"

const Layout = (props) => {
    return (
        <div className="app cover-container d-flex h-100 p-3 mx-auto flex-column">
            <Header />
            <main role="main" className="inner cover flex-grow-1">
                <div className="page inner cover d-flex flex-column flex-grow-1">
                    {props.children}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Layout
