from blockchain.transactions import (
    get_eth_transactions
)

from blockchain.graph import (
    create_transaction_graph
)

from blockchain.risk import (
    calculate_risk_score
)


wallet = "0xA4306A80778794464DB67D2c734F36f27aB9633a"


print("\nFetching transactions...")

transactions = get_eth_transactions(
    wallet,
    max_count=20
)


print(
    "Transactions found:",
    len(transactions)
)


print("\nBuilding graph...")

graph = create_transaction_graph(
    transactions
)


print(
    "Wallets in graph:",
    graph.number_of_nodes()
)


print(
    "Transaction links:",
    graph.number_of_edges()
)


print("\nCalculating risk...")


risk = calculate_risk_score(
    graph,
    wallet,
    transactions
)


print("\n================================")
print("CRYPTO WALLET RISK ANALYSIS")
print("================================")


print(
    "Wallet:",
    wallet
)


print(
    "Risk Score:",
    risk["risk_score"],
    "/ 100"
)


print(
    "Risk Level:",
    risk["risk_level"]
)


print(
    "Transaction Count:",
    risk["transaction_count"]
)


print(
    "Incoming Connections:",
    risk["incoming_connections"]
)


print(
    "Outgoing Connections:",
    risk["outgoing_connections"]
)


print(
    "Counterparties:",
    risk["counterparty_count"]
)


print(
    "Maximum Transaction:",
    risk["maximum_transaction_value"]
)


print("\nRisk Indicators:")


if not risk["indicators"]:

    print(
        "- No significant indicators detected"
    )

else:

    for indicator in risk["indicators"]:

        print(
            "-",
            indicator
        )