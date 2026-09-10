def analyze_port(port_data):

    port = port_data["port"]
    state = port_data["state"]
    service = port_data["service"]

    analysis = {
        "port": port,
        "state": state,
        "service": service,
        "observation": "",
        "risk_level": "Informational"
    }

    if state == "open":

        analysis["observation"] = (
            f"Port {port} is open and the service "
            f"'{service}' was detected."
        )

        analysis["risk_level"] = "Review Required"

    elif state == "closed":

        analysis["observation"] = (
            f"Port {port} is closed. No service is "
            f"currently accepting connections."
        )

        analysis["risk_level"] = "Low"

    elif state == "filtered":

        analysis["observation"] = (
            f"Port {port} is filtered. A filtering mechanism "
            f"prevented Nmap from determining the port state."
        )

        analysis["risk_level"] = "Informational"

    else:

        analysis["observation"] = (
            f"Port {port} has an unknown state."
        )

    return analysis