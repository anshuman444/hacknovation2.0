import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string> {
  // Check if we are in environment that has ethereum
  if (!window.ethereum) {
    console.warn("MetaMask not found. Initializing MOCK WALLET for Demo Mode...");
    // Return a mock address for the demo
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('mockAddress', mockAddress);
    return mockAddress;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    localStorage.setItem('walletConnected', 'true');
    localStorage.removeItem('mockAddress');
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function disconnectWallet(): Promise<void> {
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('mockAddress');

  if (!window.ethereum) return;

  try {
    // Clear any MetaMask cached permissions
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }]
    });
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    throw error;
  }
}

export async function getConnectedAddress(): Promise<string | null> {
  if (!window.ethereum) {
    return localStorage.getItem('mockAddress');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    return accounts[0] || localStorage.getItem('mockAddress') || null;
  } catch (error) {
    console.error("Error getting connected address:", error);
    return localStorage.getItem('mockAddress') || null;
  }
}

export function listenToAccountChanges(callback: (address: string | null) => void) {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    callback(accounts[0] || null);
  });
}

export async function verifyContract(address: string): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error("Error verifying contract:", error);
    return false;
  }
}