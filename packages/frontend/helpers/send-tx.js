import toast from 'react-hot-toast'

export const sendTx = async (web3, { cost, to, from, data, count }) => {
  let txToast
  try {
    const ethAmount = web3.utils.toWei(cost, 'ether')
    const value = (count ?? 1) * ethAmount

    txToast = toast.loading('Transaction processing')

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

    if (!tx?.transactionHash) throw 'Error'

    toast.success('Transaction successful!', { id: txToast })
    return tx
  } catch (ex) {
    console.log(ex)
    let error = 'Transaction failed!'
    if (/err: insufficient funds for gas/.test(ex.message))
      error = 'Insufficient gas funds!'
    else if (/err: insufficient funds/.test(ex.message))
      error = 'Insufficient funds!'
    if (txToast) {
      toast.error(error, { id: txToast })
    }
  }
}
