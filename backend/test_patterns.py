from blockchain.transactions import (
    get_eth_transactions
)

from blockchain.graph import (
    create_transaction_graph
)

from blockchain.patterns import (
    detect_fan_patterns,
    detect_rapid_movements,
    detect_layering
)


wallet = "0xd061C58B239D9f1c42D6a94aC8Ca276Cc3eA2142"


print("\nFetching transactions...")


transactions = get_eth_transactions(
    wallet,
    max_count=50
)


print(
    "Transactions:",
    len(transactions)
)


print("\nBuilding graph...")


graph = create_transaction_graph(
    transactions
)


print(
    "Wallets:",
    graph.number_of_nodes()
)


print(
    "Links:",
    graph.number_of_edges()
)


# ------------------------------------------------
# FAN PATTERNS
# ------------------------------------------------

print("\n==============================")
print("FAN-IN / FAN-OUT ANALYSIS")
print("==============================")


fan_patterns = detect_fan_patterns(
    graph
)


if not fan_patterns:

    print(
        "No strong fan-in/fan-out patterns detected."
    )

else:

    for pattern in fan_patterns:

        print("\nPattern:")
        print(
            pattern["pattern"]
        )

        print(
            "Wallet:",
            pattern["wallet"]
        )

        print(
            "Description:",
            pattern["description"]
        )

        print(
            "Incoming:",
            pattern["incoming"]
        )

        print(
            "Outgoing:",
            pattern["outgoing"]
        )


# ------------------------------------------------
# RAPID MOVEMENT
# ------------------------------------------------

print("\n==============================")
print("RAPID MOVEMENT ANALYSIS")
print("==============================")


rapid = detect_rapid_movements(
    transactions
)


if not rapid:

    print(
        "No rapid fund movements detected."
    )

else:

    for pattern in rapid:

        print("\nWallet:")
        print(
            pattern["wallet"]
        )

        print(
            "Delay:",
            pattern["delay_seconds"],
            "seconds"
        )

        print(
            "Incoming TX:",
            pattern["incoming_tx"]
        )

        print(
            "Outgoing TX:",
            pattern["outgoing_tx"]
        )


# ------------------------------------------------
# LAYERING
# ------------------------------------------------

print("\n==============================")
print("LAYERING ANALYSIS")
print("==============================")


layering = detect_layering(
    graph,
    wallet
)


if not layering:

    print(
        "No multi-hop layering detected."
    )

else:

    for pattern in layering:

        print("\nWallet:")
        print(
            pattern["wallet"]
        )

        print(
            "Hop distance:",
            pattern["hop_distance"]
        )

        print(
            "Description:",
            pattern["description"]
        )