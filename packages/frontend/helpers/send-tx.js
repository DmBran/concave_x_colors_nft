import toast from 'react-hot-toast'

export const sendTx = async (web3, { cost, to, from, data, count, fee }) => {
  let txToast
  try {
    web3.eth.transactionBlockTimeout = Infinity;
    const txCost = web3.utils.toBN(web3.utils.toWei(cost, 'ether'))
    if (fee) {
      txCost.iadd(web3.utils.toBN(web3.utils.toWei(fee, 'ether')))
    }

    txCost.imul(web3.utils.toBN(count))
    const value = txCost
    console.log(value)
    console.log(value.toString())
    console.log(web3.utils.fromWei(value, 'ether'))
    txToast = toast.loading((t) => (
      <div>
        <span className={'block'}>Transaction Processing</span>
        <span className={'block mt-1 text-xs'}>Please do not leave page.</span>
      </div>
    ))
    console.log(data)

    const gasEstimate = await web3.eth.estimateGas({
      value,
      from,
      data,
      to,
    })

    // The BUFFOOOOOR
    const gas = parseInt(gasEstimate * 1.11)

    const txData = {
      value,
      from,
      data,
      gas,
      to,
    }

    const tx = await web3.eth.sendTransaction(txData, from)
    console.log(tx)

    if (!tx?.transactionHash) throw 'Error'

    toast.success(
      <div>
        <span className={'block'}>Transaction Successful!</span>
        <a
          className={'block mt-1 underline'}
          target="_blank"
          href={`https://${
            Number(process.env.NEXT_PUBLIC_NETWORK) === 3 ? 'ropsten.' : ''
          }etherscan.io/tx/${tx.transactionHash}`}
          className={'block text-xs'}
        >
          View on Etherscan
        </a>
      </div>,
      { id: txToast }
    )
    return tx
  } catch (ex) {
    console.log(ex)
    let error = 'Transaction failed!'
    if (/err: insufficient funds/.test(ex.message))
      error = 'Insufficient funds!'
    else if (/was not mined within/.test(ex.message))
      error = "Transaction Timeout. Verify status on Etherscan before proceeding!"
    if (txToast) {
      toast.error(error, { id: txToast })
    }
  }
}
