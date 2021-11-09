import { useContext, useEffect, useState, useCallback } from "react"
import ContractsContext from "../../Contexts/contracts"
import "./nft-area.css"
import BigNumber from "bignumber.js"
import { store } from "react-notifications-component"

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

const showSucceedMessage = (message) => {
    store.addNotification({
        title: "Success",
        message: message,
        type: "success",
        insert: "top",
        container: "top-center",
        dismiss: {
            duration: 10000,
            onScreen: true,
        },
    })
}

const emptyImage =
    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg"

const NFTArea = ({ nft, onChange }) => {
    const { ERC20_DECIMALS, networkReady, address, divNFTContract, approve } =
        useContext(ContractsContext)
    const [isOwner, setIsOwner] = useState(false)
    const [configIsOpen, setConfigIsOpen] = useState(false)
    const [content, setContent] = useState(nft.content)
    const [destinationUrl, setDestinationUrl] = useState(nft.destinationUrl)
    const [price, setPrice] = useState(new BigNumber(nft.price).shiftedBy(-ERC20_DECIMALS).toFixed(2))

    useEffect(() => {
        if (!nft.owner || !address) return false
        setIsOwner(nft.owner.toLowerCase() === address.toLowerCase())
    }, [address, nft.owner])

    const changeNFTContent = useCallback(
        async (e) => {
            e.preventDefault()
            const uint256Price = price ? new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString() : 0;
            try {
                await divNFTContract.methods
                    .changeContentAndPriceByTokenId(nft.tokenId, uint256Price, content, destinationUrl)
                    .send({ from: address })

                const newData = await divNFTContract.methods
                    .getTokenDataByTokenId(nft.tokenId)
                    .call()
                onChange(newData)
                setConfigIsOpen(false)
            } catch (e) {
                showErrorNotification(e.message)
            }
        },
        [content, destinationUrl, address, price, divNFTContract, onChange, nft.tokenId, ERC20_DECIMALS]
    )

    const buyNft = useCallback(async () => {
        if (isOwner) return false
        try {
            await approve(nft.price)
            await divNFTContract.methods.buyNFT(nft.tokenId).send({ from: address })

            const newData = await divNFTContract.methods.getTokenDataByTokenId(nft.tokenId).call()
            onChange(newData)
            showSucceedMessage("NFT bought successfully")
        } catch (e) {
            showErrorNotification(e.message)
        }
    }, [isOwner, nft.tokenId, nft.price, approve, address, divNFTContract, onChange])

    const navigateToDestinationUrl = useCallback(() => {
        if (nft.destinationUrl) window.open(nft.destinationUrl).focus()
    }, [nft.destinationUrl])

    const renderOwner = useCallback(() => {
        return isOwner ? (
            <span className="border rounded-pill p-1 me-1 bg-primary border-primary">Owner</span>
        ) : null
    }, [isOwner])

    const renderPrice = useCallback(() => {
        const price =
            nft.price > 0 ? new BigNumber(nft.price).shiftedBy(-ERC20_DECIMALS).toFixed(2) : 0

        if (!price || price === 0)
            return (
                <span
                    className="border rounded-pill p-1 bg-danger border-danger"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    Not for sale
                </span>
            )

        return (
            <span
                className="btn-label border rounded-pill p-1 bg-success border-success"
                onClick={(e) => {
                    e.stopPropagation()
                    buyNft()
                }}
            >
                cUSD {price}
            </span>
        )
    }, [nft.price, ERC20_DECIMALS, buyNft])

    const renderConfigButton = useCallback(() => {
        if (!isOwner) return
        return (
            <i
                className="btn-label bi bi-gear-fill fs-6"
                onClick={(e) => {
                    e.stopPropagation()
                    setConfigIsOpen(true)
                }}
            ></i>
        )
    }, [isOwner])

    const renderBackButton = useCallback(() => {
        return (
            <i
                className="btn-label bi bi-backspace-fill fs-6"
                onClick={() => {
                    setConfigIsOpen(false)
                }}
            ></i>
        )
    }, [])

    const renderNftArea = useCallback(() => {
        const style = nft.destinationUrl ? { cursor: "pointer" } : {}
        return (
            <div
                className="nft-area-body d-flex flex-column m-1"
                style={style}
                onClick={navigateToDestinationUrl}
            >
                <div className="d-inline-flex p-1 flex-grow-1">
                    <div className="flex-grow-1 text-start">
                        {renderOwner()}
                        {renderPrice()}
                    </div>
                    {renderConfigButton()}
                </div>
                <div className="d-inline-flex p-1">
                    <div className="flex-grow-1 text-start fs-6">NFT: {nft.tokenId}</div>
                </div>
            </div>
        )
    }, [nft, renderConfigButton, renderOwner, renderPrice, navigateToDestinationUrl])

    const renderNftSettings = () => {
        return (
            <div className="nft-area-body d-flex flex-column m-1">
                <div className="d-inline-flex p-1 flex-grow-1">
                    <div className="flex-grow-1 text-end">{renderBackButton()}</div>
                </div>
                <form className="nft-area-form" onSubmit={changeNFTContent}>
                    <div className="form-group text-start mb-1">
                        <div className="input-group">
                            <span className="input-group-text p-0 ps-1 pe-1">Image</span>
                            <input
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                                type="text"
                                className="form-control form-control-sm p-0"
                                placeholder="https://www.mypage.com/image.png"
                            />
                        </div>
                    </div>
                    <div className="form-group text-start mb-1">
                        <div className="input-group">
                            <span className="input-group-text p-0 ps-1 pe-1">Href</span>
                            <input
                                onChange={(e) => setDestinationUrl(e.target.value)}
                                value={destinationUrl}
                                type="text"
                                className="form-control form-control-sm p-0"
                                placeholder="https://www.mypage.com/"
                            />
                        </div>
                    </div>
                    <div className="form-group text-start mb-1">
                        <div className="input-group">
                            <span className="input-group-text p-0 ps-1 pe-1">cUSD</span>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                type="text"
                                className="form-control form-control-sm p-0"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <p className="lead">
                        <button className="btn btn-sm btn-secondary">Update</button>
                    </p>
                </form>
            </div>
        )
    }

    if (!networkReady) return
    return (
        <div className="card nft-area">
            <img className="nft-img" src={nft.content || emptyImage} alt={nft.tokenId} />
            {configIsOpen ? renderNftSettings() : renderNftArea()}
        </div>
    )
}

export default NFTArea
