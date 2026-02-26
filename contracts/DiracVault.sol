// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DiracVault {

    address public owner;
    address public recoverySigner;
    address public riskSigner;

    enum Mode { NORMAL, WARNING, LOCKDOWN }
    Mode public currentMode;

    uint256 public riskScore;
    mapping(uint256 => bool) public usedNonces;

    bool private locked;

    event Deposit(address indexed sender, uint256 amount);
    event TransferExecuted(address indexed to, uint256 amount);
    event RiskUpdated(uint256 newScore, Mode newMode);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notLockedDown() {
        require(currentMode != Mode.LOCKDOWN, "LOCKDOWN active");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _recoverySigner, address _riskSigner) {
        require(_recoverySigner != address(0), "Invalid recovery signer");
        require(_riskSigner != address(0), "Invalid risk signer");

        owner = msg.sender;
        recoverySigner = _recoverySigner;
        riskSigner = _riskSigner;
        currentMode = Mode.NORMAL;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function transferBNB(address payable to, uint256 amount)
        external
        onlyOwner
        notLockedDown
        nonReentrant
    {
        require(address(this).balance >= amount, "Insufficient balance");

        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit TransferExecuted(to, amount);
    }

    function updateRisk(
        uint256 newScore,
        uint256 nonce,
        bytes memory signature
    ) external {

        require(!usedNonces[nonce], "Nonce used");
        require(newScore <= 100, "Invalid risk");

        bytes32 messageHash = keccak256(
            abi.encodePacked(address(this), newScore, nonce)
        );

        bytes32 ethSignedMessageHash =
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    messageHash
                )
            );

        address recovered = recoverSigner(
            ethSignedMessageHash,
            signature
        );

        require(recovered == riskSigner, "Invalid signer");

        usedNonces[nonce] = true;
        riskScore = newScore;

        if (newScore > 80) {
            currentMode = Mode.LOCKDOWN;
        } else if (newScore > 50) {
            currentMode = Mode.WARNING;
        } else {
            currentMode = Mode.NORMAL;
        }

        emit RiskUpdated(newScore, currentMode);
    }

    function recoverSigner(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        require(sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return ecrecover(hash, v, r, s);
    }

    function emergencyRecover(address newOwner) external {
        require(msg.sender == recoverySigner, "Not recovery signer");
        owner = newOwner;
        currentMode = Mode.NORMAL;
    }

    function getMode() external view returns (Mode) {
        return currentMode;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}