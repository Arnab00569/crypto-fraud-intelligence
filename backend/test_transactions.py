from blockchain.transactions import get_eth_transactions


wallet = "0xd061C58B239D9f1c42D6a94aC8Ca276Cc3eA2142"


transactions = get_eth_transactions(
    wallet,
    max_count=10
)


print("\nWallet:", wallet)
print("Transactions:", len(transactions))


for tx in transactions:

    print("\n--------------------------------")

    print(
        "Direction:",
        tx.get("direction")
    )

    print(
        "From:",
        tx.get("from")
    )

    print(
        "To:",
        tx.get("to")
    )

    print(
        "Value:",
        tx.get("value"),
        tx.get("asset")
    )

    print(
        "Hash:",
        tx.get("hash")
    )

    metadata = tx.get(
        "metadata",
        {}
    )

    print(
        "Timestamp:",
        tx.get("blockTimestamp")
    )
