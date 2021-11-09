import { createContext, useEffect, useState, useCallback } from "react"
import DivNFTContractAbi from "../Contracts/DivNFT.abi.json"
import erc20Abi from "../Contracts/erc20.abi.json"
import Web3 from "web3"
import { store } from "react-notifications-component"
import { newKitFromWeb3 } from "@celo/contractkit"

const ContractsContext = createContext()
const ERC20_DECIMALS = 18
const divNFTContractAddress = "0xBa167453C63Fc2541A8509B3990e3CcBd6B7630D"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

const showMissingExtensionNotification = () => {
    store.addNotification({
        title: "Missing Celo wallet",
        message: "Please install the Celo browser extension.",
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: {
            duration: 4000,
            onScreen: true,
        },
    })
}

const ContractsProvider = (props) => {
    const [divNFTContract, setDivNFTContract] = useState(null)
    const [cUSDContract, setCUSDContract] = useState(null)
    const [contractKit, setContractKit] = useState(null)
    const [networkReady, setNetworkReady] = useState(false)
    const [address, setAddress] = useState(false)

    const accountChanged = (accounts) => {
        setAddress(accounts[0])
    }
    const connectToCeloNetwork = useCallback(async () => {
        if (!window.celo) {
            showMissingExtensionNotification()
            return
        }
        await window.celo.enable()
        window.celo.on("accountsChanged", accountChanged)

        const web3 = new Web3(window.celo)
        const kit = newKitFromWeb3(web3)

        const accounts = await kit.web3.eth.getAccounts()
        setAddress(accounts[0])
        setContractKit(kit)
    }, [])

    const approve = useCallback(
        async (price) => {
            const result = await cUSDContract.methods
                .approve(divNFTContractAddress, price)
                .send({ from: address })
            return result
        },
        [address, cUSDContract]
    )

    useEffect(() => {
        if (contractKit) {
            const divNFTContract = new contractKit.web3.eth.Contract(
                DivNFTContractAbi,
                divNFTContractAddress
            )
            setDivNFTContract(divNFTContract)
            const cUSDContract = new contractKit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
            setCUSDContract(cUSDContract)
            setNetworkReady(true)
        }
    }, [contractKit])

    useEffect(() => {
        if (window.celo) connectToCeloNetwork()
    }, [connectToCeloNetwork])

    return (
        <ContractsContext.Provider
            value={{
                address,
                divNFTContract,
                cUSDContract,
                contractKit,
                networkReady,
                ERC20_DECIMALS,
                connectToCeloNetwork,
                approve
            }}
        >
            {props.children}
        </ContractsContext.Provider>
    )
}

export { ContractsContext as default, ContractsProvider }
