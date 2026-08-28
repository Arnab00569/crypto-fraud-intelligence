import networkx as nx

from blockchain.patterns import (
    detect_fan_patterns,
    detect_layering
)


graph = nx.DiGraph()


suspect = "0xAAA"

wallet_b = "0xBBB"
wallet_c = "0xCCC"
wallet_d = "0xDDD"

wallet_e = "0xEEE"
wallet_f = "0xFFF"
wallet_g = "0xGGG"

# ------------------------------------------------
# LAYERING
# ------------------------------------------------

graph.add_edge(
    suspect,
    wallet_b
)

graph.add_edge(
    wallet_b,
    wallet_c
)

graph.add_edge(
    wallet_c,
    wallet_d
)

# ------------------------------------------------
# FAN-OUT
# ------------------------------------------------

graph.add_edge(
    suspect,
    wallet_e
)

graph.add_edge(
    suspect,
    wallet_f
)

graph.add_edge(
    suspect,
    wallet_g
)

# Add more outgoing wallets
graph.add_edge(
    suspect,
    "0x111"
)

graph.add_edge(
    suspect,
    "0x222"
)


print("\n==============================")
print("SYNTHETIC FRAUD PATTERN DEMO")
print("==============================")


# FAN ANALYSIS

patterns = detect_fan_patterns(
    graph
)


print("\nFan Patterns:")


for pattern in patterns:

    print(
        pattern["pattern"],
        "→",
        pattern["wallet"]
    )

    print(
        pattern["description"]
    )


# LAYERING

layering = detect_layering(
    graph,
    suspect
)


print("\nLayering Patterns:")


for pattern in layering:

    print(
        pattern["pattern"],
        "→",
        pattern["wallet"]
    )

    print(
        "Hop:",
        pattern["hop_distance"]
    )