import { useContext, useEffect, useState } from "react"
import ContractsContext from "../../Contexts/contracts"

const WalletInfo = () => {
    const [balance, setBalance] = useState(0)
    const { address, networkReady, connectToCeloNetwork, contractKit, ERC20_DECIMALS } = useContext(ContractsContext)

    useEffect(() => {
        const getBalance = async () => {
            if (!networkReady) {
                setBalance(0)
                return
            }

            const totalBalance = await contractKit.getTotalBalance(address)
            setBalance(totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2))
        }

        getBalance()
    }, [networkReady, contractKit, ERC20_DECIMALS, address])

    const renderConnectWallet = () => {
        return (
            <button className="border rounded-pill btn-secondary" onClick={connectToCeloNetwork}>
                Connect Wallet
            </button>
        )
    }

    const renderConnectNetworkBalance = () => {
        return (
            <button className="border rounded-pill btn-secondary">
                <span id="balance">{balance} </span>
                cUSD
            </button>
        )
    }

    return networkReady ? renderConnectNetworkBalance() : renderConnectWallet()
}

export default WalletInfo
