export default function BlockchainStatus({
  walletAddress,
  onChainMode,
  connectWallet,
  txHash
}) {
  const shortAddress =
    walletAddress &&
    `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  let modeStyle = "bg-gray-100 text-gray-700";

  if (onChainMode === "LOCKDOWN") {
    modeStyle = "bg-red-600 text-white";
  } else if (onChainMode === "WARNING") {
    modeStyle = "bg-orange-500 text-white";
  } else if (onChainMode === "NORMAL") {
    modeStyle = "bg-green-600 text-white";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-xl font-semibold mb-6">
        Live Blockchain Status
      </h2>

      <button
        onClick={connectWallet}
        className="bg-black text-white px-4 py-2 rounded-lg mb-6 hover:opacity-90 transition"
      >
        Connect MetaMask
      </button>

      {/* Wallet */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          Connected Wallet
        </p>
        <p className="font-medium">
          {walletAddress ? shortAddress : "Not Connected"}
        </p>
      </div>

      {/* Mode */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          On-Chain Mode
        </p>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${modeStyle}`}>
          {onChainMode || "Not Fetched"}
        </span>
      </div>

      {/* Transaction */}
      {txHash && (
        <div className="p-5 bg-gray-50 border rounded-xl">
          <p className="text-sm font-medium text-green-700 mb-2">
            ✔ Transaction Confirmed On-Chain
          </p>

          <a
            href={`https://testnet.bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm break-all"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-6)}
          </a>
        </div>
      )}
    </div>
  );
}