import sys
from pathlib import Path
from datetime import datetime


# =========================================================
# PROJECT PATH
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# =========================================================
# PROJECT MODULES
# =========================================================

from src.scanner_parser import parse_nmap_xml
from src.risk_engine import assess_risk
from src.recommendations import get_recommendation


# =========================================================
# NMAP XML FILE
# =========================================================

XML_PATH = (
    PROJECT_ROOT
    / "scans"
    / "port-scanning"
    / "service-version-scan.xml"
)


# =========================================================
# NORMALIZE RISK LABEL
# =========================================================

def normalize_risk(risk):
    """
    Convert risk-engine labels into consistent dashboard labels.
    """

    value = str(risk or "").strip().lower()

    if value in {"critical"}:
        return "Critical"

    if value in {
        "high",
        "high attention",
    }:
        return "High"

    if value in {
        "medium",
        "medium attention",
    }:
        return "Medium"

    if value in {
        "low",
    }:
        return "Low"

    if value in {
        "review",
        "review required",
        "review_required",
    }:
        return "Review"

    return "Informational"


# =========================================================
# LOAD REAL NMAP SCAN
# =========================================================

def load_real_scan():
    """
    Read the latest Nmap XML file and convert it into
    dashboard-friendly port data.
    """

    if not XML_PATH.exists():
        raise FileNotFoundError(
            f"Nmap XML file not found: {XML_PATH}"
        )

    parsed_ports = parse_nmap_xml(
        str(XML_PATH)
    )

    ports = []

    for item in parsed_ports:

        port_data = {
            "port": item.get("port"),
            "protocol": str(
                item.get("protocol") or "tcp"
            ).upper(),

            "state": str(
                item.get("state") or "unknown"
            ).lower(),

            "service": (
                item.get("service")
                or "unknown"
            ),

            "version": (
                item.get("product")
                or item.get("version")
                or "Unknown"
            ),
        }

        # -------------------------------------------------
        # Calculate risk
        # -------------------------------------------------

        raw_risk = assess_risk(port_data)

        risk = normalize_risk(raw_risk)

        port_data["risk"] = risk

        ports.append(port_data)

    return ports


# =========================================================
# BUILD SECURITY FINDINGS
# =========================================================

def build_findings(ports):

    findings = []

    finding_id = 1

    for port in ports:

        state = str(
            port.get("state") or ""
        ).lower()

        if state != "open":
            continue

        risk = normalize_risk(
            port.get("risk")
        )

        # Informational items are not treated
        # as security findings.
        if risk == "Informational":
            continue

        service = (
            port.get("service")
            or "unknown"
        )

        port_number = port.get(
            "port",
            "N/A"
        )

        try:
            recommendation = get_recommendation(
                port,
                risk
            )
        except Exception:
            recommendation = (
                "Review the exposed service, "
                "restrict unnecessary network access, "
                "and apply appropriate security controls."
            )

        findings.append(
            {
                "id": finding_id,

                "severity": risk,

                "title": (
                    f"{str(service).upper()} "
                    f"Service Requires Review"
                ),

                "port": port_number,

                "protocol": (
                    port.get("protocol")
                    or "TCP"
                ),

                "service": service,

                "description": (
                    f"An {service} service was "
                    f"detected on TCP port "
                    f"{port_number}."
                ),

                "impact": (
                    "The exposed service increases "
                    "the network attack surface and "
                    "should be reviewed."
                ),

                "recommendation": recommendation,
            }
        )

        finding_id += 1

    return findings


# =========================================================
# BUILD SECURITY RECOMMENDATIONS
# =========================================================

def build_recommendations(ports):

    recommendations = []

    recommendation_id = 1

    for port in ports:

        state = str(
            port.get("state") or ""
        ).lower()

        if state != "open":
            continue

        risk = normalize_risk(
            port.get("risk")
        )

        if risk == "Informational":
            continue

        service = (
            port.get("service")
            or "unknown"
        )

        port_number = port.get(
            "port",
            "N/A"
        )

        try:
            action = get_recommendation(
                port,
                risk
            )
        except Exception:
            action = (
                "Review this exposed service "
                "and apply appropriate network "
                "security controls."
            )

        recommendations.append(
            {
                "id": recommendation_id,

                "priority": risk,

                "title": (
                    f"Review "
                    f"{str(service).upper()} Service"
                ),

                "port": port_number,

                "service": service,

                "category": "Network Security",

                "status": "Pending",

                "action": action,

                "reason": (
                    f"Port {port_number} is "
                    f"currently reported as open."
                ),
            }
        )

        recommendation_id += 1

    return recommendations


# =========================================================
# DASHBOARD DATA
# =========================================================

def get_dashboard_data():

    # -----------------------------------------------------
    # Load Nmap data
    # -----------------------------------------------------

    ports = load_real_scan()

    # -----------------------------------------------------
    # Open ports
    # -----------------------------------------------------

    open_ports = [
        port
        for port in ports
        if str(
            port.get("state") or ""
        ).lower() == "open"
    ]

    # -----------------------------------------------------
    # Unique services
    # -----------------------------------------------------

    services = {
        str(port.get("service"))
        for port in ports
        if port.get("service")
    }

    # -----------------------------------------------------
    # Findings
    # -----------------------------------------------------

    findings = build_findings(
        ports
    )

    # -----------------------------------------------------
    # Recommendations
    # -----------------------------------------------------

    recommendations = build_recommendations(
        ports
    )

    # -----------------------------------------------------
    # Risk counts
    # -----------------------------------------------------

    high_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        in {"High", "Critical"}
    )

    medium_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        == "Medium"
    )

    review_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        == "Review"
    )

    low_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        == "Low"
    )

    critical_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        == "Critical"
    )

    informational_count = sum(
        1
        for finding in findings
        if finding.get("severity")
        == "Informational"
    )

    # -----------------------------------------------------
    # Final dashboard response
    # -----------------------------------------------------

    return {
        "target": "10.59.47.15",

        "target_status": "ONLINE",

        "scan_type": (
            "TCP + Service Detection"
        ),

        "scan_status": "Completed",

        "open_ports": len(open_ports),

        "services_detected": len(services),

        "security_findings": len(findings),

        "risk_summary": {
            "critical": critical_count,
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "review": review_count,
            "informational": informational_count,
        },

        "ports": ports,

        "findings": findings,

        "recommendations": recommendations,

        "generated_at": (
            datetime.now().isoformat()
        ),
    }