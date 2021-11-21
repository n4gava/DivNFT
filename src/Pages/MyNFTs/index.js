import { useContext, useEffect, useState } from "react"
import ContractsContext from "../../Contexts/contracts"
import "./sample.css"
import NFTArea from "../../Components/NFTArea"

const MyNft = () => {
    const { divNFTContract, address } = useContext(ContractsContext)
    const [lastTokenId, setLastTokenId] = useState(0)
    const [myNfts, setMyNfts] = useState([])
    const [loading, setLoading] = useState(false)

    const updateNft = (nft) => {
        const newNfts = myNfts.filter((n) => n.tokenId !== nft.tokenId)
        setMyNfts([...newNfts, nft].sort((a, b) => a.tokenId - b.tokenId))
    }

    useEffect(() => {
        const getNfts = async () => {
            setLoading(true)
            let nfts = []
            for (let i = 1; i <= lastTokenId; i++) {
                const token = await divNFTContract.methods.getTokenDataByTokenId(i).call()
                if (token.tokenId > 0) nfts.push(token)
            }
            nfts = nfts.filter((nft) => nft.owner === address)
            setMyNfts(nfts)
            setLoading(false)
        }
        if (divNFTContract) getNfts()
    }, [lastTokenId, divNFTContract, address])

    useEffect(() => {
        const getLastTokenId = async () => {
            setLoading(true)
            const lastTokenId = await divNFTContract.methods.getLastTokenId().call()
            setLastTokenId(lastTokenId)
            setLoading(false)
        }
        if (divNFTContract) getLastTokenId()
    }, [divNFTContract])

    return (
        <div className="d-flex-column">
            <h1 className="cover-heading">Minted NFTs</h1>
            {loading && <p className="lead">Loading...</p>}
            <div className="nfts-container d-flex flex-row flex-wrap flex-grow-1">
                {myNfts.map((nft, index) => {
                    return (
                        <div key={index} className="col-md-6 col-lg-4 col-12 p-2">
                            <NFTArea nft={nft} onChange={updateNft} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyNft
