import networkx as nx


def create_transaction_graph(transactions):

    graph = nx.MultiDiGraph()

    for tx in transactions:

        sender = tx.get("from")
        receiver = tx.get("to")

        if not sender or not receiver:
            continue

        sender = sender.lower()
        receiver = receiver.lower()

        value = tx.get("value", 0)
        asset = tx.get("asset", "UNKNOWN")
        tx_hash = tx.get("hash")

        timestamp = tx.get(
            "blockTimestamp"
        )

        graph.add_node(
            sender,
            type="wallet"
        )

        graph.add_node(
            receiver,
            type="wallet"
        )

        graph.add_edge(
            sender,
            receiver,
            key=tx_hash,
            value=value,
            asset=asset,
            tx_hash=tx_hash,
            timestamp=timestamp
        )

    return graph


def get_wallet_metrics(
    graph,
    wallet_address
):

    wallet = wallet_address.lower()

    if wallet not in graph:

        return {
            "exists": False
        }

    incoming = graph.in_degree(
        wallet
    )

    outgoing = graph.out_degree(
        wallet
    )

    return {

        "exists": True,

        "incoming_connections":
            incoming,

        "outgoing_connections":
            outgoing,

        "total_connections":
            incoming + outgoing
    }


def detect_flow_patterns(graph):

    patterns = []

    for wallet in graph.nodes:

        incoming = graph.in_degree(
            wallet
        )

        outgoing = graph.out_degree(
            wallet
        )

        if incoming >= 5:

            patterns.append({

                "wallet": wallet,

                "pattern": "fan_in",

                "incoming": incoming,

                "outgoing": outgoing
            })

        if outgoing >= 5:

            patterns.append({

                "wallet": wallet,

                "pattern": "fan_out",

                "incoming": incoming,

                "outgoing": outgoing
            })

    return patterns