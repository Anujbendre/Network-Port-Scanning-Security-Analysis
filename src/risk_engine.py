def assess_risk(port_data):

    port = port_data["port"]
    state = port_data["state"]
    service = port_data["service"].lower()

    if state == "filtered":
        return "Informational"

    if state == "closed":
        return "Low"

    if state != "open":
        return "Informational"

    # Services that deserve higher security attention
    high_attention_ports = {
        21,    # FTP
        23,    # Telnet
        445,   # SMB
        3389,  # RDP
        5900   # VNC
    }

    if port in high_attention_ports:
        return "High Attention"

    # Remote administration services
    medium_attention_ports = {
        22,    # SSH
        135,   # RPC
        139    # NetBIOS
    }

    if port in medium_attention_ports:
        return "Medium Attention"

    # Common web services
    review_ports = {
        80,
        443,
        8080,
        8443
    }

    if port in review_ports:
        return "Review Required"

    if service in {
        "ftp",
        "telnet",
        "ssh",
        "http",
        "https"
    }:
        return "Review Required"

    return "Low Attention"