from datetime import datetime

import networkx as nx


RAPID_MOVEMENT_THRESHOLD = 30 * 60  # 30 minutes


def parse_timestamp(timestamp):

    if not timestamp:
        return None

    try:

        return datetime.fromisoformat(
            timestamp.replace(
                "Z",
                "+00:00"
            )
        )

    except ValueError:

        return None


def detect_rapid_movements(
    transactions,
    wallet_address
):

    wallet = wallet_address.lower()

    incoming = []
    outgoing = []

    # --------------------------------------------
    # Separate incoming and outgoing transactions
    # --------------------------------------------

    for tx in transactions:

        timestamp = parse_timestamp(
            tx.get("blockTimestamp")
        )

        if timestamp is None:
            continue

        tx_from = (
            tx.get("from") or ""
        ).lower()

        tx_to = (
            tx.get("to") or ""
        ).lower()

        if tx_to == wallet:

            incoming.append({
                "timestamp": timestamp,
                "transaction": tx
            })

        elif tx_from == wallet:

            outgoing.append({
                "timestamp": timestamp,
                "transaction": tx
            })

    # --------------------------------------------
    # Sort chronologically
    # --------------------------------------------

    incoming.sort(
        key=lambda x: x["timestamp"]
    )

    outgoing.sort(
        key=lambda x: x["timestamp"]
    )

    rapid_movements = []

    # --------------------------------------------
    # Match incoming → subsequent outgoing
    # --------------------------------------------

    for incoming_tx in incoming:

        incoming_time = incoming_tx[
            "timestamp"
        ]

        best_match = None
        best_delay = None

        for outgoing_tx in outgoing:

            outgoing_time = outgoing_tx[
                "timestamp"
            ]

            if outgoing_time < incoming_time:
                continue

            delay = (
                outgoing_time - incoming_time
            ).total_seconds()

            if delay <= RAPID_MOVEMENT_THRESHOLD:

                if (
                    best_delay is None
                    or delay < best_delay
                ):

                    best_delay = delay
                    best_match = outgoing_tx

        if best_match is None:
            continue

        incoming_record = incoming_tx[
            "transaction"
        ]

        outgoing_record = best_match[
            "transaction"
        ]

        rapid_movements.append({

            "wallet": wallet,

            "pattern": "RAPID_MOVEMENT",

            "description":
                "Funds were received and subsequently sent within a short time.",

            "delay_seconds":
                int(best_delay),

            "incoming_tx":
                incoming_record.get("hash"),

            "outgoing_tx":
                outgoing_record.get("hash"),

            "incoming_value":
                incoming_record.get("value", 0),

            "outgoing_value":
                outgoing_record.get("value", 0)

        })

    return rapid_movements


def detect_fan_patterns(
    graph
):

    patterns = []

    for wallet in graph.nodes:

        incoming = graph.in_degree(
            wallet
        )

        outgoing = graph.out_degree(
            wallet
        )

        if outgoing >= 5:

            patterns.append({

                "wallet": wallet,

                "pattern": "FAN_OUT",

                "description":
                    "This wallet distributes funds to multiple wallets.",

                "incoming": incoming,

                "outgoing": outgoing
            })

        if incoming >= 5:

            patterns.append({

                "wallet": wallet,

                "pattern": "FAN_IN",

                "description":
                    "Multiple wallets send funds to this wallet.",

                "incoming": incoming,

                "outgoing": outgoing
            })

    return patterns


def detect_layering(
    graph,
    suspect_wallet,
    max_hops=5
):

    suspect = suspect_wallet.lower()

    results = []

    if suspect not in graph:
        return results

    # Find wallets reachable from the suspect wallet.
    reachable = nx.single_source_shortest_path_length(
        graph,
        suspect,
        cutoff=max_hops
    )

    for wallet, distance in reachable.items():

        if wallet == suspect:
            continue

        # Three or more hops are treated as
        # a potential multi-hop layering path.
        if distance >= 3:

            results.append({

                "wallet": wallet,

                "pattern":
                    "MULTI_HOP_LAYERING",

                "description":
                    "Funds can move from the suspect wallet through multiple intermediary hops.",

                "hop_distance":
                    distance
            })

    return results