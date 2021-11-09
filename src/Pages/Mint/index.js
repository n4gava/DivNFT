import { useState, useContext } from "react"
import "./mint.css"
import ContractsContext from "../../Contexts/contracts"
import { store } from "react-notifications-component"
import BigNumber from "bignumber.js"

const showErrorNotification = (message) => {
    store.addNotification({
        title: "Failed to mint",
        message: message,
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: {
            duration: 4000,
            onScreen: true,
        },
    })
}

const showSucceedMessage = (nftData) => {
    store.addNotification({
        title: "Success",
        message: `You minted NFT Token id ${nftData.tokenId}`,
        type: "success",
        insert: "top",
        container: "top-center",
        dismiss: {
            duration: 10000,
            onScreen: true,
        },
    })
}

const Mint = () => {
    const [uri, setUri] = useState("")
    const [price, setPrice] = useState("")
    const [minting, setMinting] = useState(false)
    const { divNFTContract, address, ERC20_DECIMALS } = useContext(ContractsContext)

    

    const mintNFT = async (e) => {
        e.preventDefault()
        if (!uri) return showErrorNotification("Div identification should be informed")

        setMinting(true)
        const uint256Price = price ? new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString() : 0;
        try {
            await divNFTContract.methods.mint(uri, uint256Price).send({ from: address })
            const nftData = await divNFTContract.methods.getTokenDataByUri(uri).call()
            setMinting(false)
            showSucceedMessage(nftData)
        } catch (e) {
            setMinting(false)
            showErrorNotification(e.message)
        }
    }

    return (
        <>
            <h1 className="cover-heading">Mint a NFT for your Website</h1>
            <p className="lead">Use div-nfs.js package to shows and sell it in your website</p>
            <p className="lead"></p>
            <form className="mint-nft-form" onSubmit={mintNFT}>
                <div className="form-group text-start">
                    <label htmlFor="url">Div identification</label>
                    <input
                        id="url"
                        onChange={(e) => setUri(e.target.value)}
                        value={uri}
                        type="text"
                        className="form-control"
                        aria-describedby="url-help"
                        placeholder="my-web-page-div-unique-identification"
                    />
                    <small id="url-help" className="form-text text-muted">
                        Enter a unique identification for your div.
                    </small>
                </div>
                <div className="form-group text-start">
                    <label htmlFor="div-id">Price</label>
                    <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">
                            cUSD
                        </span>
                        <input
                            id="div-id"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            type="number"
                            className="form-control"
                            aria-describedby="div-id-help"
                            placeholder="0.00"
                        />
                    </div>
                    <small id="div-id-help" className="form-text text-muted">
                        Enter the NFT price. 0 for not for sale.
                    </small>
                </div>
                <p className="lead"></p>
                <p className="lead">
                    {minting ? (
                        <span className="btn btn-lg btn-secondary">Minting</span>
                    ) : (
                        <button className="btn btn-lg btn-secondary">Mint NFT</button>
                    )}
                </p>
            </form>
        </>
    )
}

export default Mint
