import json


def process_marketing_order(ai_result):

    """
    Proses hasil AI dari Marketing Order
    """

    if isinstance(ai_result, str):

        try:
            ai_result = json.loads(
                ai_result.replace("```json", "")
                .replace("```", "")
            )

        except:
            raise Exception(
                "AI result bukan JSON"
            )


    # cek kelengkapan data

    required_fields = [
        "product_name",
        "buyer_name",
        "order_quantity",
        "unit",
        "unit_selling_price",
        "unit_production_cost",
        "currency",
        "delivery_date"
    ]


    missing = []


    orders = ai_result.get(
        "data",
        {}
    ).get(
        "orders",
        []
    )


    for order in orders:

        for field in required_fields:

            if field not in order or order[field] in [
                "",
                None
            ]:
                missing.append(
                    {
                        "product": order.get(
                            "product_name",
                            ""
                        ),
                        "missing_field": field
                    }
                )


    # kalau ada data kurang

    if missing:

        return {
            "status": "NEED_CORRECTION",
            "missing_data": missing
        }


    # kalau lengkap

    schedules = []


    for order in orders:

        if order.get(
            "product_status"
        ) == "New":

            schedules.append(
                {
                    "type": "RND_TRIAL",
                    "product": order["product_name"],
                    "quantity": order["order_quantity"]
                }
            )


            schedules.append(
                {
                    "type": "PRODUCTION",
                    "product": order["product_name"],
                    "quantity": order["order_quantity"]
                }
            )


        else:

            schedules.append(
                {
                    "type": "PRODUCTION",
                    "product": order["product_name"],
                    "quantity": order["order_quantity"]
                }
            )


    return {
        "status": "APPROVED",
        "orders": orders,
        "generated_schedule": schedules
    }