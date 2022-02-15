export const isZeroAddress = async (address) => {
  return address.toLowerCase() === '0x0000000000000000000000000000000000000000'
}
