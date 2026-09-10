import xml.etree.ElementTree as ET
from pathlib import Path


def parse_nmap_xml(xml_file):
    """
    Parse an Nmap XML scan and return structured port information.
    """

    xml_path = Path(xml_file)

    if not xml_path.exists():
        raise FileNotFoundError(f"Nmap XML file not found: {xml_path}")

    tree = ET.parse(xml_path)
    root = tree.getroot()

    results = []

    for host in root.findall("host"):

        address_element = host.find("address")

        if address_element is not None:
            target_ip = address_element.get("addr")
        else:
            target_ip = "Unknown"

        ports_element = host.find("ports")

        if ports_element is None:
            continue

        for port in ports_element.findall("port"):

            port_number = port.get("portid")
            protocol = port.get("protocol")

            state_element = port.find("state")

            if state_element is not None:
                state = state_element.get("state")
            else:
                state = "unknown"

            service_element = port.find("service")

            service_name = "unknown"
            product = ""
            version = ""

            if service_element is not None:
                service_name = service_element.get("name", "unknown")
                product = service_element.get("product", "")
                version = service_element.get("version", "")

            results.append({
                "target": target_ip,
                "port": int(port_number),
                "protocol": protocol,
                "state": state,
                "service": service_name,
                "product": product,
                "version": version
            })

    return results