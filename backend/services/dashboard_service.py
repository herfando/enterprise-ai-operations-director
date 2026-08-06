from backend.departments.production.dashboard import production_dashboard


def get_dashboard(department):

    dashboards = {
        "production": production_dashboard,
    }

    dashboard = dashboards.get(department.lower())

    if not dashboard:

        return {"status": "error", "message": f"Dashboard {department} belum tersedia"}

    return dashboard()
