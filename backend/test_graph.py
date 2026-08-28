from blockchain.transactions import get_eth_transactions
from blockchain.graph import (
    create_transaction_graph,
    get_wallet_metrics,
    detect_flow_patterns
)


wallet = "0xd061C58B239D9f1c42D6a94aC8Ca276Cc3eA2142"


transactions = get_eth_transactions(
    wallet,
    max_count=20
)


graph = create_transaction_graph(
    transactions
)


print("\n==============================")
print("TRANSACTION GRAPH")
print("==============================")

print(
    "Number of wallets:",
    graph.number_of_nodes()
)

print(
    "Number of transactions:",
    graph.number_of_edges()
)


print("\nWALLETS:")

for node in graph.nodes:

    print(
        "-",
        node
    )


print("\nTRANSACTION LINKS:")

for sender, receiver, data in graph.edges(
    data=True
):

    print(
        sender,
        "→",
        receiver,
        "|",
        data.get("value"),
        data.get("asset")
    )
metrics = get_wallet_metrics(
    graph,
    wallet
)

print("\n==============================")
print("WALLET METRICS")
print("==============================")

print(metrics)


patterns = detect_flow_patterns(
    graph
)

print("\n==============================")
print("DETECTED PATTERNS")
print("==============================")

for pattern in patterns:

    print(pattern)