from blockchain.ethereum import is_connected, get_latest_block


print("Connected:", is_connected())
print("Latest block:", get_latest_block())