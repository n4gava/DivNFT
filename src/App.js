import Layout from "./Components/Layout"
import Home from "./Pages/Home"
import Mint from "./Pages/Mint"
import Sample from "./Pages/Sample"
import MyNft from "./Pages/MyNFTs"
import { Routes, Route } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import { ContractsProvider } from "./Contexts/contracts"


function App() {
    return (
        <ContractsProvider>
            <ReactNotification />
            <Layout>
                <Routes>
                    <Route path="/mint" element={<Mint />} />
                    <Route path="/sample" element={<Sample />} />
                    <Route path="/mynft" element={<MyNft />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </Layout>
        </ContractsProvider>
    )
}

export default App
