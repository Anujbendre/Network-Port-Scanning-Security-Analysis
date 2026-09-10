def get_recommendation(port_data, risk_level):

    port = port_data["port"]
    service = port_data["service"].lower()
    state = port_data["state"]

    if state != "open":
        return (
            "No immediate service exposure recommendation. "
            "Continue monitoring the port state."
        )

    recommendations = {
        21: (
            "If FTP is not required, disable it. If required, "
            "restrict access and prefer secure alternatives such as SFTP."
        ),

        22: (
            "Restrict SSH access to trusted hosts or networks, "
            "use strong authentication, and disable unnecessary access."
        ),

        23: (
            "Telnet transmits credentials without adequate encryption. "
            "Disable Telnet and use SSH or another secure alternative."
        ),

        80: (
            "Review whether HTTP is required. Use HTTPS for applications "
            "that handle credentials or sensitive information."
        ),

        135: (
            "Review Windows RPC exposure and restrict access using "
            "Windows Firewall and appropriate network rules."
        ),

        139: (
            "Review NetBIOS exposure and disable it if it is not required. "
            "Restrict access to trusted networks."
        ),

        445: (
            "Review SMB exposure. Restrict SMB access using Windows "
            "Firewall and network controls, and ensure Windows is "
            "fully updated."
        ),

        3389: (
            "Restrict RDP access to trusted networks or VPN users. "
            "Use strong authentication and keep Remote Desktop "
            "and Windows security updates current."
        ),

        5900: (
            "Review VNC exposure and restrict remote access to "
            "trusted hosts. Use secure authentication and encryption."
        ),
    }

    if port in recommendations:
        return recommendations[port]

    if service in {"http", "https"}:
        return (
            "Review the web service configuration, authentication, "
            "TLS settings, and exposure to untrusted networks."
        )

    if service == "ssh":
        return (
            "Restrict SSH access to trusted systems and use strong "
            "authentication and current security updates."
        )

    return (
        "Verify whether this service is required. If unnecessary, "
        "disable it. Otherwise restrict access using firewall rules "
        "and keep the service securely configured and updated."
    )