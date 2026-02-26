export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
      
      <div className="flex items-start gap-4">
        
        <div className="text-blue-600 text-2xl">
          🔐
        </div>

        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-2 tracking-wide uppercase">
            Architecture Overview
          </h3>

          <p className="text-sm text-blue-800 leading-relaxed mb-3">
            Risk is computed off-chain using behavioral replay analysis and 
            cryptographically enforced on-chain via an authorized signer. 
            Smart contract state transitions are fully verifiable on BSC Testnet.
          </p>

          <p className="text-xs text-blue-700 font-medium">
            Powered by ECDSA signature verification and replay-protected nonce logic.
          </p>
        </div>

      </div>

    </div>
  );
}