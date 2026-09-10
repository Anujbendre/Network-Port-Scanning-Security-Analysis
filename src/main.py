from pathlib import Path

from scanner_parser import parse_nmap_xml
from port_analyzer import analyze_port
from risk_engine import assess_risk
from recommendations import get_recommendation


BASE_DIR = Path(__file__).resolve().parent.parent

XML_FILE = (
    BASE_DIR
    / "scans"
    / "port-scanning"
    / "service-version-scan.xml"
)

REPORT_DIR = BASE_DIR / "reports"

REPORT_FILE = REPORT_DIR / "security-findings.txt"


def main():

    print("=" * 70)
    print("NETWORK PORT SCANNING & SECURITY ANALYSIS")
    print("=" * 70)

    print(f"\nInput XML:")
    print(XML_FILE)

    try:
        ports = parse_nmap_xml(XML_FILE)

    except FileNotFoundError as error:
        print(f"\nERROR: {error}")
        return

    if not ports:
        print("\nNo port information found.")
        return

    REPORT_DIR.mkdir(exist_ok=True)

    findings = []

    for port_data in ports:

        analysis = analyze_port(port_data)

        risk_level = assess_risk(port_data)

        recommendation = get_recommendation(
            port_data,
            risk_level
        )

        finding = {
            "target": port_data["target"],
            "port": port_data["port"],
            "protocol": port_data["protocol"],
            "state": port_data["state"],
            "service": port_data["service"],
            "product": port_data["product"],
            "version": port_data["version"],
            "risk": risk_level,
            "observation": analysis["observation"],
            "recommendation": recommendation
        }

        findings.append(finding)

    # Display results
    for finding in findings:

        print("\n" + "-" * 70)

        print(f"Port           : {finding['port']}")
        print(f"Protocol       : {finding['protocol']}")
        print(f"State          : {finding['state']}")
        print(f"Service        : {finding['service']}")
        print(f"Product        : {finding['product'] or 'Unknown'}")
        print(f"Version        : {finding['version'] or 'Unknown'}")
        print(f"Risk           : {finding['risk']}")

        print(
            f"Observation    : "
            f"{finding['observation']}"
        )

        print(
            f"Recommendation : "
            f"{finding['recommendation']}"
        )

    # Generate report
    with open(REPORT_FILE, "w", encoding="utf-8") as report:

        report.write(
            "NETWORK PORT SCANNING & SECURITY ANALYSIS\n"
        )

        report.write("=" * 70 + "\n\n")

        report.write(
            f"Target: {findings[0]['target']}\n"
        )

        report.write(
            f"Total Results: {len(findings)}\n\n"
        )

        report.write("=" * 70 + "\n")

        report.write("SECURITY FINDINGS\n")

        report.write("=" * 70 + "\n")

        finding_number = 1

        for finding in findings:

            report.write(
                f"\nFinding {finding_number:02d}\n"
            )

            report.write("-" * 70 + "\n")

            report.write(
                f"Port           : {finding['port']}\n"
            )

            report.write(
                f"Protocol       : {finding['protocol']}\n"
            )

            report.write(
                f"State          : {finding['state']}\n"
            )

            report.write(
                f"Service        : {finding['service']}\n"
            )

            report.write(
                f"Product        : "
                f"{finding['product'] or 'Unknown'}\n"
            )

            report.write(
                f"Version        : "
                f"{finding['version'] or 'Unknown'}\n"
            )

            report.write(
                f"Risk Level     : {finding['risk']}\n"
            )

            report.write(
                f"\nObservation:\n"
                f"{finding['observation']}\n"
            )

            report.write(
                f"\nRecommendation:\n"
                f"{finding['recommendation']}\n"
            )

            finding_number += 1

    print("\n" + "=" * 70)

    print("ANALYSIS COMPLETE")

    print(f"\nReport generated:")
    print(REPORT_FILE)

    print("=" * 70)


if __name__ == "__main__":
    main()